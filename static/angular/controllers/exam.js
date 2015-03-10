(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.controller("ExamController", function ($scope, $window, $routeParams, SharedService) {
        var vm = $scope;
        vm.stage = $routeParams.stage;
        vm.exam = SharedService.getExam();

        vm.isValidStage = SharedService.isValidStage(vm.stage);

        vm.back = function () {
            $window.history.back();
        };

        var startTime = new Date();
        vm.next = function (nextStage) {

            var endTime = new Date();

            var duration = endTime.getTime() - startTime.getTime();

            if (!vm.exam.duration) {
                vm.exam.duration = {};
            }

            vm.exam.duration[vm.stage] = duration;


            if (nextStage == 'finish') {
                SharedService.submitExam().success(function () {
                    var id = vm.exam.id;
                    SharedService.clearExam();
                    SharedService.go('/reports/' + id);
                });
            }
            else {
                SharedService.setStage(nextStage);
            }
        }
    });

})();