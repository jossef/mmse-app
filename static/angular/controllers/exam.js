(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.controller("ExamController", function ($scope, $routeParams, SharedService) {
        var vm = $scope;
        vm.stage = $routeParams.stage;
        vm.exam = SharedService.getExam();

        if (vm.stage == 'start')
        {
            SharedService.clearExam();
        }
    });

})();