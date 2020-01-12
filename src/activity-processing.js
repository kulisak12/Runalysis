function onLoad() {
	var run = JSON.parse(sessionStorage.getItem("runData"));
	calculateMovements(run);
	//calculatePace();
}

// calculate time and distance differences between two consecutive points
function calculateMovements(run) {
	run.points[0].duration = 0;
	run.points[0].distance = 0;
	run.points[0].elevDiff = 0;
	run.points[0].totalTime = 0;
	run.points[0].totalDistance = 0;
	
	for (var i = 1; i < run.points.length; i++) {
		var point = run.points[i];
		var previousPoint = run.points[i - 1];
		
		point.distance = calculateDistance(previousPoint, point);
		point.duration = calculateDuration(previousPoint, point);
		point.elevDiff = point.elev - previousPoint.elev;
		
		point.totalTime = previousPoint.totalTime + point.duration;
		point.totalDistance = previousPoint.totalDistance + point.distance;
	}
}

// conversion functions
Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  }

function square(x) {
	return x * x;
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
	var msDiff = point2.fullDate - point1.fullDate;
	return msDiff / 1000; // from ms to s
}