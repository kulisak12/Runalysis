/**
 * Parser for the .gpx format
 * @param {string} fileContent Text in .gpx format
 * @returns {Run} Parsed run object
 */
function gpxParser(fileContent) {
	var run = {};
	
	// gpx is in xml format, use a built-in parser
	var parser = new DOMParser();
	const xmlDom = parser.parseFromString(fileContent, "text/xml");

	// general tags
	const gpx = xmlDom.getElementsByTagName("gpx")[0];
	const startTime = gpx.getElementsByTagName("metadata")[0].getElementsByTagName("time")[0].innerHTML;
	run.startTime = new Date(startTime);
	run.source = "gpx";
	
	// track
	const trk = gpx.getElementsByTagName("trk")[0];
	run.name = trk.getElementsByTagName("name")[0].innerHTML;
	
	run.hasEle = Boolean(trk.getElementsByTagName("ele")[0]);
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

/**
 * Get all the points from a gpx segment
 * @param {HTMLElement} trkSeg Gpx segment element
 * @returns {Point[]} 
 */
function parseTrkSeg(trkSeg) {
	var points = [];
	const trkPts = trkSeg.getElementsByTagName("trkpt");
	for (var i = 0; i < trkPts.length; i++) {
		points[i] = parseTrkPt(trkPts[i]);
	}
	return points;
}


/**
 * Get data from a track point
 * @param {HTMLElement} trkPt Gpx track point element
 * @return {Point} 
 */
function parseTrkPt(trkPt) {
	var point = {};
	point.lat = parseFloat(trkPt.getAttribute("lat"));
	point.lon = parseFloat(trkPt.getAttribute("lon"));
	point.elev = parseFloat(trkPt.getElementsByTagName("ele")[0].innerHTML);
	point.date = new Date(trkPt.getElementsByTagName("time")[0].innerHTML).getTime();
	
	// extra information, may not be present
	const extensionsEle = trkPt.getElementsByTagName("gpxtpx:TrackPointExtension")[0];
	if (extensionsEle != null) {
		point.hr = parseExtension(extensionsEle.getElementsByTagName("gpxtpx:hr")[0]);
		point.cad = 2 * parseExtension(extensionsEle.getElementsByTagName("gpxtpx:cad")[0]);
		point.temp = parseExtension(extensionsEle.getElementsByTagName("gpxtpx:atemp")[0]);
	}
	return point;
}
/**
 * Get an extension value, if it exists
 * @param {HTMLElement} valueEle Gpx extension element
 * @return {(null|number)} Extension value or null
 */
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
