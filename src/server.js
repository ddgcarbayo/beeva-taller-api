var express =           require('express')
    , bodyParser =      require('body-parser')
    , methodOverride =  require('method-override')
    , cookieParser =    require('cookie-parser')
    , cookieSession =   require('cookie-session')
    , session =         require('express-session')
    , csrf =            require('csurf')
    , compress =        require('compression')
    , fs =              require('fs')
    , cors =            require('cors');

var _  =  require('underscore');

//npm install --save method-override express-session cookie-session body-parser

var app = express();
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(cookieParser());
	app.use(session({secret: 'aaaaa', saveUninitialized: true, resave: true}));
	app.use(compress());
	app.use(cors());

// inMemory Data
var data = [{ "key": "Values", "values": [ [ 1 , 7] , [ 2 , 4], [ 3 , 6], [5 , 1] ] }];

// GET method route
app.get('/data', function (req, res) {
    res.send(data);
});

// POST method route
app.post('/data', function (req, res) {

	if (_.isArray(req.body)) {

		var input = _.flatten(req.body);
		var memory = data[0].values;

		_.each(input, function(value) {
			memory.push([memory.length,value]);
		});

		res.send({result:'ok'});

	} else {
	  res.status(500).send('Something broke!');
	}
   
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    res.send('hello world');
});


var server = app.listen(8080, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Server runnint at http://%s:%s', host, port);

});