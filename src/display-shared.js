var markerLayer = null; // unused, just so I can reuse a function
var run = {};

function displaySharedData() {
	var url = window.location.href;
	var parametersString = url.substr(url.indexOf("?") + 1);
	parametersString = LZString.decompressFromEncodedURIComponent(parametersString);

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
			var moves = movesString.split("+");
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
			if (field == "pace") {
				stat /= 100;
			}
			var numberBox = createNumberBox(field, format(stat, field));
			numbersContainer.appendChild(numberBox);
		}

	}
}

function splitCoordPair(pair) {
	var joinChar = pair.match(/[bcde]/)[0];
	var parts = pair.split(/[bcde]/);
	var lat = parseInt(parts[0]);
	var lon = parseInt(parts[1]);
	var signFlag = joinChar.charCodeAt(0) - 98;
	if (signFlag >= 2) {
		lat *= -1;
	}
	if (signFlag % 2 == 1) {
		lon *= -1;
	}
	return [lat, lon];
}