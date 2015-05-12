var restify = require('restify');
var server = restify.createServer();
var responses = require(__dirname+'/responses');
var auth = require(__dirname+'/auth');

server.use(restify.queryParser());

server.get('/bares/', responses.bares);
//server.get('/random/:min/:max/:decimales', auth.check, responses.random);

server.get(/^\/?.*/, restify.serveStatic({
    directory: __dirname + '/public',
    default: 'index.html'
}));


//server.get('/token',auth.token);


server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
