var restify = require('restify');
var server = restify.createServer();
var responses = require(__dirname+'/responses');

server.get('/random/:min/:max', responses.random);
server.get('/random/:min/:max/:decimales', responses.random);



server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});