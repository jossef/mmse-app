(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.directive('mmseReportScore', function () {
        return {
            templateUrl: '/static/views/mmse-report-score.html',
            scope: {
                score:'='
            }

        }
    });

})();