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
        loadingText: 'Loading commute...',
        prependText: 'Current commute is',
        language: config.language
    },

    start: function() {
        Log.info('Starting module: ' + this.name);
        this.loaded = false;
        this.url = 'https://maps.googleapis.com/maps/api/directions/json' + this.getParams();
        this.symbols = {
            'driving': 'fa fa-car',
            'walking': 'fa fa-odnoklassniki',
            'bicycling': 'fa fa-bicycle',
            'transit': 'fa fa-train'
        };
        this.commute = '';
        this.updateCommute(this);
    },

    updateCommute: function(self) {
        self.sendSocketNotification('TRAFFIC_URL', self.url);
        setTimeout(self.updateCommute, self.config.interval, self);
    },

    getStyles: function() {
        return ['traffic.css'];
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        if (!this.loaded) {
            wrapper.innerHTML = this.config.loadingText;
            return wrapper;
        }

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
        trafficInfo.innerHTML = this.config.prependText + ' ' + this.commute;
        row.appendChild(trafficInfo);

        //add commute to wrapper
        table.appendChild(row);
        wrapper.appendChild(table);

        //routeName
        if (this.config.route_name) {
          var routeName = document.createElement('div');
          routeName.className = 'dim small routeName';
          routeName.innerHTML = this.config.route_name;
          wrapper.appendChild(routeName);
        }

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
        params += '&language=' + this.config.language;
        return params;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'TRAFFIC_COMMUTE' && payload.url === this.url) {
            Log.info('received TRAFFIC_COMMUTE');
            this.commute = payload.commute;
            this.loaded = true;
            this.updateDom(1000);
        }
    }

});
