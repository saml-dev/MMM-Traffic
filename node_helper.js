/* Magic Mirror
 * Module: MMM-Traffic
 *
 * By Sam Lewis https://github.com/SamLewis0602
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var fetch = require('node-fetch');

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-Traffic helper started ...');
  },

  getCommute: function (api_url) {
    var self = this;
    fetch(api_url)
      .then(self.checkStatus)
      .then(json => {
        let duration = Math.round(json.routes[0].duration / 60);
        self.sendSocketNotification('MMM_TRAFFIC_DURATION', { duration: duration, url: api_url });
      })
      .catch(e => {
        self.sendSocketNotification('MMM_TRAFFIC_ERROR', { error: e, url: api_url });
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

  socketNotificationReceived: function (notification, payload) {
    // this.setTimeConfig(payload.timeConfig);

    if (notification === 'TRAFFIC_URL') {
      this.getCommute(payload.url);
    } else if (notification === 'LEAVE_BY') {
      this.getTiming(payload.url, payload.arrival);
    }
  }

});

class MMMTrafficError extends Error {
  constructor(message, description, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    this.name = 'MMMTrafficError'
    // Custom debugging information
    this.message = message;
    this.description = description;
  }
}