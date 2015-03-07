(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.factory("SharedService", function ($location, $rootScope, growl, localStorageService) {

        var path;
        var exam = localStorageService.get('exam') || {};

        $rootScope.$watchCollection(function () {
                return exam;
            },
            function (newValue) {
                localStorageService.set('exam', newValue);
            });


        return {
            getExam: getExam,
            clearExam: clearExam,
            showNotification: showNotification,
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
    });

})();