(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.controller("ExamController", function ($scope,$window, $routeParams, SharedService) {
        var vm = $scope;
        vm.stage = $routeParams.stage;
        vm.exam = SharedService.getExam();

        vm.isValidStage = SharedService.isValidStage(vm.stage);
        if (vm.stage == 'finish')
        {
            SharedService.clearExam();
        }

        vm.back = function()
        {
            $window.history.back();
        };
    });

})();