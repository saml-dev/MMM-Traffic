/* global Module */

/* Magic Mirror
 * Module: MMM-Wunderlist
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('MMM-Wunderlist',{
	
	defaults: {
		maximumEntries: 10,
		lists: ["inbox"],
		interval: 60,
		fade: true,
		fadePoint: 0.25
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
	
	getTodos: function () {
		var tasks_to_show = []
		
		for (var i = 0; i < this.config.lists.length; i++) {
			if (typeof this.tasks[this.config.lists[i].replace(/\s+/g, '')] != 'undefined'){
				var list = this.tasks[this.config.lists[i].replace(/\s+/g, '')][0]
				
				for (var todo in list){
				tasks_to_show.push(list[todo])
				
				}
			} 		
		}
		return tasks_to_show.slice(0, this.config.maximumEntries);
		
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
			
			// Create fade effect by MichMich (MIT)
			if (this.config.fade && this.config.fadePoint < 1) {
				if (this.config.fadePoint < 0) {
					this.config.fadePoint = 0;
				}
				var startingPoint = todos.length * this.config.fadePoint;
				var steps = todos.length - startingPoint;
				if (i >= startingPoint) {
					var currentStep = i - startingPoint;
					titleWrapper.style.opacity = 1 - (1 / steps * currentStep);
				}
			}
			// End Create fade effect by MichMich (MIT)
		}
		
		
		return wrapper;
	}

});
