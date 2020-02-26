var tessel = require('tessel');

tessel.port.A.pin[2].input();

function read() {
    tessel.port.A.pin[2].read(function(error, data) {
        console.log(data);
        read();
    });
}

/*
setInterval(function() {
    read();
}, 1000);
*/