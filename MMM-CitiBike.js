/* global Module */

/* Magic Mirror
 * Module: MMM-MTA
 *
 * By Nicholas Konecny
 * MIT Licensed.
 */

Module.register("MMM-CitiBike", {

	start: function() {
		this.data = [];
	},

	getStyles: function() {
		return ["moment.js"];
	},

	// notificationReceived: function(notification, payload) {
	//     console.log(notification);
	//     if (notification === 'DOM_OBJECTS_CREATED') {
	//         this.sendSocketNotification('GET_CITIBIKE_STATUS', self.config);
	//     }
	// },


	defaults: {
		fetchInterval: 15 * 1000,
	},

	start: function() {
        this.sendSocketNotification('GET_CITIBIKE_STATUS', self.config);
		this.bikes = false;		
	},

	getStyles: function() {
		return [];
	},


	getScripts: function() {
		return [];
	},


	getDom: function() {
		var container = document.createElement("div");
		

		
		if (this.bikes) {
			this.bikes.forEach(bike => {
				console.log(bike);
			});
			
			// h3.innerHTML = "Cash: $" + this.bankData.cash + "<br/>Credit: ($" + this.bankData.credit + ")";					
			// var div = document.createElement("div");
			// div.innerHTML = "Last updated: " + new Date(this.bankData.date);	
			// div.style.fontSize = "14px";
			// container.appendChild(h3);			
			// container.appendChild(div);
		}
		
		return container;
	},

	socketNotificationReceived: function (notification, payload) {
		console.log(payload);
		if (notification === 'CITIBIKE_DATA') {
			console.log(payload);
			this.bikes = payload.data;			
			this.updateDom();
		}
	}
});
