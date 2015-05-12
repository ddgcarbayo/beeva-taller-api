(function(angular) {
    'use strict';
    var myApp = angular.module('myApp', ['uiGmapgoogle-maps']);

    myApp.service('Bares',['$http',function($http){
        return {
          get : function(){
              return $http.get('/bares');
          }
        };
    }]);

    myApp.controller('myCntr', ['$scope','Bares', function($scope,Bares) {
        $scope.bares=[];
        $scope.weather = false;
        $scope.map = false;
        Bares.get().then(function(res){
            var info;
            try{
                info=res.data.data;
                $scope.weather = info.weather;
                $scope.info=info.info;
                var bares=[];
                angular.forEach(info.maps,function(node,i){
                    bares.push({
                       id : i,
                        latitude : node.geometry.location.lat,
                        longitude : node.geometry.location.lng,
                        icon : node.icon,
                        name : node.name,
                        dir : node.vicinity
                    });
                });
                $scope.map = {
                    center : {
                        latitude : $scope.info.lat,
                        longitude : $scope.info.long
                    },
                    markers : bares,
                    zoom : 12
                };
                console.log($scope.map);
            }catch(e){
                info=false;
            }
            console.log(info);
        },function(err){

        });

    }]);


})(window.angular);