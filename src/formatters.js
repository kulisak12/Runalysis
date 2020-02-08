function format(value, field) {
	if (isPace(field)) {
		return formatPace(value);
	}
	else if (field == "elev") {
		return formatElevation(value);
	}
	else if (field == "hr") {
		return formatHeartRate(value);
	}
	else if (field == "cad") {
		return formatCadence(value);
	}
	else if (field == "temp") {
		return formatTemperature(value);
	}
	else {
		console.warn("Default formatter: " + field);
		return value;
	}
}

function formatTime(time) {
	time = Math.round(time);
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

function formatPace(pace) {
	return formatTime(pace) + " min/km";
}

function formatDistance(distance) {
	distance = Math.round(distance / 10 + Number.EPSILON) / 100;
	return distance.toString() + " km";
}

function formatElevation(elev) {
	elev = Math.round(elev * 10 + Number.EPSILON) / 10;
	return elev + " m";
}

function formatHeartRate(hr) {
	return Math.round(hr) + " bpm";
}

function formatCadence(cad) {
	return Math.round(cad) + " spm";
}

function formatTemperature(temp) {
	return Math.round(temp) + " °C";
}

function padZeros(str, zeros) {
	while (str.length < zeros) {
		str = "0" + str;
	}
	return str;
}

function getFieldName(id) {
	for (var i = 0; i < names.length; i++) {
		if (names[i].id == id) {
			return names[i].name;
		}
	}
}

function getFieldId(name) {
	for (var i = 0; i < names.length; i++) {
		if (names[i].name == name) {
			return names[i].id;
		}
	}
}

function isPace(field) {
	return field == "pace" || field == "gap";
}

// mostly taken from default ticker code
function timeTicker(a, b, pixels, opts, dygraph, vals) {

	var pixelsPerTick = opts("pixelsPerLabel")
	var maxTicks = Math.ceil(pixels / pixelsPerTick);
	var unitsPerTick = Math.abs(b - a) / maxTicks;
	var base = 60; // time is base 60
	var mults = [1, 2, 5, 10, 15, 20, 30, 60]; // pretty numbers
	var basePower = Math.floor(Math.log(unitsPerTick) / Math.log(base));
	var baseScale = Math.pow(base, basePower);
	
	// find optimal scale
	var scale, lowestVal, highestVal, spacing;
    for (var i = 0; i < mults.length; i++) {
		scale = baseScale * mults[i];
		lowestVal = Math.floor(a / scale) * scale;
		highestVal = Math.ceil(b / scale) * scale;
		numTicks = Math.abs(highestVal - lowestVal) / scale;
		spacing = pixels / numTicks;
		if (spacing > pixelsPerTick) { // spacing found
			break;
		}
	}
	if (lowestVal > highestVal) { // inverted Y axis
		scale *= -1;
	}

	// construct ticker array
	var ticks = [];
	for (i = 0; i <= numTicks; i++) {
		tickVal = lowestVal + i * scale;
		ticks.push({
			v: tickVal,
			label: formatTime(tickVal)
		});
    }

	return ticks;
}