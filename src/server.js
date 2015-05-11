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


app.configure(function(){
	// I need to access everything in '/public' directly
	app.use(express.static(__dirname + '/public'));

	//set the view engine
	app.set('view engine', 'ejs');
	app.set('views', __dirname +'/views');

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(function(req, res, next) {
        req.rawBody = '';
        req.setEncoding('utf8');

        req.on('data', function(chunk) {
            req.rawBody += chunk;
        });

        req.on('end', function() {
            if(req.rawBody){
                var body = JSON.parse(req.rawBody);
                req.body=body;
            }
            next();
        });
    });

	app.use(device.capture());
});


// logs every request
app.use(function(req, res, next){
	// output every request in the array
	console.log({method:req.method, url: req.url, device: req.device});

	// goes onto the next function in line
	next();
});

var objetoChat = [];

app.get("/", function(req, res){
	res.render('index', {});
});

app.get("/object", function(req, res){
    res.json(objetoChat);
});

app.post("/webhook", function(req, res){
    var user = req.body.user;
    var repo = req.body.repository.name;
    objetoChat.push('<span style="">El usuario '+user+' ha hecho commit en el respositorio '+repo+'</span>');
    io.sockets.emit('update', objetoChat);
    res.json({result : 200});
});


io.sockets.on('connection', function (socket) {

    objetoChat.unshift("<span style=\"color:red !important\">Nuevo cliente conectado</span>");
	io.sockets.emit('update', objetoChat);

	socket.on('update', function(data, fn){
		objetoChat.unshift(data.msg);
		io.sockets.emit('update', objetoChat);
		fn();//call the client back to clear out the field
	});

});


server.listen(runningPortNumber);

