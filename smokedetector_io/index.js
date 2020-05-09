
 var tessel = require('tessel'); // Import tessel
 
 var pinAlarm = tessel.port.A.pin[2]; 
 
 var ledRed = tessel.led[0]; 
 var alarmState = 0;

 setInterval(function(){
	 if(alarmState == 0){
		 pinAlarm.on('rise', function() {
		 console.log("PIN A2 read: alarm");
		 ledRed.on();
		 alarmState = 1;
	 });	
	 }
	 else
		 if (alarmState = 1){
			 pinAlarm.on('fall', function() {
			 console.log("PIN A2 read: no alarm");
			 ledRed.off();
			 alarmState = 0;
			 });
		 }
 }, 1000);


// working not prooerly ?? 0,6V and 3,3V??
	//pinAlarm.read(function(error, number) {
		//if (error) {
			//throw error;
		//}
		//if(number = 1){
			//ledRed.on();
			//console.log(number); // 1 if "high"
		//}
		//else
			//console.log(number); // 0 if "low"
			//ledRed.off();
