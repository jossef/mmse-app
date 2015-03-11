(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.directive('mmseVisnoun', function ($timeout, SharedService) {
        return {
            require: 'ngModel',
            templateUrl: '/static/views/mmse-visnoun.html',
            scope: {},
            link: function (vm, element, attrs, ngModel) {
                var requiredNouns = 3;
                var duration = 10000;

                ngModel.$validators.nouns = function (modelValue, viewValue) {
                    return viewValue && viewValue.length == requiredNouns;
                };

                var nouns = SharedService.shuffle(SharedService.visNouns).splice(0, requiredNouns);
                var index = 0;
                var results = [];

                var nextWord = function () {
                    vm.currentWord = nouns[index];
                    index++;
                };

                vm.started = false;

                vm.start = function () {
                    nextWord();
                    vm.started = true;
                };

                vm.next = function () {

                    if (vm.currentWord) {
                        results.push({noun: vm.currentWord, input: vm.input});
                    }

                    vm.input = '';
                    vm.currentWord = '';


                    if (index >= requiredNouns) {
                        ngModel.$setViewValue(results);
                        vm.started = false;
                        $timeout(angular.noop);
                        return;
                    }

                    nextWord();

                };
            }
        }
    });

})();