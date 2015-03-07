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
            }, true);

        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
        var validStages = ['optal', 'start', 'time', 'place'];

        return {
            days: days,
            months: months,
            seasons: seasons,
            getExam: getExam,
            clearExam: clearExam,
            showNotification: showNotification,
            contains: contains,
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
    });

})();