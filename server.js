#!/usr/bin/env node

(function () {
    'use strict';
    var expressPort = 8080;
    var expressIPAddress = '0.0.0.0';

    var chalk = require('chalk');
    var express = require("express");
    var bodyParser = require('body-parser');
    var path = require("path");
    var expressApp = express();
    var http = require('http').Server(expressApp);
    var webSockets = require('socket.io')(http);
    var events = require('events');

    // --------------------------------
    // Express JS

    // Parse application/json
    expressApp.use(bodyParser.json());

    // Static files
    expressApp.use('/static/', express.static(path.join(__dirname, 'static')));

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


})();