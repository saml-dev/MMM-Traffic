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
		this.loaded = false;
		this.url = 'https://maps.googleapis.com/maps/api/directions/json' + this.getParams();
		this.sendSocketNotification('TRAFFIC_URL', this.url);
	},

	getDom: function() {
		if (!this.loaded) {
			var wrapper = document.createElement("div");
			wrapper.innerHTML = "Loading commute...";
			return wrapper;
		}

		var wrapper = document.createElement("div");
		wrapper.className = "normal medium"

		var duration = this.config.commute;
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
	},

	socketNotificationReceived: function(notification, payload) {
		Log.error('got socket');
		if (notification === 'TRAFFIC_COMMUTE') {
			Log.error('in if statement');
			this.config.commute = payload;
			this.updateDom(1000);
		}
	}

});
