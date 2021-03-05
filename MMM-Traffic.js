/* Magic Mirror
 * Module: MMM-Traffic
 *
 * By Sam Lewis https://github.com/SamLewis0602
 * MIT Licensed.
 */

Module.register('MMM-Traffic', {
  defaults: {
    interval: 300000,
    showSymbol: true,
    firstLine: 'Current duration is {duration} mins',
    loadingText: 'Loading...',
    language: config.language,
    days: [0, 1, 2, 3, 4, 5, 6],
    hoursStart: '00:00',
    hoursEnd: '23:59'
  },

  start: function () {
    try {
      console.log('Starting module: ' + this.name);
    } catch { }
    this.loading = true;
    this.hidden = false;
    this.firstResume = true;
    this.errorMessage = undefined;
    this.errorDescription = undefined;
    if ([this.config.originCoords, this.config.destinationCoords, this.config.accessToken].includes(undefined)) {
      this.errorMessage = 'Config error';
      this.errorDescription = 'You must set originCoords, destinationCoords, and accessToken in your config';
      this.updateDom();
    } else {
      this.updateCommute(this);
    }
  },

  resume: function () {
    // Added to fix issue when used with MMM-Pages where updateDom was called
    // while MMM-Traffic was suspended. This is due to receiving traffic info
    // from node_helper while suspended. Could probably strip out the node_helper
    // entirely but this works for now.
    if (this.firstResume) {
      this.firstResume = false;
      this.updateDom(1000);
    }
  },

  updateCommute: function (self) {
    self.url = encodeURI(`https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${self.config.originCoords};${self.config.destinationCoords}?access_token=${self.config.accessToken}`);

    // only run getDom once at the start of a hidden period to remove the module from the screen, then just wait until time to unhide to run again
    if (self.shouldHide() && !self.hidden) {
      try {
        console.log('Hiding MMM-Traffic');
      } catch { }
      self.hidden = true;
      self.updateDom();
    } else if (!self.shouldHide()) {
      self.hidden = false;
      self.sendSocketNotification('TRAFFIC_URL', { 'url': self.url });
    }
    // no network requests are made when the module is hidden, so check every 30 seconds during hidden
    // period to see if it's time to unhide yet
    setTimeout(self.updateCommute, self.hidden ? 3000 : self.config.interval, self);
  },

  getStyles: function () {
    return ['traffic.css', 'font-awesome.css'];
  },

  getScripts: function () {
    return ['moment.js'];
  },

  getDom: function () {
    var wrapper = document.createElement("div");

    // hide when desired (called once on first update during hidden period)
    if (this.hidden) return wrapper;

    // base divs
    var firstLineDiv = document.createElement('div');
    firstLineDiv.className = 'bright medium';
    var secondLineDiv = document.createElement('div');
    secondLineDiv.className = 'normal small';

    // display any errors
    if (this.errorMessage) {
      firstLineDiv.innerHTML = this.errorMessage;
      secondLineDiv.innerHTML = this.errorDescription;
      wrapper.append(firstLineDiv);
      wrapper.append(secondLineDiv);
      return wrapper;
    }

    // symbol
    if (this.config.showSymbol) {
      var symbol = document.createElement('span');
      symbol.className = 'fa fa-car symbol';
      firstLineDiv.appendChild(symbol);
    }

    // first line
    var firstLineText = document.createElement('span');
    firstLineText.innerHTML = this.loading ? this.config.loadingText : this.replaceTokens(this.config.firstLine)
    firstLineDiv.appendChild(firstLineText);
    wrapper.appendChild(firstLineDiv);
    if (this.loading) return wrapper;

    // second line
    if (this.config.secondLine) {
      secondLineDiv.innerHTML = this.replaceTokens(this.config.secondLine);
      wrapper.appendChild(secondLineDiv);
    }

    return wrapper;
  },

  replaceTokens: function (text) {
    return text.replace('{duration}', this.duration);
  },

  shouldHide: function () {
    let hide = true;
    let now = moment();
    if (this.config.days.includes(now.day()) &&
      moment(this.config.hoursStart, 'HH:mm').isBefore(now) &&
      moment(this.config.hoursEnd, 'HH:mm').isAfter(now)
    ) {
      hide = false;
    }
    return hide;
  },

  socketNotificationReceived: function (notification, payload) {
    this.leaveBy = '';
    if (notification === 'MMM_TRAFFIC_DURATION' && payload.url === this.url) {
      try {
        console.log('received MMM_TRAFFIC_DURATION');
      } catch { }
      this.duration = payload.duration;
      this.errorMessage = this.errorDescription = undefined;
      this.loading = false;
      this.updateDom(1000);
    } else if (notification === 'MMM_TRAFFIC_ERROR' && payload.url === this.url) {
      try {
        console.log('received MMM_TRAFFIC_ERROR');
      } catch { }
      this.errorMessage = payload.error.message;
      this.errorDescription = payload.error.description;
      this.loading = false;
      this.updateDom(1000);
    }
  }

});