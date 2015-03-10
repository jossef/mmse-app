(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.controller("ReportsController", function ($scope, $http) {
        var vm = $scope;

        $http.get('/api/exams').success(function(data){
            vm.exams = data;
        });

    });

})();