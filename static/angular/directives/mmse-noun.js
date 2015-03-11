(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.directive('mmseNoun', function ($timeout, SharedService) {
        return {
            require: 'ngModel',
            templateUrl: '/static/views/mmse-noun.html',
            scope: {},
            link: function (vm, element, attrs, ngModel) {
                var requiredNouns = 3;
                var duration = 10000;

                ngModel.$validators.nouns = function (modelValue, viewValue) {
                    return viewValue && viewValue.length == requiredNouns;
                };

                var nouns = SharedService.shuffle(SharedService.nouns).splice(0, requiredNouns);
                var index = 0;

                var processItem = function () {
                    vm.currentWord = nouns[index];
                    index++;

                    if (index <= requiredNouns) {
                        $timeout(processItem, duration);
                    }
                    else {
                        ngModel.$setViewValue(nouns);
                        vm.currentWord = '';
                        $timeout(angular.noop);
                    }
                };

                vm.started = false;
                vm.start = function () {
                    processItem();
                    vm.started = true;
                }

            }
        }
    });

})();