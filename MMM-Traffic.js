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
    mode: 'driving',
    days: [0, 1, 2, 3, 4, 5, 6],
    hoursStart: '00:00',
    hoursEnd: '23:59'
  },

  start: function () {
    console.log('Starting module: ' + this.name);
    this.loading = true;
    this.internalHidden = false;
    this.firstResume = true;
    this.errorMessage = undefined;
    this.errorDescription = undefined;
    if ([this.config.originCoords, this.config.destinationCoords, this.config.accessToken].includes(undefined)) {
      this.errorMessage = 'Config error';
      this.errorDescription = 'You must set originCoords, destinationCoords, and accessToken in your config';
      this.updateDom();
    } else {
      this.updateCommute();
    }
  },

  updateCommute: async function () {
    let mode = this.config.mode == 'driving' ? 'driving-traffic' : this.config.mode;
    this.url = encodeURI(`https://api.mapbox.com/directions/v5/mapbox/${mode}/${this.config.originCoords};${this.config.destinationCoords}?access_token=${this.config.accessToken}`);

    // only run getDom once at the start of a hidden period to remove the module from the screen, then just wait until time to unhide to run again
    if (this.shouldHide() && !this.internalHidden) {
      console.log('Hiding MMM-Traffic due to config options: days, hoursStart, hoursEnd');
      this.internalHidden = true;
      this.updateDom();
    } else if (!this.shouldHide()) {
      this.internalHidden = false;
      this.getCommute(this.url);
    }
    // no network requests are made when the module is hidden, so check every 30 seconds during hidden
    // period to see if it's time to unhide yet
    setTimeout(this.updateCommute, this.internalHidden ? 3000 : this.config.interval);
  },

  getCommute: function (api_url) {
    var self = this;
    fetch(api_url)
      .then(self.checkStatus)
      .then(json => {
        self.duration = Math.round(json.routes[0].duration / 60);
        self.errorMessage = self.errorDescription = undefined;
        self.loading = false;
        self.updateDom();
      })
      .catch(e => {
        self.errorMessage = payload.error.message;
        self.errorDescription = payload.error.description;
        self.loading = false;
        self.updateDom();
      });

  },

  checkStatus: function (res) {
    if (res.ok) {
      return res.json();
    } else {
      return res.json().then(json => {
        throw new MMMTrafficError(`API Error - ${json.code}`, json.message);
      });
    }
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
    if (this.internalHidden) return wrapper;

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

    let symbolString = 'car';
    if (this.config.mode == 'cycling') symbolString = 'bicycle';
    if (this.config.mode == 'walking') symbolString = 'walking';

    // symbol
    if (this.config.showSymbol) {
      var symbol = document.createElement('span');
      symbol.className = `fa fa-${symbolString} symbol`;
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
    return text.replace(/{duration}/g, this.duration);
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
});