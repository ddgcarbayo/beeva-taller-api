(function(angular) {
    'use strict';
    var myApp = angular.module('myApp', ['uiGmapgoogle-maps','geolocation']);

    myApp.service('Bares',['$http',function($http){
        return {
          get : function(lat,long){
              var uri ='/bares';
              if(lat && long){
                  uri+='?lat='+lat+'&long='+long;
              }
              return $http.get(uri);
          }
        };
    }]);

    myApp.controller('myCntr', ['$scope','Bares','geolocation', function($scope,Bares,geolocation) {
        $scope.bares=[];
        $scope.weather = false;
        $scope.map = false;
        var getBares = function(lat,long){
            Bares.get(lat,long).then(function(res){
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
                        zoom : 14
                    };
                    console.log($scope.map);
                }catch(e){
                    info=false;
                }
                console.log(info);
            },function(err){
                console.error('Error obteniendo bares');
            });
        };

        $scope.getBaresGeo = function(){
            geolocation.getLocation().then(function(data){
                getBares(data.coords.latitude,data.coords.longitude);
            });
        };

        getBares();

    }]);


})(window.angular);