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

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "TRAFFIC"){

			//console.log(this.tasks.inbox[0]);
			this.updateDom(1000);
		}
	},

	start: function() {
		this.tasks = []
		this.sendSocketNotification('WUNDERLIST_CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	},

	},
	getDom: function() {
		var wrapper = document.createElement("table");
		wrapper.className = "normal small light"

		var todos = this.getTodos()
		console.log(todos);

		for (var i = 0; i < todos.length; i++) {
			var titleWrapper =  document.createElement("tr");
			titleWrapper.innerHTML = todos[i];
			titleWrapper.className = "title bright";
			wrapper.appendChild(titleWrapper);
		}
		return wrapper;
	}

});
