jQuery( document ).ready(function() {
  console.log( "ready!" );


  $('#display-info').on('click', function() {
    var msg = jQuery('#msg').val()
    if (msg != undefined) {
      socket.emit('message', msg);
    } else {
      alert("enter message")
    }
  });

  socket.on('message', function(msg){
    console.log('msg ', msg);
    // parseRailData (data) 
  });

  $('#clear-info').on('click', function() {
    socket.emit('clear');
  });

  socket.on('clear', function(msg){
    console.log('msg ', msg);
    // parseRailData (data) 
  });

  $('#get-weather').on('click', function() {
    socket.emit('get-weather');
  });

  socket.on('get-weather', function(data){
    console.log('data ', data);
    parseWeatherData(data) 
  });


  var globalStationId;

  var stationIds = {
    'chinaTown': 80410,
    'southwestMuseum': 80413
  }

  var stationNames  = {
    '80410': 'chinaTown',
    '80413': 'southwestMuseum'
  }

  var destinations = {
    "804_0_var0": 'Asuza / North',
    "804_0_var1": 'Asuza / South',
    "804_1_var0": 'Atlantic / South',
    "804_1_var1": 'Atlantic / North'
  }

  $('#station-select').on('change', function() {
    reset();

    var stationId = $(this).val();
    globalStationId = stationId
    console.log("globalStationId", globalStationId);

  });

  $('#get-times').on('click', function() {

    if (globalStationId != undefined ) {
      var stationName =  stationNames[globalStationId]

      console.log('stationName ', stationName)
      // getInfo(url, parseRailData)
      socket.emit('rail', globalStationId, stationName);

    } else {
      console.log("select a station")
      alert("select a station from dropdown")
      reset();
    }

  });

  socket.on('rail', function( data){
    // console.log('data ', data);
    parseRailData (data) 
  });

  function parseWeatherData (data) {
    var currentWeather = data['current_observation'];
    var feelsLike = currentWeather['feelslike_string'];
    var weather = currentWeather['weather'];
    var WindString = currentWeather['wind_string'];
    var uv = currentWeather['UV'];
    var icon = currentWeather['icon'];

    $('#current-weather').html("<i class='wi wi-wu-"+ icon +"'> </i>");
    $('#feels-like').html("Feels Like " + feelsLike);
    $('#wind-string').html("Wind " + WindString);

    console.log('currentWeather', currentWeather, 'feelsLike', feelsLike, 'weather', weather, 'WindString', WindString, 'uv', uv)

  }

    // parse return and render info
  function parseRailData (info) {
    console.log("parseRailData: ", data)
    var data = info.items
    for ( var i = 0; i < data.length; i++ ) {
      
      var stop = data[i]
      var direction = stop['run_id']

      var destination = destinations[direction]
      var minutes = stop['minutes']

      displayColor(minutes, destination)

      console.log("destination: ", destination, "minutes: ", minutes);

      $('#stop-info').append("<li> destination: " + destination + " departing in: " + minutes+ "</li>")

    }

  }

  // Render color info
  function displayColor (time, destination) {
    // console.log("time", time)

    if (time >= 1 && time <= 6 || time >= 14 && time <= 30)  {
      $("#red").removeClass('hide');
      // $("#green, #yellow").addClass('hide');
    } else if  (time >= 6 && time <= 9 ) {
      $("#yellow").removeClass('hide');
      $("#yellow-destination").text(destination);
      $("#yellow-ttd").text(time.toString());

    } else if (time >= 9 && time <= 13 ) {
      console.log('time', time)

      $("#green").removeClass('hide');
      
      $("#green-destination").text(destination);
      $("#green-ttd").text(time.toString());
      
    } else {
      console.log('time', time, 'not worth it')

    }
  }


  function reset () {
    $("#yellow, #red, #green").addClass('hide');
  }

})