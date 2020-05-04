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
	shareAnchor.href = "share.html?" + LZString.compressToEncodedURIComponent(shareString);
}

function roundCoord(coordDiff) {
	return Math.round(coordDiff * shareCoordAccuracy);
}

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