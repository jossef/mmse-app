(function () {
    'use strict';

    var app = angular.module('mmse-app', [

        // Builtin
        'ngAnimate',
        'ngRoute',

        // External
        'ui.bootstrap',
        'angular-growl',
        'timer',
        'angular.filter',
        'LocalStorageModule',
        'google.places',
        'n3-line-chart'
    ]);

    // ......................................................
    // SPA URL Route states
    app.config(
        function ($routeProvider) {

            $routeProvider

                .when('/', {
                    templateUrl: "/static/views/main.html",
                    controller: 'MainController'
                })
                .when('/exam/:stage', {
                    templateUrl: "/static/views/exam.html",
                    controller: 'ExamController'
                })
                .when('/exam', {
                    templateUrl: "/static/views/exam.html",
                    controller: 'ExamController'
                })
                .when('/reports/:id', {
                    templateUrl: "/static/views/report.html",
                    controller: 'ReportController'
                })
                .when('/reports', {
                    templateUrl: "/static/views/reports.html",
                    controller: 'ReportsController'
                })
                .otherwise({
                    redirectTo: '/'
                });
        });

    // ......................................................
    // Promises Fix
    app.config(
        function ($provide) {
            $provide.decorator('$q', function ($delegate) {
                var defer = $delegate.defer;
                $delegate.defer = function () {
                    var deferred = defer();
                    deferred.promise.success = function (fn) {
                        deferred.promise.then(fn);
                        return deferred.promise;
                    };
                    deferred.promise.error = function (fn) {
                        deferred.promise.then(null, fn);
                        return deferred.promise;
                    };
                    return deferred;
                };
                return $delegate;
            });
        });


    // ......................................................
    // growl
    app.config(
        function (growlProvider) {
            growlProvider.globalReversedOrder(true);
            growlProvider.globalTimeToLive(2000);
            growlProvider.globalPosition('bottom-right');
            growlProvider.globalDisableIcons(true);
            growlProvider.globalDisableCloseButton(true);

        });



})();