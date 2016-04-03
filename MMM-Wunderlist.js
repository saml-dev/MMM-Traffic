/* global Module */

/* Magic Mirror
 * Module: MMM-Wunderlist
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('MMM-Wunderlist',{
	
	defaults: {
		lists: ["inbox"],
		interval: 60
	},
	
	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "WUNDERLIST"){
			if (payload.hasOwnProperty("lists")){
			}
		}
		else if (notification === "WUNDERLIST_TASKS"){
			var list_name = payload.list_name.replace(/\s+/g, '');
			if(this.tasks.indexOf(list_name) == -1) {
				this.tasks[list_name] = []
				this.tasks[list_name].push(payload.tasks)
			}
			else {
				this.tasks[list_name].push(payload.tasks)
			}
			//console.log(this.tasks.inbox[0]);
			this.updateDom(3000);
		}
	},
	
	start: function() {
		this.tasks = []
		this.sendSocketNotification('WUNDERLIST_CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	},
	
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.className = "normal small light"
		var tasks = []
		for (var i = 0; i < this.config.lists.length; i++) {
			if (typeof this.tasks[this.config.lists[i].replace(/\s+/g, '')] != 'undefined'){
				tasks.push.apply(tasks, this.tasks[this.config.lists[i].replace(/\s+/g, '')][0]);
			}
		}
		
		if (tasks.length > 0){
		wrapper.innerHTML = tasks.join("<br />")

		for (var i = 0; i < tasks.length ; i++) {
			//console.log(tasks[i]);
		}

		return wrapper;
		}
		else {
			wrapper.innerHTML = "You have nothing to do."
		}
		return wrapper;
	}

});