(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.controller("ShellController", function ($scope, SharedService) {
            var vm = $scope;
            vm.shared = SharedService;
        }
    );

})();