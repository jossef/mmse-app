(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.factory("SharedService", function ($location, $rootScope, growl, localStorageService) {

        var exam = localStorageService.get('exam') || {};

        $rootScope.$watch(function () {
                return exam;
            },
            function (newValue) {
                localStorageService.set('exam', newValue);
                console.log(newValue);
            }, true);

        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
        var validStages = ['optal', 'start', 'time', 'place', 'noun'];
        var nouns = ['time', 'year', 'thing', 'way', 'side', 'end', 'car', 'team', 'idea', 'work'];
        var imageNouns = ['door', 'hand', 'water', 'eye', 'money', 'face', 'house', 'car', 'party', 'book'];

        return {
            days: days,
            nouns: nouns,
            imageNouns: imageNouns,
            months: months,
            seasons: seasons,
            getExam: getExam,
            clearExam: clearExam,
            showNotification: showNotification,
            contains: contains,
            shuffle: shuffle,
            isValidStage: isValidStage,
            go: go
        };

        function showNotification(message) {
            growl.success(message);
        }

        function getExam() {
            return exam;
        }

        function clearExam() {
            for (var member in exam) {
                delete exam[member];
            }
        }

        function go(path) {
            $location.path(path);
        }

        function isValidStage(stage) {
            return contains(stage, validStages);
        }

        function contains(item, array) {
            var currentItem;
            var i;

            for (i in array) {
                currentItem = array[i];
                if (angular.equals(item, currentItem)) {
                    return true;
                }
            }

            return false;
        }

        function shuffle(array) {
            var clone = array.slice();
            for (var j, x, i = clone.length; i; j = Math.floor(Math.random() * i), x = clone[--i], clone[i] = clone[j], clone[j] = x);
            return clone;
        }
    });

})();