/**
 * @category Utility
 * @module Lookup
 */


/**
 * Find a point closest to the specified time.
 * @param {number} time 
 * @returns {Point} 
 */
function getPointByTime(time) {
	// binary search, returns closest point
	var begin = 0;
	var end = run.points.length - 1;
	var center = Math.floor((begin + end) / 2);
	while (begin < end) {
		if (run.points[center].sumDuration < time) {
			begin = center + 1;
		}
		else {
			end = center;
		}
		center = Math.floor((begin + end) / 2);
	}
	return run.points[center];
}

/**
 * Get the min and max value of a field in the entire run.
 * @param {string} field 
 * @returns {number[]} Min and max value, in this order
 */
function getExtremes(field) {
	var min, max;
	min = max = run.points[0][field];
	for (var i = 0; i < run.points.length; i++) {
		if (run.points[i].ignore) {
			continue;
		}
		var value = run.points[i][field];
		if (value < min) {
			min = value;
		}
		else if (value > max) {
			max = value;
		}
	}
	return [min, max];
}

/**
 * Get the stat for a given field to be shown when a range is selected.
 * @param {Point} point1 Beginning of the range
 * @param {Point} point2 End of the range
 * @param {string} field 
 * @returns {number} Average field value or difference in values
 */
function rangeStats(point1, point2, field) {
	// weighted average
	if (isPace(field) || field == "hr" || field == "cad") {
		var timeDiff = pointDifference(point1, point2, "sumDuration");
		var sumField = "sum" + field.charAt(0).toUpperCase() + field.slice(1); // pace -> sumPace
		return pointDifference(point1, point2, sumField) / timeDiff;
	}
	// difference
	else if (field == "elev" || field.startsWith("sum")) {
		return pointDifference(point1, point2, field);
	}
}

/**
 * Get the change in field value over a range.
 * @param {Point} point1 Beginning of the range
 * @param {Point} point2 End of the range
 * @param {string} field 
 * @returns {number} Difference in field values
 */
function pointDifference(point1, point2, field) {
	return point2[field] - point1[field];
}

/**
 * Get a list of available fields of given type.
 * @param {FieldTypes} fieldType Filter for returned fields
 * @returns {string[]} Array of fields
 */
function getAvailableData(fieldType) {
	// get all available fields
	var main = ["sumDuration", "sumDistance"];
	var primary = ["pace"];
	var secondary = [];
	if (run.hasEle) {
		primary.push("gap");
		secondary.push("elev");
	}
	if (run.hasHr) {
		secondary.push("hr");
	}
	if (run.hasCad) {
		primary.push("cad");
	}
	if (run.hasTemp) {
		secondary.push("temp");
	}

	// return fields according to type
	if (fieldType == FieldTypes.ALL) {
		return Array.prototype.concat(main, primary, secondary);
	}
	if (fieldType == FieldTypes.MAIN) {
		return main;
	}
	if (fieldType == FieldTypes.DEPENDANT) {
		return Array.prototype.concat(primary, secondary);
	}
	if (fieldType == FieldTypes.PRIMARY) {
		return primary;
	}
	if (fieldType == FieldTypes.SECONDARY) {
		return secondary;
	}

	// wrong value
	console.warn("Wrong field type");
	return null;
}