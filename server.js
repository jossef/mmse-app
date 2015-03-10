#!/usr/bin/env node

(function () {
    'use strict';
    var expressPort = 8080;
    var expressIPAddress = '0.0.0.0';

    var chalk = require('chalk');
    var express = require("express");
    var bodyParser = require('body-parser');
    var path = require("path");
    var fs = require('fs');
    var expressApp = express();
    var http = require('http').Server(expressApp);
    var events = require('events');
    var dateFormat = require('dateformat');
    var mmse = require('./mmse');


    // --------------------------------
    // Persistence

    var db;
    var persistanceFilename = 'mmse-data.json';
    var exists = fs.existsSync(persistanceFilename);

    if (exists) {
        db = JSON.parse(fs.readFileSync(persistanceFilename, 'utf8'));
    }
    else {
        db = {
            exams: {},
            statistics: {}
        };
    }

    function persist() {
        fs.writeFile(persistanceFilename,
            JSON.stringify(db, null, 2), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("JSON saved to " + persistanceFilename);
                }
            }
        )
    }

    // --------------------------------
    // Express JS

    // Parse application/json
    expressApp.use(bodyParser.json());

    // Static files
    expressApp.use('/static/', express.static(path.join(__dirname, 'static')));

    // REST API
    expressApp.get("/api/exams/", function (request, response) {

        var exams = [];
        var userId;
        for (userId in db.exams)
        {
            var exam = db.exams[userId];

            exams.push({
                id: userId,
                name: exam.history[0].name,
                score: exam.history[0].score.total
            })

        }
        response.json(exams);
    });

    expressApp.get("/api/exams/:userId", function (request, response) {

        var userId = request.params.userId;

        var exam = db.exams[userId];
        var history = exam && exam.history || [];

        response.json(history);
    });

    expressApp.post("/api/exams/", function (request, response) {

        var exam = request.body;
        var maxHistoryItems = 10;

        var userId = exam.id;
        var dbExam = db.exams[userId];
        if (!dbExam) {
            dbExam = {
                history: []
            };

            db.exams[userId] = dbExam;
        }

        // ------------------------------------
        // Calculate Score

        var score = mmse.calculateExamScore(exam);
        exam.score = score;

        // ------------------------------------
        //

        var now = new Date();
        exam.date = dateFormat(now, "yyyy-mm-dd h:MM:ss");
        while (dbExam.history.length > maxHistoryItems)
        {
            dbExam.history.pop();
        }

        dbExam.history.unshift(exam);
        persist();

        return response.json(dbExam);
    });

    // Root Page
    expressApp.get("/", function (request, response) {
        response.sendFile(path.join(__dirname, 'static', 'index.html'));
    });


    // --------------------------------
    // Listen
    http.listen(expressPort, expressIPAddress);

    console.log(chalk.bold.yellow('LISTENING'), 'express', chalk.cyan(expressIPAddress), chalk.cyan(expressPort));

    function errorHandler(error) {
        if (error) {
            console.log(chalk.bold.red('ERROR'), error);
        }
    }

    process.on('uncaughtException', function (err) {
        // Ignored Purposely (client disconnection can cause ECONNRESET)
        // so this type of unhandled errors go here instead of crashing the process

        console.log(chalk.bold.red('ERROR'), err);
    });

})
();