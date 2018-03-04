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

	defaults: {
		fetchInterval: 60 * 5 * 1000,
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
		var h2 = document.createElement("div");
		h2.innerHTML = "CitiBike"
		container.appendChild(h2);
		container.appendChild(document.createElement("hr"));

		
		if (this.bikes) {
			var table = document.createElement("table");
			var headerRow = document.createElement("tr");
			this.createHeader(headerRow, "Bikes");					
			this.createHeader(headerRow, "Address");
			this.createHeader(headerRow, "Updated");	
			table.appendChild(headerRow);	
			
			this.bikes.forEach(bike => {
				var tr = document.createElement("tr");

				var td = document.createElement("td");
				var td2 = document.createElement("td");
				var td3 = document.createElement("td");

				td.innerHTML = bike.free_bikes;
				td.style = "text-align:center";

				td2.innerHTML = bike.name;
				td2.style = "padding-right: 8px";
				td2.className = 'small';

				
				td3.innerHTML = ` As of ${moment.unix(bike.extra.last_updated).fromNow()}`;
				td3.className = 'xsmall';
				
				tr.appendChild(td);
				tr.appendChild(td2);
				tr.appendChild(td3);
				table.appendChild(tr);									
			});


			const h6 = document.createElement('div');
			h6.innerHTML = `As of: ${new Date()}`;
			h6.style = "font-size:12px";

			container.appendChild(table);
			container.appendChild(h6);
		
		}
		
		return container;
	},

	createHeader: function(container, text) {
		var header = document.createElement("th");		
		header.innerHTML = text;
		header.style ="text-align:center; padding-left:8px; padding-right:8px;";
		container.appendChild(header);
	},

	socketNotificationReceived: function (notification, payload) {		
		if (notification === 'CITIBIKE_DATA') {
			this.bikes = payload.data;			
			this.updateDom();
		}
	}
});
