#!/usr/bin/env node

(function () {
    'use strict';

    var chalk = require('chalk');
    var express = require("express");
    var fs = require('fs');
    var expressApp = express();
    var http = require('http').Server(expressApp);
    var events = require('events');
    var mmse = require('./mmse');

    // --------------------------------
    // Persistence

    var persistanceFilename = 'mmse-data.json';
    var db = JSON.parse(fs.readFileSync(persistanceFilename, 'utf8'));

    for (var userId in db.exams) {
        var item = db.exams[userId];

        item.history.forEach(function (exam) {
            var score = mmse.calculateExamScore(exam);
            console.log(chalk.bold.yellow(exam.date), chalk.cyan(score));
        });
    }


})
();