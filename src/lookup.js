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

function pointDifference(point1, point2, field) {
	return point2[field] - point1[field];
}

function getAvailableData(fieldType) {
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