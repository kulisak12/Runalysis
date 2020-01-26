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

function padZeros(str, zeros) {
	while (str.length < zeros) {
		str = "0" + str;
	}
	return str;
}

function getFieldName(id) {
	var names = {
		elev: "Elevation",
		pace: "Pace",
		gap: "GAP",
		hr: "Heart rate",
		cad: "Cadence",
		temp: "Temperature"
	}
	return names[id];
}