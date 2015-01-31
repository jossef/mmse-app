(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.controller("ResultsController", function ($scope, SharedService) {
        var vm = $scope;
        vm.devices = SharedService.devices;
        vm.common = SharedService;

    });

})();