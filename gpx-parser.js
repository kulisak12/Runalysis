var activity = {};

// create an activity object
function parseGpx() {
	var parser = new DOMParser();
	const xmlDom = parser.parseFromString(sessionStorage.getItem("gpxXml"), "text/xml");
	
	// general
	const gpx = xmlDom.getElementsByTagName("gpx")[0];
	const startTime = gpx.getElementsByTagName("metadata")[0].getElementsByTagName("time")[0].innerHTML;
	activity.startTime = new Date(startTime);
	
	const trk = gpx.getElementsByTagName("trk")[0];
	activity.name = trk.getElementsByTagName("name")[0].innerHTML;
	
	activity.hasHr = Boolean(trk.getElementsByTagName("gpxtpx:hr")[0]);
	activity.hasCad = Boolean(trk.getElementsByTagName("gpxtpx:cad")[0]);
	activity.hasTemp = Boolean(trk.getElementsByTagName("gpxtpx:atemp")[0]);
	
	// individual track points
	activity.points = [];
	activity.laps = [];
	const trkSegs = trk.getElementsByTagName("trkseg");
	for (var i = 0; i < trkSegs.length; i++) {
		activity.points = activity.points.concat(parseTrkSeg(trkSegs[i]));
		activity.laps.push(activity.points.length - 1); // index of last point
	}
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