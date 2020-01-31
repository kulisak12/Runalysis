function getPointByTime(time) {
	// binary search
	var begin = 0;
	var end = run.points.length; // outside of array
	var center = Math.floor((begin + end) / 2);
	while (run.points[center].sumDuration != time) {
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