var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var responses = require(__dirname+'/responses');

var auth = {
    users : [
        { _id : 1 , app_id : 'app', secret : 'secret'}
    ],
    secret : 'secreto secretisimo',
    token : function(req,res,next){
        var app_id = req.query.app_id || false;
        var secret = req.query.secret || false;
        if(!app_id || !secret) return responses.error(req,res,next,404,'App o secret erróneo');
        for (var i= 0, len = auth.users.length; i< len ; i++){
            var user=auth.users[i];
            if( user.app_id === app_id && user.secret === secret){
                var token = jwt.sign({ _id : user._id }, auth.secret, { expiresInMinutes: 60*5 });
                return responses.success(req,res,next,200,{
                    token : token
                });
            }
        }
        return responses.error(req,res,next,404,'App o secret erróneo');
    },
    check : function(req,res,next){
        if(req.query && req.query.hasOwnProperty('access_token')) {
            req.headers.authorization = 'Bearer ' + req.query.access_token;
        }
        var token = req.query.access_token || false;

        jwt.verify(token, auth.secret,function(err,decoded) {
            if (err) return responses.error(req, res, next, 401, 'Token incorrecto');
            if (!err){
                for (var i = 0, len = auth.users.length; i < len; i++) {
                    var user = auth.users[i];
                    if (user._id === decoded._id) {
                        return next();
                    }
                }
            }
            return responses.error(req,res,next,401,'Token incorrecto');
        });
    }
};

module.exports=auth;
