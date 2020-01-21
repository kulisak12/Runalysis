function onLoad() {
	var run = JSON.parse(sessionStorage.getItem("runData"));
	// precalculate all values
	calculateMovements(run);
	calculatePace(run);
	calculatePrefixSums(run);
	// TODO ingore paused

	createGraph(run);
}

// calculate time and distance differences between two consecutive points
function calculateMovements(run) {
	run.points[0].duration = 0;
	run.points[0].distance = 0;
	run.points[0].elevDiff = 0;
	
	for (var i = 1; i < run.points.length; i++) {
		var point = run.points[i];
		var previousPoint = run.points[i - 1];
		
		point.duration = calculateDuration(previousPoint, point);
		point.distance = calculateDistance(previousPoint, point);
		point.elevDiff = point.elev - previousPoint.elev;
	}
}

function calculatePace(run) {
	for (var i = 1; i < run.points.length; i++) {
		var point = run.points[i];
		
		point.pace = point.duration / point.distance * 1000;
		point.incline = point.elevDiff / point.distance;
		point.gap = calculateGap(point.pace, point.incline);
	}
}

function calculatePrefixSums(run) {
	calculatePrefixSum(run, "duration", "sumDuration");
	calculatePrefixSum(run, "distance", "sumDistance");
	calculateWeightedPrefixSum(run, "hr", "sumHr");
	calculateWeightedPrefixSum(run, "cad", "sumCad");
}

function calculatePrefixSum(run, value, sumValue) {
	var sum = 0;
	for (var i = 0; i < run.points.length; i++) {
		sum += run.points[i][value];
		run.points[i][sumValue] = sum;
	}
}

function calculateWeightedPrefixSum(run, value, sumValue) {
	var sum = 0;
	for (var i = 0; i < run.points.length; i++) {
		sum += run.points[i][value] * run.points[i].duration;
		run.points[i][sumValue] = sum;
	}
}

// conversion functions
Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  }

function square(x) {
	return x * x;
}

// grade adjusted pace
function calculateGap(pace, gradient) {
	var coefficient = 1 + 2.8 * gradient + 16.1 * Math.pow(gradient, 2) + 5 * Math.pow(gradient, 3) + 25 * Math.pow(gradient, 4);
	return pace / coefficient;
}

function calculateDistance(point1, point2) {
	var lat1 = point1.lat.toRadians();
	var lat2 = point2.lat.toRadians();
	var latDiff = (point1.lat - point2.lat).toRadians();
	var lonDiff = (point1.lon - point2.lon).toRadians();
	
	// use the haversine formula
	const earthRadius = 6.371e6; // in km
	var a = square(Math.sin(latDiff/2)) +
		square(Math.sin(lonDiff/2)) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	return c * earthRadius;
}

function calculateDuration(point1, point2) {
	return (point2.date - point1.date) / 1000;
}