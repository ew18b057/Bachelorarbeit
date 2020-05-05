'use strict';

// These two dependencies remain the same
var tessel = require('tessel');
var http = require('http');

// Require two other core Node.js modules
var fs = require('fs');
var url = require('url');


// run webserver
var server = http.createServer(function(request, response) {
    // Break up the url into easier-to-use parts
    var urlParts = url.parse(request.url, true);

    // run function alarm here ??? and test when button pressed 
    alarm();
    showIndex(urlParts.pathname, request, response);
});

// Stays the same
server.listen(8080);

// Stays the same
console.log('Server running at http://192.168.1.101:8080/');

// Respond to the request with smoke.html page
function showIndex(url, request, response) {
    // Create a response header telling the browser to expect html
    response.writeHead(200, { "Content-Type": "text/html" });

    // Use fs to read in index.html
    fs.readFile(__dirname + '/smoke.html', function(err, content) {
        // If there was an error, throw to stop code execution
        if (err) {
            throw err;
        }
        // Serve the content of smoke.html read in by fs.readFile
        response.end(content);
    });
}


/* from code pen (button, date, time, work in code pen) */

window.addEventListener("load", () => {
    var testButton = document.getElementById("test-control-button");

    testButton.addEventListener("click", (event) => {
        console.log("Button pressed.")
            // call test function 
        test();
    });
});


/* displaying current date */
n = new Date();
y = n.getFullYear();
m = n.getMonth();
d = n.getDate();
document.getElementById("date").innerHTML = d + "." + m + "." + y;

/* function for adding a zero in front of 0 to 9 seconds or minutes */
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

/* function for displaying time */
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers < 10
    m = addZero(m);
    s = assZero(s);
    document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
    t = setTimeout(function() {
        startTime()
    }, 500);
}
startTime();


// GPIO Input for alarm
function alarm() {
    var ledRed = tessel.led[0];
    var pinAlarm = tessel.port.A.pin[2]; // Select pin 2 on port A
    ledRed.off();
    // Register an event. When the voltage on pin2 falls, turn on red LED
    // pin.on --> Invoke the callback whenever the event occurs
    // pin.once -->Invoke the callback the first time the event occurs
    pinAlarm.on('fall', function() {
        console.log("PIN A2 read: Alarm");
        // TODO change element id or class of /div in html 
        // TODO alarm-indicator.alarm is set to red
        // TODO update alarm entry with current date and time in ol in html
        ledRed.on();
    });
    pinAlarm.on('rise', function() {
        console.log("PIN A2 read: no Alarm");
        ledRed.off();
    });
}


// GPIO Output for test button
function test() {
    var ledGreen = tessel.led[2];
    var pinTest = tessel.port.A.pin[7]; // Select pin 7 on port A
    ledGreen.off();
    pinTest.write(1, (error, buffer) => {
        if (error) {
            throw error;
        }
        console.log("PIN A7 set to: " + buffer.toString() + " -> Test");
        // TODO update alarm entry with current date and time in ol in html
        ledGreen.on();
        popupTest();
    });
}

// pop up message when test button was pressed
function popupTest() {
    alert("Test initiated!");
};