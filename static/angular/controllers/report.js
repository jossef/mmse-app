(function () {
    'use strict';

    var app = angular.module('mmse-app');

    app.controller("ReportController", function ($scope, $http, $routeParams) {
        var vm = $scope;
        vm.selected = 0;
        vm.showHistory = false;

        vm.setSelected = function (index, exam) {
            vm.selected = index;
            vm.setExam(exam);
        };

        vm.chartData = null;
        var chartDataOffsets = null;
        var chartDataOffsetsLabels = {};

        vm.setExam = function (exam) {

            for (var key in exam.score) {

                if (key == 'total')
                {
                    continue;
                }

                var value = exam.score[key];
                var index = chartDataOffsets[key];
                vm.chartData[index].val_1 = value;
            }
        };

        $http.get('/api/exams/' + $routeParams.id).success(function (data) {
            vm.exams = data;

            if (!data || !data.length) {
                return;
            }

            var itemsCount = 0;
            var referenceExam = data[0];

            if (!chartDataOffsets) {
                chartDataOffsets = {};
                for (var key in referenceExam.score) {

                    if (key == 'total')
                    {
                        continue;
                    }
                    chartDataOffsets[key] = itemsCount;
                    chartDataOffsetsLabels[itemsCount] = key;
                    itemsCount++;
                }
            }

            vm.chartData = new Array(itemsCount);
            var avarage = new Array(itemsCount);
            var index;

            for (var i in data) {
                var exam = data[i];

                for (var key in exam.score) {

                    if (key == 'total')
                    {
                        continue;
                    }

                    var value = exam.score[key];
                    index = chartDataOffsets[key];

                    if (!avarage[index]) {
                        avarage[index] = 0;
                    }

                    avarage[index] += value;
                }
            }

            for (index in avarage) {
                if (!vm.chartData[index]) {
                    vm.chartData[index] = {
                        val_0: 0,
                        val_1: 0
                    };
                }

                var avg = avarage[index] / vm.exams.length;
                vm.chartData[index].x = +index;
                vm.chartData[index].val_0 = avg;
            }

            vm.setExam(referenceExam);
        });

        vm.getTotalTime = function (exam) {
            if (exam.duration.total) {
                return exam.duration.total;
            }

            var total = 0;
            for (var key in exam.duration) {

                var item = exam.duration[key];
                total += item;
            }

            exam.duration.total = total;

            return total;
        };

        vm.$watchCollection('avarage', function (newValue) {

            vm.chartOptions = {
                series: [
                    {
                        y: "val_0",
                        label: "Average",
                        color: "#7e7e7e",
                        axis: "y",
                        type: "line",
                        thickness: "1px",
                        dotSize: 2,
                        id: "series_0",
                        drawDots: true
                    },
                    {
                        y: "val_1",
                        axis: "y",
                        label: "This Exam",
                        color: "#079cf5",
                        type: "line",
                        thickness: "3px",
                        dotSize: 2,
                        id: "series_1",
                        drawDots: true
                    }
                ],
                stacks: [{axis: "y", series: []}],
                axes: {
                    x: {type: "linear", key: "x"},
                    y: {type: "linear"},
                    y2: {type: "linear"}
                },
                lineMode: "linear",
                tension: 0.7,
                tooltip: {
                    mode: "scrubber", formatter: function (x, y, series) {
                        return chartDataOffsetsLabels[x] + "";
                    }
                },
                drawLegend: true,
                drawDots: true,
                columnsHGap: 5
            };

        });

    });

})();