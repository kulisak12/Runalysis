/**
 * General value formatter
 * @param {number} value Value to be formatted
 * @param {string} field Field type, used to determine formatting
 * @returns {string} Formatted value including unit
 */
function format(value, field) {
	if (isPace(field)) {
		return formatPace(value);
	}
	else if (field == "elev" || field == "sumElevGain") {
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
	else if (field == "sumDuration" || field == "elapsed") {
		return formatTime(value);
	}
	else if (field == "sumDistance") {
		return formatDistance(value);
	}
	else if (field == "trimp") {
		return value.toString();;
	}
	else {
		console.warn("Default formatter: " + field);
		return value;
	}
}

/**
 * Time formatter
 * @param {number} time 
 * @returns {string} Time in HH:MM:SS
 */
function formatTime(time) {
	time = Math.round(time);
	var secs = time % 60;
	time = (time - secs) / 60;
	var mins = time % 60;
	var hours = (time - mins) / 60;
	
	var result = mins.toString() + ":" + padZeros(secs.toString(), 2);
	if (hours > 0) {
		result = hours.toString() + ":" + padZeros(result, 5);
	}
	
	return result;
}

/**
 * Pace formatter
 * @param {number} speed Speed in km/h 
 * @returns {string} Pace in HH:MM:SS min/km
 */
function formatPace(speed) {
	return formatTime(toPace(speed)) + " min/km";
}

/**
 * Distance formatter
 * @param {number} distance Distance in meters 
 * @returns {string} Distance in km
 */
function formatDistance(distance) {
	distance = Math.round(distance / 10 + Number.EPSILON) / 100;
	return distance.toString() + " km";
}

/**
 * Elevation formatter
 * @param {number} elev Elevation
 * @returns {string} Elevation in meters rounded to one decimal digit
 */
function formatElevation(elev) {
	elev = Math.round(elev * 10 + Number.EPSILON) / 10;
	return elev + " m";
}

/**
 * Heart rate formatter
 * @param {number} hr Heart rate
 * @returns {string} Heart rate in bpm
 */
function formatHeartRate(hr) {
	return Math.round(hr) + " bpm";
}

/**
 * Cadence formatter
 * @param {number} cad Cadence
 * @returns {string} Cadense in spm
 */
function formatCadence(cad) {
	return Math.round(cad) + " spm";
}

/**
 * Temperature formatter
 * @param {number} temp Temperature
 * @returns {string} Temperature in degrees C
 */
function formatTemperature(temp) {
	return Math.round(temp) + " °C";
}

/**
 * Cut of the unit from formatted value
 * @param {string} value Formatted value
 * @returns {string} Formatted value without unit
 */
function removeUnit(value) {
	return value.substr(0, value.indexOf(" "));
}

/**
 * Pad the beginning of string with zeros
 * @param {string} str 
 * @param {number} zeros Final length of string
 * @returns {string} Zero-padded string
 */
function padZeros(str, zeros) {
	while (str.length < zeros) {
		str = "0" + str;
	}
	return str;
}

/**
 * Get full field name to be displayed
 * @param {string} id Field
 * @returns {string} Field display name
 */
function getFieldName(id) {
	for (var i = 0; i < names.length; i++) {
		if (names[i].id == id) {
			return names[i].name;
		}
	}
}

/**
 * Get field id from display name
 * @param {string} name Field display name
 * @returns {string} Field
 */
function getFieldId(name) {
	for (var i = 0; i < names.length; i++) {
		if (names[i].name == name) {
			return names[i].id;
		}
	}
}

/**
 * Convert pace to speed
 * @param {number} pace Pace in min/km
 * @returns {number} Speed in km/h
 */
function toSpeed(pace) {
	return 3600 / pace;
}

/**
 * Convert speed to pace
 * @param {number} speed Speed in km/h
 * @returns {number} Pace in min/km
 */
function toPace(speed) {
	return 3600 / speed;
}

/**
 * Is field of pace type
 * @param {string} field 
 * @returns {boolean}
 */
function isPace(field) {
	return field == "pace" || field == "gap";
}

/**
 * Algorithm to place ticks on a graph axis showing time
 * Tries to find the optimal spacing
 * @param {number} a Min shown value
 * @param {number} b Max shown value
 * @param {number} pixels Size of axis in pixels
 * @param {*} opts Dygraph library options
 * @param {*} dygraph The associated graph
 * @param {*} vals Unused?
 * @returns {Array} Array of values where ticks should be and their formatting
 */
// mostly taken from default ticker code
function timeTicker(a, b, pixels, opts, dygraph, vals) {

	var pixelsPerTick = opts("pixelsPerLabel")
	var maxTicks = Math.ceil(pixels / pixelsPerTick);
	var unitsPerTick = Math.abs(b - a) / maxTicks;
	const base = 60; // time is base 60
	const mults = [1, 2, 5, 10, 15, 20, 30, 60]; // pretty numbers
	var baseScale = getBaseScale(unitsPerTick, base);
	
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

/**
 * Algorithm to place ticks on a graph axis in speed and label it with pace
 * Tries to round shown values to nice numbers
 * @param {number} a Min shown value
 * @param {number} b Max shown value
 * @param {number} pixels Size of axis in pixels
 * @param {*} opts Dygraph library options
 * @param {*} dygraph The associated graph
 * @param {*} vals Unused?
 * * @returns {Array} Array of values where ticks should be and their pace formatting
 */
function paceTicker(speedA, speedB, pixels, opts, dygraph, vals) {
	var units = Math.abs(speedB - speedA);
	var pixelsPerTick = opts("pixelsPerLabel");
	var unitsPerTick = units * pixelsPerTick / pixels;
	
	// avoid infinite pace
	if (speedA < slowestSpeed) {
		speedA = slowestSpeed;
	}

	var speed = speedA;
	var ticks = [];

	// construct ticker array
	while (speed <= speedB) {
		speed = snap(speed, unitsPerTick); // round to a nice number
		ticks.push({
			v: speed,
			label: removeUnit(formatPace(speed))
		});
		speed += unitsPerTick;
	}

	return ticks;
}

/**
 * Round value to nearest lower power of base
 * @param {number} value 
 * @param {number} base 
 * @returns {number} Nearest lower power of base
 */
function getBaseScale(value, base) {
	var basePower = Math.floor(Math.log(value) / Math.log(base));
	return Math.pow(base, basePower);
}

/**
 * Round speed to nearest higher nice number
 * Size of rounding is proportional to zoom
 * @param {number} speed 
 * @param {number} unitsPerTick How far away should the following tick be
 * @returns {number} Rounded speed
 */
function snap(speed, unitsPerTick) {
	const base = 60;
	const mults = [1, 2, 5, 10, 15, 20, 30];
	
	var pace = toPace(speed);
	var step = pace - toPace(speed + unitsPerTick); // following tick
	var baseScale = getBaseScale(step, base);
	for (var i = mults.length - 1; i >= 0; i--) {
		var scale = baseScale * mults[i];
		if (scale <= step) {
			return toSpeed(Math.floor(pace / scale) * scale);
		}
	}
}

/**
 * Ticker to display no ticks
 * All parameters are omitted
 * @returns {Array} Empty array
 */
function emptyTicker(a, b, pixels, opts, dygraph, vals) {
	var ticks = [];
	return ticks;
}