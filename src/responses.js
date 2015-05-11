var request       = require('request');

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
                cb(response.body);
            } else {
                cb(false);
            }
        });
    },
    getPlaces : function(lat,long,cb){
      responses.request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key='+key+'&location='+lat+','+long+'&radius=3000',function(data){
            console.log(data);
            cb(data);
      });
    },
    getIpPlace : function(ip,cb){
        responses.request('http://ip-api.com/json/'+ip,function(data){
            console.log(data);
            cb(data);
        });
    },
    getWeather : function(city,country){
        responses.request('http://api.openweathermap.org/data/2.5/weather?q='+city+','+country,function(data){
            console.log(data);
            cb(data);
        });
    },
    bares : function(req,res,next){
        //https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDeCXCJhyxs_T-MxVfbIhE1RogHkXur5Oc&location=40.4352,-3.6729&radius=3000
        // https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyCXUzZqfijRjjAanivcA6orpuwPXyjJD00&location=40.4352,-3.6729&radius=3000
        // http://ip-api.com/json/208.80.152.201
        // http://api.openweathermap.org/data/2.5/weather?q=Madrid,es
        var ip = (req.connection.remoteAddress || false);
        if(ip)

        return responses.success(req,res,next,200,[]);
    }
};

module.exports = responses;