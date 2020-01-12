// create a run object
function gpxParser(fileContent) {
	var run = {};
	
	var parser = new DOMParser();
	const xmlDom = parser.parseFromString(fileContent, "text/xml");

	// general
	const gpx = xmlDom.getElementsByTagName("gpx")[0];
	const startTime = gpx.getElementsByTagName("metadata")[0].getElementsByTagName("time")[0].innerHTML;
	run.startTime = new Date(startTime);
	
	const trk = gpx.getElementsByTagName("trk")[0];
	run.name = trk.getElementsByTagName("name")[0].innerHTML;
	
	run.hasHr = Boolean(trk.getElementsByTagName("gpxtpx:hr")[0]);
	run.hasCad = Boolean(trk.getElementsByTagName("gpxtpx:cad")[0]);
	run.hasTemp = Boolean(trk.getElementsByTagName("gpxtpx:atemp")[0]);
	
	// individual track points
	run.points = [];
	run.laps = [];
	const trkSegs = trk.getElementsByTagName("trkseg");
	for (var i = 0; i < trkSegs.length; i++) {
		run.points = run.points.concat(parseTrkSeg(trkSegs[i]));
		run.laps.push(run.points.length - 1); // index of last point
	}

	return run;
}

// get an array of track points from one segment
function parseTrkSeg(trkSeg) {
	var points = [];
	const trkPts = trkSeg.getElementsByTagName("trkpt");
	for (var i = 0; i < trkPts.length; i++) {
		points[i] = parseTrkPt(trkPts[i]);
	}
	return points;
}

// create a track point object
function parseTrkPt(trkPt) {
	var point = {};
	point.lat = parseFloat(trkPt.getAttribute("lat"));
	point.lon = parseFloat(trkPt.getAttribute("lon"));
	point.elev = parseFloat(trkPt.getElementsByTagName("ele")[0].innerHTML);
	point.fullDate = new Date(trkPt.getElementsByTagName("time")[0].innerHTML);
	
	// extra information
	const extensionsEle = trkPt.getElementsByTagName("gpxtpx:TrackPointExtension")[0];
	if (extensionsEle != null) {
		point.hr = parseExtension(extensionsEle.getElementsByTagName("gpxtpx:hr")[0]);
		point.cad = parseExtension(extensionsEle.getElementsByTagName("gpxtpx:cad")[0]);
		point.temp = parseExtension(extensionsEle.getElementsByTagName("gpxtpx:atemp")[0]);
	}
	return point;
}

// check if extension exists, return its value if it does
function parseExtension(valueEle) {
	if (valueEle == null) {
		return null;
	}
	else if (!valueEle.innerHTML) {
		return null;
	}
	else {
		return parseInt(valueEle.innerHTML);
	}
}