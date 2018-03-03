var NodeHelper = require('node_helper');
var request = require('request');
var Countdown = require('countdown-js');
var reloadTimer = null;


module.exports = NodeHelper.create({
    defaults: {
        fetchInterval: 5 * 60 * 1000        
    },

    start: function() {
        console.log("mmm-citibike state");
        this.timer = false;
        this.stations = ['0ba48fdfd84cd4b871bfd83c406d9d25', '7448843186d5f3149d39dd7b7015238c', '707f06d68130f07c41591c107a02ba36'];            
    },

    getBikeData: function(self, config) {
        if (!config || !config.fetchInterval) {
            config.fetchInterval = this.defaults.fetchInterval;            
        }

        var timestamp = Date.now().toString();
        var url = "http://api.citybik.es/v2/networks/citi-bike-nyc?id=0ba48fdfd84cd4b871bfd83c406d9d25";
        request({
            url: url,
            method: 'GET',
            'content-type': 'application/json'
        }, function(error, response, body) {            
            if (error) {
                console.error(error);
                return;
            }
            const bikes = JSON.parse(body).network.stations.filter(station => {
                return self .stations.includes(station.id);
            });

            self.sendSocketNotification('CITIBIKE_DATA', {
                data: bikes,                    
            });            
        });
        

        this.scheduleTimer(self, config);
    },



    scheduleTimer: function(self, config) {
        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(() => {
            this.getBikeData(self, config);
        }, config.fetchInterval);
    },

    socketNotificationReceived: function(notification, payload) {
        console.log(payload);
        if (notification === "GET_CITIBIKE_STATUS") {
            this.getBikeData(this, payload);
        }
    }
});