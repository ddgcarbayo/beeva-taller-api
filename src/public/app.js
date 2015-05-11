(function(angular) {
    'use strict';
    var myApp = angular.module('myApp', ['uiGmapgoogle-maps']);
    myApp.controller('myCntr', ['$scope','$http', function($scope,$http) {
        $scope.bares=[];
        $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        $http.get('/bares').
        then(function(data){
            console.log(data);
        },function(err){

        });
    }]);


})(window.angular);