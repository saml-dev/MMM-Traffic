'use strict';

/* Magic Mirror
 * Module: MMM-Wunderlist
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
  start: function () {
    this.config = []
    this.config.lists = []
  },
  get_lists: function(callback) {
    request({url: 'https://a.wunderlist.com/api/v1/lists', method: 'GET', headers: { 'X-Access-Token': this.config.access_token,'X-Client-ID': this.config.client_id}}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var lists = {};
        for (var i = 0; i < JSON.parse(body).length; i++) {
          lists[JSON.parse(body)[i].title.replace(/\s+/g, '')] = {id: JSON.parse(body)[i].id}
        }
        callback(lists);
      }
    })
  },

  get_tasks: function(id, listname, callback) {
    request({url: 'https://a.wunderlist.com/api/v1/tasks?list_id=' + id, method: 'GET', headers: { 'X-Access-Token': this.config.access_token,'X-Client-ID': this.config.client_id}}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var tasks = []
        for (var i = 0; i < JSON.parse(body).length; i++) {
          tasks.push(JSON.parse(body)[i].title)
        }
        callback(tasks, id, listname);
      }
    })
  },
  
  arrayUnique: function(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
        if(a[i] === a[j])
          a.splice(j--, 1);
      }
    }

    return a;
  },
  
  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    const self = this;
    if (notification === 'WUNDERLIST_CONFIG') {
      this.config.lists = this.arrayUnique(this.config.lists.concat(payload.lists));
      this.config.access_token = payload.access_token
      this.config.client_id = payload.client_id
      this.get_lists(function (data) {
        for (var i = 0; i < self.config.lists.length; i++) {
          
   
            setInterval(function(data, self, i) {
              self.get_tasks(data[self.config.lists[i].replace(/\s+/g, '')].id, self.config.lists[i], function (data, list_id, list_name) {

                self.sendSocketNotification('WUNDERLIST_TASKS', {list_id: list_id, tasks: data, list_name: list_name});

              })
            }, 5000, data, self, i);


        }
        
        self.sendSocketNotification('WUNDERLIST', {lists: data});
      })
    };
  }
  
});