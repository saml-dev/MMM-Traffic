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
		destination: '',
		traffic_model: 'best_guess',
		departure_time: 'now'
	},

	start: function() {
		Log.info('Starting module: ' + this.name);
		this.loaded = false;
		this.url = 'https://maps.googleapis.com/maps/api/directions/json' + this.getParams();
		this.symbols = {};
		this.symbols['driving'] = 'fa fa-car';
		this.symbols['walking'] = 'fa fa-odnoklassniki';
		this.symbols['bicycling'] = 'fa fa-bicycle';
		this.symbols['transit'] = 'fa fa-train';
		this.sendSocketNotification('TRAFFIC_URL', this.url);
		setInterval(this.updateCommute, this.config.interval * 1000, this);
	},

	updateCommute: function(self) {
		self.sendSocketNotification('TRAFFIC_URL', this.url);
	},

	getStyles: function() {
		return ['traffic.css'];
	},

	getDom: function() {
		if (!this.loaded) {
			var wrapper = document.createElement("div");
			wrapper.innerHTML = "Loading commute...";
			return wrapper;
		}
		var wrapper = document.createElement('div');
		var table = document.createElement("table");
		table.className = "bright medium";
		var row = document.createElement("tr");

		//symbol
		var symbolWrapper = document.createElement("td");
		symbolWrapper.className = 'symbol';
		var symbol = document.createElement('span');
		symbol.className = this.symbols[this.config.mode] + ' symbol';
		symbolWrapper.appendChild(symbol);
		row.appendChild(symbolWrapper);

		//commute time
		var trafficInfo = document.createElement('td');
		trafficInfo.className = 'trafficInfo';
		trafficInfo.innerHTML = "Current commute is " + this.config.commute;
		row.appendChild(trafficInfo);

		//add to wrapper
		table.appendChild(row);
		wrapper.appendChild(table);
		return wrapper;
	},

	getParams: function() {
		var params = '?';
		params += 'mode=' + this.config.mode;
		params += '&origin=' + this.config.origin;
		params += '&destination=' + this.config.destination;
		params += '&key=' + this.config.api_key;
		params += '&traffic_model=' + this.config.traffic_model;
		params += '&departure_time=now';
		return params;
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === 'TRAFFIC_COMMUTE') {
			Log.info('received TRAFFIC_COMMUTE');
			this.config.commute = payload;
			this.loaded = true;
			this.updateDom(1000);
		}
	}

});
