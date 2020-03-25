var markerLayer = null; // unused, just so I can reuse a function
var run = {};

function displaySharedData() {
	var url = window.location.href;
	var parametersString = url.substr(url.indexOf("?") + 1);

	var parameters = parametersString.split("&");
	for (var i = 0; i < parameters.length; i++) {
		parameters[i] = parameters[i].split("=");
	}

	var numbersContainer = document.getElementById("numbers-container");
	// date
	var date = new Date(parameters[0][1]);
	var options = {dateStyle: "full", timeStyle: "medium"};
	var dateBox = document.createElement("div");
	dateBox.classList.add("date-box");
	var dateValue = document.createElement("p");
	dateValue.innerHTML = date.toLocaleString("en-GB", options);
	dateBox.appendChild(dateValue);
	numbersContainer.appendChild(dateBox);

	var lat, lon;
	run.points = [];

	for (var i = 1; i < parameters.length; i++) {
		var field = parameters[i][0];
		if (field == "start") {
			var coords = splitCoordPair(parameters[i][1]);
			lat = coords[0];
			lon = coords[1];
		}
		else if (field == "moves") {
			var movesString = parameters[i][1];
			movesString = movesString.substr(1, movesString.length - 2); // delete []
			var moves = movesString.split(",");
			moves.forEach(function(move) {
				var coords = splitCoordPair(move);
				lat += coords[0];
				lon += coords[1];
				var pointObj = {};
				pointObj["lat"] = lat / shareCoordAccuracy;
				pointObj["lon"] = lon / shareCoordAccuracy;
				run.points.push(pointObj);
			});

			addGps();
		}
		else {
			var stat = parseInt(parameters[i][1]);
			var numberBox = createNumberBox(field, format(stat, field));
			numbersContainer.appendChild(numberBox);
		}

	}
}

function splitCoordPair(pair) {
	var parts = pair.split("+");
	var lat = parseInt(parts[0]);
	var lon = parseInt(parts[1]);
	return [lat, lon];
}