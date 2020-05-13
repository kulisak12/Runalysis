/**
 * @category Modules
 * @module Generic
 * @description Allows toggling module visibility.
 */

/**
 * Hide or show the module.
 * @param {HTMLElement} sender The clicked element
 */
function toggleModule(sender) {
	var moduleName = sender.classList[1];
	var module = document.getElementsByClassName("module " + moduleName)[0];
	var state = (module.style.display != "none");

	// show module
	if (state == 0) {
		module.style.display = "";
		sender.style.filter = "";
	}
	// hide module
	else {
		module.style.display = "none";
		sender.style.filter = "invert(50%)";
	}
}

/**
 * @category Processing
 * @module GenerateLink
 * @description Redirect user to a page with the shared activity.
 */

// ACTIVITY SHARING

/**
 * Generate link for sharing.
 */
function addShareLink() {
	// select fields to show
	var fields = ["sumDistance", "sumDuration", "pace", "sumElevGain", "elapsed"];
	if (run.hasHr) {
		fields.push("hr", "trimp");
	}
	if (run.hasCad) {
		fields.push("cad");
	}

	// stats
	var shareString = "date=" + run.startTime;
	fields.forEach(function(field) {
		var overall = getOverallStat(field);
		if (field == "pace") {
			overall *= 100;
		}
		shareString += "&" + field + "=" + Math.round(overall);
	});

	// points
	var startLat = roundCoord(run.points[0].lat);
	var startLon = roundCoord(run.points[0].lon);
	shareString += "&start=" + createCoordPair(startLat, startLon);
	shareString += "&moves=0b0";
	
	var approxLat = startLat;
	var approxLon = startLon;
	for (var i = 1; i < run.points.length; i++) {
		var diffLat = roundCoord(run.points[i].lat) - approxLat;
		var diffLon = roundCoord(run.points[i].lon) - approxLon;
		approxLat += diffLat; // make sure errors due to rounding don't increase
		approxLon += diffLon;
		shareString += "+" + createCoordPair(diffLat, diffLon);
	}

	var shareAnchor = document.getElementById("share").getElementsByTagName("a")[0];
	shareString = LZString.compressToEncodedURIComponent(shareString);
	shareString = shareString.replace(/\+/g, "_"); // + chars get sometimes converted to %20
	shareAnchor.href = "share?" + shareString;
}

/**
 * Save coordinate difference as integer.
 * @param {number} coordDiff Unscaled coordinate difference
 * @returns {number} Rounded upscaled difference
 */
function roundCoord(coordDiff) {
	return Math.round(coordDiff * shareCoordAccuracy);
}

/**
 * Encode a pair of coordinates.
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @returns {string} Encoded pair
 */
function createCoordPair(lat, lon) {
	var signFlag = 0;
	if (lat < 0) {
		signFlag += 2;
		lat *= -1;
	}
	if (lon < 0) {
		signFlag += 1;
		lon *= -1;
	}
	var joinChar = String.fromCharCode(98 + signFlag); // b, c, d, e
	return lat.toString() + joinChar + lon.toString();
}