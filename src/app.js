var app = angular.module("myApp", ['nvd3ChartDirectives']);

app.controller("myChartCtrl", function($scope,$http) {

    $scope.data = {};
    $scope.data.bar = [];

    $http.get('http://localhost:3001/data?type=cheese').
        success(function(data, status, headers, config) {
            $scope.data.bar = data;
        }).
        error(function(data, status, headers, config) {
            console.log('error');
            $scope.bar = [];
        });

});
