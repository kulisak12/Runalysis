function legendFormatter(data) {
	if (data.x == null) { // nothing highlighted
	  return "--";
	}
	var result = "";
	for (var i = 0; i < data.series.length; i++) {
		if (i > 0) {
			result += "<br>";
		}
		result += data.series[i].yHTML;
	}
	return result;
}

function formatTime(time) {
	time = parseInt(time);
	var secs = time % 60;
	time = (time - secs) / 60;
	var mins = time % 60;
	var hours = (time - mins) / 60;
	
	var result = mins.toString() + ":" + padZeros(secs.toString(), 2);
	if (hours > 1) {
		result = hours.toString() + padZeros(result, 5);
	}
	
	return result;
}

function formatDistance(distance) {
	distance -= distance % 10;
	distance /= 1000;
	return distance.toString() + " km";
}

function padZeros(str, zeros) {
	while (str.length < zeros) {
		str = "0" + str;
	}
	return str;
}

function getFieldName(id) {
	var names = {
		sumDistance: "Distance",
		elev: "Elevation",
		pace: "Pace",
		gap: "GAP",
		hr: "Heart rate",
		cad: "Cadence",
		temp: "Temperature"
	}
	return names[id];
}