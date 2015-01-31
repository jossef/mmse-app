#!/usr/bin/env node

(function () {
    'use strict';
    var expressPort = 8080;
    var expressIPAddress = '0.0.0.0';
    var mongoDBUrl = 'mongodb://127.0.0.1:27017/MMSE-App';

    var chalk = require('chalk');
    var express = require("express");
    var bodyParser = require('body-parser');
    var path = require("path");
    var expressApp = express();
    var http = require('http').Server(expressApp);
    var webSockets = require('socket.io')(http);
    var mongoClient = require('mongodb').MongoClient;
    var events = require('events');
    var nodemailer = require('nodemailer');
    var config = require('./config');

    var db = {};

    // --------------------------------
    // Mongo DB


    mongoClient.connect(mongoDBUrl, function (err, mongoContext) {
        if (err) {
            console.error(chalk.red('Could not connect to MongoDB!'));
            console.log(chalk.red(err));
        }
        else {

            console.log(chalk.bold.green('CONNECTED'), 'mongodb', chalk.cyan(mongoDBUrl));

            mongoContext.createCollection('devices', errorHandler);
            db.devices = mongoContext.collection('devices');

        }
    });


    // --------------------------------
    // Express JS

    // Parse application/json
    expressApp.use(bodyParser.json());

    // Static files
    expressApp.use('/static/', express.static(path.join(__dirname, 'static')));

    // REST API
    expressApp.get("/api/devices/", function (request, response) {
        db.devices.find({},{_id:1, occupied:1, occupiedSince:1, lastActive:1}).toArray(function (err, devices) {
            response.json(devices);
        });
    });

    expressApp.get("/api/devices/:id", function (request, response) {

        var deviceId = request.params.id;
        db.devices.findOne({_id: deviceId},{_id:1, occupied:1, occupiedSince:1, lastActive:1}, function (err, device) {
            response.json(device);
        });

    });

    expressApp.post("/api/devices/:id/subscribe", function (request, response) {

        var deviceId = request.params.id;
        var body = request.body;

        if (!body.email) {
            return response.json({error: 'email must be provided'});
        }

        if (!validateEmail(body.email)) {
            return response.json({error: 'invalid email provided'});
        }

        // Persist in database
        db.devices.update(
            {_id: deviceId},
            {
                $addToSet: {
                    subscribers: body.email
                }
            },
            {},
            function (err, rowsAffected) {
                response.json({success: new Boolean(rowsAffected)});
            });

    });

    // Root Page
    expressApp.get("/", function (request, response) {
        response.sendFile(path.join(__dirname, 'static', 'index.html'));
    });


    // --------------------------------
    // Listen
    http.listen(expressPort, expressIPAddress);

    console.log(chalk.bold.yellow('LISTENING'), 'express', chalk.cyan(expressIPAddress), chalk.cyan(expressPort));

    // --------------------------------
    // Error Handlers

    function errorHandler(error) {
        if (error) {
            console.log(chalk.bold.red('ERROR'), error);
        }
    }

    process.on('uncaughtException', function (err) {
        // Ignored Purposely (client disconnection can cause ECONNRESET)
        // so this type of unhandled errors go here instead of crashing the process
    });

    // -----------------------

    // TODO export to different module:

    function onDeviceOccupationUpdate(deviceId, occupied) {

        var now = new Date();

        db.devices.findOne({_id: deviceId},
            function (err, device) {

            var shouldNotify = true;
            if (device) {
                shouldNotify = device.occupied != occupied;
            }
            else {
                device = {
                    occupiedSince: now
                }
            }

            // Persist in database
            db.devices.update(
                {_id: deviceId},
                {
                    $set: {
                        occupied: occupied,
                        lastActive: now,
                        occupiedSince: now,
                    }
                },
                {upsert: true},
                errorHandler);

            if (shouldNotify) {

                // PUB/SUB via web sockets
                var message = {
                    _id: deviceId,
                    lastActive: now,
                    occupied: occupied,
                    occupiedSince: device.occupiedSince
                };

                // Notify all subscribers
                webSockets.emit('devices:update', message);
                sendNotificationMail(device);
            }

        });

    }

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function sendNotificationMail(device) {

        if(!device.subscribers)
        {
            return;
        }

        var to = '';
        device.subscribers.forEach(function(subsciber){
            if (!to)
            {
                to += ', ';
            }
            to += subsciber;
        });

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: 'updaterdownloader@gmail.com', // sender address
            to: to, // list of receivers
            subject: device._id + ' is unoccupied', // Subject line
            text: device._id + ' is unoccupied', // plaintext body
            html: '<b>'+ device._id + 'is unoccupied ✔</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    }
})();