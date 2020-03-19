var tessel = require('tessel');

var pin = tessel.port.A.pin[2];

pin.read(function(error, number){
	if(error){
		throw error;
	}
	console.log(number);
});

/*
setInterval(function() {
    read();
}, 1000);
*/