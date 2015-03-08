(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.directive('mmseAnalogClock', function (SharedService) {
        return {
            require: 'ngModel',
            templateUrl: '/static/views/mmse-analog-clock.html',
            scope: {},
            link: function (vm, element, attrs, ngModel) {

                var hours = vm.hours = SharedService.getRandomInt(0, 12);
                var minutes = vm.minutes = SharedService.getRandomInt(0, 5) * 10;

                ngModel.$setViewValue([hours, minutes]);

            }
        }
    });

})();