/**
 * @category Processing
 * @module ActivityProcessing
 * @description Calculates all necessary values within the activity.
 */

var run;

/**
 * Runs when the page loads
 * Calculate point and section stats, build page
 */
function onLoad() {
	run = JSON.parse(sessionStorage.getItem("runData"));
	// precalculate all values
	calculateMovements();
	calculatePace();
	if (run.source == "gpx") {
		ignorePaused();
	}
	calculatePrefixSums();

	// build page
	addGps();
	addNumbers();
	addShareLink();
	drawGraphs();
	addZones();
}

/**
 * Calculate time and distance for sections
 */
function calculateMovements() {
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

/**
 * Calculate pace and gap
 */
function calculatePace() {
	for (var i = 1; i < run.points.length; i++) {
		var point = run.points[i];
		
		point.pace = point.distance / point.duration * 3.6; // storing pace as speed
		point.incline = point.elevDiff / point.distance;
		if (point.distance == 0) {
			point.incline = 0;
		}
		point.gap = calculateGap(point.pace, point.incline);
	}

	run.points[0].pace = run.points[1].pace;
	run.points[0].incline = 0;
	run.points[0].gap = run.points[1].gap;
}

/**
 * If the duration of a section is too long, the recording was paused
 * Mark this section as ignored
 */
function ignorePaused() {
	for (var i = 0; i < run.points.length; i++) {
		if (run.points[i].duration > pausedThreshold || run.points[i].distance == 0) {
			run.points[i].ignore = true;
		}
		else {
			run.points[i].ignore = false;
		}
	}
}

/**
 * Calculate prefix sums for all the fields
 * Allows easy calculation of range stats
 */
function calculatePrefixSums() {
	calculatePrefixSum("duration", "sumDuration");
	calculatePrefixSum("distance", "sumDistance");
	calculatePrefixSum("elevDiff", "sumElevGain");
	calculateWeightedPrefixSum("hr", "sumHr");
	calculateWeightedPrefixSum("cad", "sumCad");
	calculateWeightedPrefixSum("pace", "sumPace");
	calculateWeightedPrefixSum("gap", "sumGap");
	calculateWeightedPrefixSum("temp", "sumTemp");
}

/**
 * Calculate basic prefix sums
 * @param {string} value Name of field
 * @param {string} sumValue Name of sum field
 */
function calculatePrefixSum(value, sumValue) {
	var sum = 0;
	for (var i = 0; i < run.points.length; i++) {
		if (!run.points[i].ignore && run.points[i][value] > 0) {
			sum += run.points[i][value];
		}
		run.points[i][sumValue] = sum;
	}
}

/**
 * Calculate prefix sums weighted with respect to duration
 * @param {string} value Name of field
 * @param {string} sumValue Name of sum field
 */
function calculateWeightedPrefixSum(value, sumValue) {
	var sum = 0;
	for (var i = 0; i < run.points.length; i++) {
		if (!run.points[i].ignore) {
			sum += run.points[i][value] * run.points[i].duration;
		}
		run.points[i][sumValue] = sum;
	}
}

/**
 * Formula to calculate grade adjusted pace
 * @param {number} pace Real pace
 * @param {number} gradient Incline, represented as a fraction
 * @returns {number} Grade adjusted pace
 */
function calculateGap(pace, gradient) {
	var coefficient = 1 + 2.8 * gradient + 16.1 * Math.pow(gradient, 2) + 5 * Math.pow(gradient, 3) + 25 * Math.pow(gradient, 4);
	return pace * coefficient;
}

/**
 * Formula to calculate the distance between two coordinates
 * @param {Point} point1 
 * @param {Point} point2 
 * @returns {number} Distance in meters
 */
function calculateDistance(point1, point2) {
	var lat1 = point1.lat.toRadians();
	var lat2 = point2.lat.toRadians();
	var latDiff = (point1.lat - point2.lat).toRadians();
	var lonDiff = (point1.lon - point2.lon).toRadians();
	
	// use the haversine formula
	const earthRadius = 6.371e6; // in meters
	var a = square(Math.sin(latDiff/2)) +
	square(Math.sin(lonDiff/2)) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	return c * earthRadius;
}

/**
 * Get the difference between two timestamps
 * @param {Point} point1 
 * @param {Point} point2 
 * @returns {number} Duration in seconds
 */
function calculateDuration(point1, point2) {
	return (point2.date - point1.date) / 1000;
}

// conversion functions

/**
 * Add a conversion to radians for the number prototype
 */
Number.prototype.toRadians = function() {
	return this * Math.PI / 180;
}

/**
 * Calculate the square of a number
 * @param {number} x 
 * @returns {number} Square
 */
function square(x) {
	return x * x;
}