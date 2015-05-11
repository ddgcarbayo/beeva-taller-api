/*************************************
//
// p1 app
//
**************************************/

// express magic
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var device  = require('express-device');
var bodyParser = require('body-parser');

var runningPortNumber = process.env.PORT;


// I need to access everything in '/public' directly
app.use(express.static(__dirname + '/public'));

//set the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname +'/views');

//app.use(bodyParser.json());

app.use(function(req, res, next) {
    req.rawBody = '';
    //req.setEncoding('utf8');

    req.on('data', function(chunk) {
        req.rawBody += chunk;
    });

    req.on('end', function() {
        var bodyOriginal=req.body;
        try{
            if(req.rawBody){
                var body = JSON.parse(req.rawBody);
                req.body=body;
            }
        }catch(e){
            req.body=bodyOriginal;
        }
        next();
    });
});



var objetoChat = [];

app.get("/", function(req, res){
	res.render('index', {});
});

app.get("/object", function(req, res){
    res.json(objetoChat);
});

app.post("/webhook", function(req, res){
    try{
        console.log(req.body);
        var user = req.body.pusher.name;
        var repo = req.body.repository.name;
        objetoChat.unshift('<span style="color:blue">El usuario '+user+' ha hecho commit en el respositorio '+repo+'</span>');
        io.sockets.emit('update', objetoChat);
    }catch(e){
        objetoChat.unshift('<span style="color:red">Error '+JSON.stringify(e)+'</span>');
        io.sockets.emit('update', objetoChat);
        console.log(e);
    }
    res.json({result : 200});
});


io.sockets.on('connection', function (socket) {

    objetoChat.unshift("<span style=\"color:green !important\">Nuevo cliente conectado</span>");
	io.sockets.emit('update', objetoChat);

	socket.on('update', function(data, fn){
		objetoChat.unshift(data.msg);
		io.sockets.emit('update', objetoChat);
		fn();//call the client back to clear out the field
	});

    socket.on('clean', function(data, fn){
        objetoChat=[];
        io.sockets.emit('update', objetoChat);
        fn();//call the client back to clear out the field
    });

    socket.on('disconnect', function () {
        objetoChat.unshift('<span style="color:red">Usuario desconectado</span>');
        io.sockets.emit('update',objetoChat);
    });

});


server.listen(runningPortNumber);

