(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.factory("ApiService", function ($http) {

            return {
                submitExam:submitExam,
                getExam:getExam
            };

            function submitExam(exam)
            {
                var json = angular.toJson(exam);
                return $http.post('/api/exams', json);
            }

            function getExam(id)
            {
                if (id == undefined)
                {
                    id = '';
                }

                return $http.get('/api/exams/' + id);
            }

        }
    );

})();