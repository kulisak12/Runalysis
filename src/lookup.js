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

function pointDifference(point1, point2, field) {
	return point2[field] - point1[field];
}