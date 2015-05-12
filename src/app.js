var app = angular.module("myApp", ['nvd3ChartDirectives']);

app.controller("myNoteCtrl", function($scope,$http) {

    $scope.cheese = [];
    $scope.bar = [];

    $http.get('http://localhost:3001/data?type=cheese').
        success(function(data, status, headers, config) {
            $scope.data.cheese = data;
        }).
        error(function(data, status, headers, config) {
            console.log('error');
        });


    $http.get('http://localhost:3001/data?type=bar').
        success(function(data, status, headers, config) {
            $scope.data.bar = {};
        }).
        error(function(data, status, headers, config) {
            console.log('error');
        });
});
