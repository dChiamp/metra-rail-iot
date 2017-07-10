var five = require('johnny-five');

function oledBoard () {

  var board = new five.Board();  

  board.on("ready", function() {  
      console.log('Arduino connected');
      led = new five.Led(2);
  });

}

oledBoard()


module.exports = oledBoard;