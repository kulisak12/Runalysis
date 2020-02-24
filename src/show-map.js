var markerLayer = null;

function addGps() {
    var center = SMap.Coords.fromWGS84(14.400307, 50.071853);
    let map = new SMap(JAK.gel("map"), center, 5);
    map.addDefaultLayer(SMap.DEF_TURIST).enable();
    map.addDefaultControls();

    // automatic map resizing
    var sync = new SMap.Control.Sync();
    map.addControl(sync);
    
    // add gps track
    var value = createGpx();
    var xmlDoc = JAK.XML.createDocument(value);
    var gpx = new SMap.Layer.GPX(xmlDoc, null, {maxPoints:500, colors:["#ff0000"]});
    map.addLayer(gpx);
    gpx.enable();
    gpx.fit();

    // layer for highlighted points
    markerLayer = new SMap.Layer.Marker();
    map.addLayer(markerLayer);
    markerLayer.enable();

}

function createGpx() {
    var gpx = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><gpx><trk><trkseg>";
    run.points.forEach(function(point) {
        var pointGpx = "<trkpt lat=\"" + point.lat.toString() +
        "\" lon=\"" + point.lon.toString() + "\">";
        pointGpx += "</trkpt>";
        gpx += pointGpx;
    });
    gpx += "</trkseg></trk></gpx>"
    return gpx;
}


// number stats

function addNumbers() {
	var numbersContainer = document.getElementById("numbers-container");
	// date
	var date = new Date(run.startTime);
	var options = {dateStyle: "full", timeStyle: "medium"};
	var dateBox = document.createElement("div");
	dateBox.classList.add("date-box");
	var dateValue = document.createElement("p");
	dateValue.innerHTML = date.toLocaleString("en-GB", options);
	dateBox.appendChild(dateValue);
	numbersContainer.appendChild(dateBox);

	// other fields
	var fields = ["sumDistance", "sumDuration", "pace", "sumElevGain", "elapsed"];
	if (run.hasHr) {
		fields.push("trimp");
	}
	fields.forEach(function(field) {
		var numberBox = createNumberBox(field);
		numbersContainer.appendChild(numberBox);
	});
}

function createNumberBox(field) {
	var numberBox = document.createElement("div");
	numberBox.classList.add("number-box");

	var value = document.createElement("p");
	value.classList.add("number-value");
	value.innerHTML = format(getOverallStat(field), field);
	numberBox.appendChild(value);

	var desc = document.createElement("p");
	desc.classList.add("number-desc");
	desc.innerHTML = getFieldName(field);
	numberBox.appendChild(desc);

	return numberBox;
}

function getOverallStat(field) {
	var firstPoint = run.points[0];
	var lastPoint = run.points[run.points.length - 1];
	if (field == "elapsed") {
		return calculateDuration(firstPoint, lastPoint);
	}
	else if (field == "trimp") {
		return calculateTrimp();
	}
	else {
		return rangeStats(firstPoint, lastPoint, field);
	}
}

function calculateTrimp() {
	var trimp = 0;
	run.points.forEach(function(point) {
		if (!point.ignore) {
			trimp += trimpCurve(point.hr) * point.duration;
		}
	});
	return Math.round(trimp);
}

function trimpCurve(hr) {
	return 0.000058 * Math.pow(Math.E, 0.038 * hr);
}