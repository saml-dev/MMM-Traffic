/* global Module */

/* Magic Mirror
 * Module: MMM-Traffic
 *
 * By Sam Lewis https://github.com/SamLewis0602
 * MIT Licensed.
 */

Module.register('MMM-Traffic', {

    defaults: {
        api_key: '',
        mode: 'driving',
        interval: 300000, //all modules use milliseconds
        origin: '',
        destination: '',
        traffic_model: 'best_guess',
        departure_time: 'now',
        arrival_time: '',
        loadingText: 'Loading commute...',
        prependText: 'Current commute is',
        changeColor: false,
        showRouteInfo: false,
        showRouteInfoText: '{routeName} via {summary}',
        limitYellow: 10,
        limitRed: 30,
        showGreen: true,
        language: config.language,
        show_summary: true,
        showWeekend: true,
        allTime: true,
        startHr: 7,
        endHr: 22,
	      leaveByText:'Leave by',
        hideOffHours: false,
        showAddress: false,
        showAddressText: 'From {origin}<br>To {destination}'
    },

    start: function() {
        Log.info('Starting module: ' + this.name);
        if (this.data.classes === 'MMM-Traffic') {
          this.data.classes = 'bright medium';
        }
        this.loaded = false;
        this.leaveBy = '';
        this.url = encodeURI('https://maps.googleapis.com/maps/api/directions/json' + this.getParams());
        this.symbols = {
            'driving': 'fa fa-car',
            'walking': 'fa fa-odnoklassniki',
            'bicycling': 'fa fa-bicycle',
            'transit': 'fa fa-train'
        };
        this.commute = '';
        this.summary = '';
        this.updateCommute(this);
    },

    updateCommute: function(self) {
        timeConfig = {
          showWeekend:    self.config.showWeekend,
          allTime:        self.config.allTime,
          startHr:        self.config.startHr,
          endHr:          self.config.endHr
        };

        if (self.config.arrival_time.length == 4) {
          self.sendSocketNotification('LEAVE_BY', {'url':self.url, 'arrival':self.getTodaysArrivalTime(), 'timeConfig':timeConfig});
        } else {
          self.sendSocketNotification('TRAFFIC_URL', {'url':self.url, 'timeConfig':timeConfig});
        }
        setTimeout(self.updateCommute, self.config.interval, self);
    },

    getStyles: function() {
        return ['traffic.css', 'font-awesome.css'];
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        var commuteInfo = document.createElement('div');
        var routeInfo = document.createElement('div');
        var addressDiv = document.createElement('div');

        if (!this.loaded) {
            wrapper.innerHTML = this.config.loadingText;
            return wrapper;
        }

        if ((this.commute == '' || this.commute == '--') && this.config.hideOffHours && !this.config.allTime) {
            wrapper.innerHTML = '';
            return wrapper;
        }

        //symbol
        var symbol = document.createElement('span');
        symbol.className = this.symbols[this.config.mode] + ' symbol';
        commuteInfo.appendChild(symbol);

        //commute
        var trafficInfo = document.createElement('span');
        if (!this.config.arrival_time) {
          //commute time
          trafficInfo.innerHTML = this.config.prependText + ' ' + this.commute;
        } else {
          //leave-by time
          trafficInfo.innerHTML = this.config.leaveByText + ' ' + this.leaveBy;
        }
        commuteInfo.appendChild(trafficInfo);

        //routeInfo
        if (this.config.showRouteInfo) {
          routeInfo.className = 'dimmed small';
          var time = this.getTodaysArrivalTime();
          var routeInfoText = this.config.showRouteInfoText
                                      .replace('{summary}', this.summary)
                                      .replace('{detailedSummary}', this.detailedSummary)
                                      .replace('{routeName}', this.getTodaysRouteName())
                                      .replace('{arrivalTime}', time.substring(0,2) + ':' + time.substring(2,4));
          routeInfo.innerHTML = routeInfoText;
        }

        //show address
        if (this.config.showAddress) {
          addressDiv.className = 'dimmed small';
          addressText = this.config.showAddressText
                                    .replace('{origin}', this.config.origin)
                                    .replace('{destination}', this.getTodaysDestination());
          addressDiv.innerHTML = addressText;
        }

        //change color if desired
        if (this.config.changeColor) {
          if (this.trafficComparison >= 1 + (this.config.limitRed / 100)) {
            commuteInfo.className += ' red';
          } else if (this.trafficComparison >= 1 + (this.config.limitYellow / 100)) {
            commuteInfo.className += ' yellow';
          } else if (this.config.showGreen) {
            commuteInfo.className += ' green';
          }
        }

        wrapper.appendChild(commuteInfo);
        wrapper.appendChild(routeInfo);
        wrapper.appendChild(addressDiv);
        return wrapper;
    },

    getParams: function() {
        var params = '?';
        params += 'mode=' + this.config.mode;
        params += '&origin=' + this.config.origin;
        params += '&destination=' + this.getTodaysDestination();
        params += '&key=' + this.config.api_key;
        params += '&traffic_model=' + this.config.traffic_model;
        params += '&language=' + this.config.language;
        if (this.config.avoid) {
          params += '&avoid=' + this.config.avoid;
        }
        if (this.config.waypoints) {
          var waypointsArray = this.config.waypoints.split(',');
          for (var i = 0; i < waypointsArray.length; i++) {
            waypointsArray[i] = 'via:' + waypointsArray[i].trim();
          }
          params += '&waypoints=' + waypointsArray.join('|');
        }
        return params;
    },

    getTodaysDestination: function() {
        var todays_destination = "";
        switch (new Date().getDay()) {
          case 0:
            todays_destination = this.config.sun_destination;
            break;
          case 1:
            todays_destination = this.config.mon_destination;
            break;
          case 2:
            todays_destination = this.config.tues_destination;
            break;
          case 3:
            todays_destination = this.config.wed_destination; 
            break;
          case 4:
            todays_destination = this.config.thurs_destination;
            break;
          case 5:
            todays_destination = this.config.fri_destination;
            break;
          case 6:
            todays_destination = this.config.sat_destination;
            break;
        }

        if (!todays_destination){ //if no weekday destinations defined in config.js, set to default
            todays_destination = this.config.destination;           
        }

        return todays_destination;
    },

    getTodaysRouteName: function() {
        var todays_route_name = "";
        switch (new Date().getDay()) {
          case 0:
            todays_route_name = this.config.sun_route_name;
            break;
          case 1:
            todays_route_name = this.config.mon_route_name;
            break;
          case 2:
            todays_route_name = this.config.tues_route_name;
            break;
          case 3:
            todays_route_name = this.config.wed_route_name; 
            break;
          case 4:
            todays_route_name = this.config.thurs_route_name;
            break;
          case 5:
            todays_route_name = this.config.fri_route_name;
            break;
          case 6:
            todays_route_name = this.config.sat_route_name;
            break;
        }

        if (!todays_route_name && this.config.route_name){ //if no weekday route_names defined in config.js, set to default
            todays_route_name = this.config.route_name;
        } 

        return todays_route_name;
    },

    getTodaysArrivalTime: function() {
      var final_arrival_time = "";
      switch (new Date().getDay()) {
        case 0:
          final_arrival_time = this.config.sun_arrival_time;
          break;
        case 1:
          final_arrival_time = this.config.mon_arrival_time;
          break;
        case 2:
          final_arrival_time = this.config.tues_arrival_time;
          break;
        case 3:
          final_arrival_time = this.config.wed_arrival_time; 
          break;
        case 4:
          final_arrival_time = this.config.thurs_arrival_time;
          break;
        case 5:
          final_arrival_time = this.config.fri_arrival_time;
          break;
        case 6:
          final_arrival_time = this.config.sat_arrival_time;
          break;
      }

      if (!final_arrival_time){ //if no weekday arrival_times defined in config.js, set to default
          final_arrival_time = this.config.arrival_time;           
      }

      return final_arrival_time;
    },

    socketNotificationReceived: function(notification, payload) {
        this.leaveBy = '';
        if (notification === 'TRAFFIC_COMMUTE' && payload.url === this.url) {
            Log.info('received TRAFFIC_COMMUTE');
            this.commute = payload.commute;
            this.summary = payload.summary;
            this.detailedSummary = payload.detailedSummary;
            this.trafficComparison = payload.trafficComparison;
            this.loaded = true;
            this.updateDom(1000);
        } else if (notification === 'TRAFFIC_TIMING' && payload.url === this.url) {
            Log.info('received TRAFFIC_TIMING');
            this.leaveBy = payload.commute;
	          this.commute = payload.commute; //support for hideOffHours
            this.summary = payload.summary;
            this.detailedSummary = payload.detailedSummary;
            this.loaded = true;
            this.updateDom(1000);
        }
    }

});
