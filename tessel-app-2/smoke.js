'use strict';

// These two dependencies remain the same
var tessel = require('tessel');
var http = require('http');

// Require two other core Node.js modules
var fs = require('fs');
var url = require('url');

// Alarm Pin and red Led declaration
var alarmState = false;
var pinAlarm = tessel.port.A.pin[2];
var ledRed = tessel.led[0];

// Alarm pin defined to pulldown for a clean GND signal of 0.0V
pinAlarm.pull("pulldown");

// variant polling, since status change from high/low and falling
// and rising edges not detected reliably
setInterval(readoutAlarmState, 100);

function readoutAlarmState() {
    pinAlarm.read((error, value) => {
        console.log("DEBUG", "Interval", value)
        if (value) {
            console.log("PIN A2 read: alarm");
            ledRed.on();
            alarmState = true;
        } else {
            console.log("PIN A2 read: no alarm");
            ledRed.off();
            alarmState = false;
        }
    });
}

var server = http.createServer(function(request, response) {
    // Break up the url into easier-to-use parts
    var urlParts = url.parse(request.url, true);

    // Create a regular expression to match requests to toggle LEDs
    var alarm = /alarm-test/;

    if (urlParts.pathname.match(alarm)) {
        // If there is a request containing the string 'alarm-test' call a function
        return alarmTest(urlParts.pathname, request, response);
    } else {
        // All other request will call a function, showIndex
        return showIndex(urlParts.pathname, request, response);
        // insert detection function of alarm here?? if alarm is detected
        // change div to red ? alarmState ?
    }
});

// Stays the same
server.listen(8080);

// Stays the same
console.log('Server running at http://192.168.1.101:8080/');

// Respond to the request with our index.html page
function showIndex(url, request, response) {
    // Create a response header telling the browser to expect html
    response.writeHead(200, { "Content-Type": "text/html" });

    // Use fs to read in index.html
    fs.readFile(__dirname + '/index.html', function(err, content) {
        // If there was an error, throw to stop code execution
        if (err) {
            throw err;
        }

        // Serve the content of index.html read in by fs.readFile 
        // replace placeholder with string
        response.end(content.toString().replace("$$alarm$$", alarmState ? "class='alarm'" : ""));
    });
}

// Toggle test pin and green led in the url and respond with to home page again

function alarmTest(url, request, response) {

    var ledGreen = tessel.led[2];
    var pinTest = tessel.port.A.pin[7];

    pinTest.toggle((error, buffer) => {
        if (error) {
            throw error;
        }
    });
    // respond with status code 302 and redirect to homepage
    ledGreen.toggle();
    response.writeHead(302, { Location: "/" });
}