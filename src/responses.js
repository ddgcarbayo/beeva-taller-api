var request       = require('request');
var Q = require('q');

var responses = {
    key : 'AIzaSyCXUzZqfijRjjAanivcA6orpuwPXyjJD00',
    error : function(req,res,next,code,msg){
        res.send({
            code : code,
            message : msg
        });
        next();
    },
    success : function(req,res,next,code,data){
        res.send({
            code : code,
            data : data
        });
        next();
    },
    request : function(uri,cb){
        var options = {
            method: 'GET',
            uri: uri
        };

        request(options, function(error, response) {
            if(!error){
                cb(JSON.parse(response.body));
            } else {
                cb(false);
            }
        });
    },
    getPlaces : function(lat,long){
        return Q.Promise(function(resolve,reject){
            responses.request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?opennow=true&types=bar&key='+responses.key+'&location='+lat+','+long+'&radius=3000',function(data) {
                if(data!==false){
                    resolve(data);
                }else{
                    reject('Error obteniendo datos en el mapa');
                }
            });
        });
    },
    getIpPlace : function(ip){
        return Q.Promise(function(resolve,reject){
            responses.request('http://ip-api.com/json/'+ip,function(data) {
                if(data!==false){
                    resolve(data);
                }else{
                    reject('Error obteniendo datos de la IP');
                }
            });
        });
    },
    getWeather : function(lat,long){

        return Q.Promise(function(resolve,reject){
            responses.request('http://api.openweathermap.org/data/2.5/weather?units=metric&lang=es&lat='+lat+'&lon='+long,function(data) {
                if(data!==false){
                    resolve(data);
                }else{
                    reject('Error obteniendo datos del tiempo');
                }
            });
        });
    },
    bares : function(req,res,next){
        //var ip = (req.connection.remoteAddress || false);
        var ip = '213.27.146.180'; //parche trabajo en local
        responses.getIpPlace(ip).then(function(data){
            var lat = data.lat;
            var long = data.lon;
            var city = data.city;
            Q.all([ responses.getWeather(lat,long), responses.getPlaces(lat,long) ])
                .then(function(results){
                    var response = {
                        weather : results[0].main,
                        maps : results[1].results,
                        info : {
                            lat : lat,
                            long : long,
                            city : city
                        }
                    };
                    response.weather.icon = results[0].weather[0].icon;
                    return responses.success(req,res,next,200,response);
                },function(err){
                    console.log(err);
                    return responses.error(req,res,next,404,[]);
                });
        },function(err){
            return responses.error(req,res,next,404,[]);
            console.log(err);
        });
    }
};

module.exports = responses;