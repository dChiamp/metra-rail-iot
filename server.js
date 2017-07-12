
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var router = express.Router();
var methodOverride = require('method-override')

require('dotenv').config();

var index = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

/*
var five = require('johnny-five'),
    font = require('oled-font-5x7'),
    Oled = require('oled-js');

var led,
    oled,
    board = new five.Board();  

board.on("ready", function() {  
  console.log('Arduino connected');

  var opts = {
    width: 128,
    height: 64,
    address: 0x3C
  };

  oled = new Oled(board, five, opts);
  led = new five.Led(2);

});
*/

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('get-weather', function(){
    var weatherUrl = `http://api.wunderground.com/api/${process.env.WUNDERGROUND_API_KEY}/conditions/q/CA/Los_Angeles.json`
    getInfo(weatherUrl, 'get-weather');
  });


  /*
  socket.on('clear', function(){
    console.log('clear');
    oled.clearDisplay();
    io.emit('message');
  });

  socket.on('message', function(msg){
    // led.blink();
    io.emit('message', msg);

    oled.clearDisplay();
    oled.setCursor(1, 1);
    oled.writeString(font, 1, msg, 1, true, 10);
    console.log('message: ' + msg);
  });

  socket.on('rail', function(stationId, stationName){
    const getURL = `http://api.metro.net/agencies/lametro-rail/routes/804/stops/${stationId}/predictions`

    //getInfo(getURL, 'rail', parseData)

    request({
      method: 'GET',
      url: getURL
    },
    function (error, response, info) {
      if (error) {
        return console.error('request failed:', error);
      } else {
        var data = JSON.parse(info);
        console.log('getInfo data: ', data);

        io.emit('rail', data);

        parseData(data, stationName)

      }

    })
    console.log('rail endpoint' + stationId);


  });
  */

});

function getInfo (url, socket, cb) {
      request({
      method: 'GET',
      url: url
    },
    function (error, response, info) {
      if (error) {
        return console.error('request failed:', error);
      } else {
        var data = JSON.parse(info);
        console.log('getInfo data: ', data);
        io.emit(socket, data)
      }

    })
}


var destinations = {
  "804_0_var0": 'Asuza / N.',
  "804_0_var1": 'Asuza / S.',
  "804_1_var0": 'Atlantic / S.',
  "804_1_var1": 'Atlantic / N.'
}

function parseData (info, stationName) {
  var data = info.items;
  var minDirection = data[0]['run_id'];
  var minDestination = destinations[minDirection];
  var minTime = data[0]['minutes'];

  for ( var i = 0; i < data.length; i++ ) {
    var stop = data[i]
    var direction = stop['run_id']
    var destination = destinations[direction]
    var minutes = stop['minutes']

  	if (minutes >= 8 && minutes <= 13) {
			console.log("destination: ", destination, "minutes: ", minutes);	
			var yellowDirection = data[i]['run_id'];
			var yellowDestination = destinations[yellowDirection];
			var yellowTime = data[i]['minutes'];
  	}
  }

  console.log('minDestination: ', minDestination, 'minTime:', minTime);

  var railInfo = `stop: ${stationName} dest: ${yellowDestination} leaving in: ${yellowTime}`
  oled.clearDisplay();
  oled.setCursor(1, 1);
  oled.writeString(font, 1, railInfo, 1, true, 10);
/*
  for ( var i = 0; i < data.length; i++ ) {
    var stop = data[i]
    var direction = stop['run_id']
    var destination = destinations[direction]
    var minutes = stop['minutes']
    console.log("destination: ", destination, "minutes: ", minutes);
  }*/
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
    

http.listen(3000, function(){
  console.log('listening on *:3000');
});
