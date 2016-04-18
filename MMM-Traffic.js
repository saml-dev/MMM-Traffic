/* global Module */

/* Magic Mirror
 * Module: MMM-Traffic
 *
 * By Sam Lewis https://github.com/SamLewis0602
 * MIT Licensed.
 */

Module.register('MMM-Traffic',{

	defaults: {
		api_key: '',
		mode: 'driving',
		interval: 60,
		origin: '',
		destination: ''
	},

	start: function() {
		Log.info('Starting module: ' + this.name);
	},

	getDirections: function(callback) {

	},

	getDom: function() {
		Log.error("in getDom")

		var wrapper = document.createElement("div");
		wrapper.className = "normal medium"

		var duration = this.traffic.routes[0].legs[0].duration.text;
		wrapper.innerHTML = "Current commute is " + duration;

		return wrapper;
	
	},

	getParams: function() {
		var params = '?';
		params += 'mode=' + this.config.mode;
		params += '&origin=' + this.config.origin;
		params += '&destination=' + this.config.destination;
		params += '&key=' + this.config.api_key;
		return params;
	}

});
