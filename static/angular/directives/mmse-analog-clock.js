(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.directive('mmseAnalogClock', function (SharedService) {
        return {
            require: 'ngModel',
            templateUrl: '/static/views/mmse-analog-clock.html',
            scope: {},
            link: function (vm, element, attrs, ngModel) {


                var hours;
                var minutes;

                vm.$watch(function () {
                        return ngModel.$modelValue;
                    },
                    function (value) {

                        if (ngModel.$viewValue) {
                            hours = ngModel.$viewValue.hours;
                            minutes = ngModel.$viewValue.minutes;

                        }
                        else {
                            hours = SharedService.getRandomInt(0, 12);
                            minutes = SharedService.getRandomInt(0, 4) * 15;

                        }

                        vm.hours = hours;
                        vm.minutes = minutes;

                        ngModel.$setViewValue({hours: hours, minutes: minutes});
                    }, true);


            }
        }
    });

})();