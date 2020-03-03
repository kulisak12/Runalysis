function addZones() {
	addZoneSettings();

	var zonesContainer = document.getElementById("zones-container");
	var zoneFields = ["pace", "gap"];
	if (run.hasHr) {zoneFields.push("hr")};
	
	zoneFields.forEach(function(field) {
		zonesContainer.appendChild(createZoneTable(field));
		refreshZones(field);
	});

}

function createZoneTable(field) {
	var table = document.createElement("table");
	table.classList.add("zones", field);

	table.appendChild(createZoneHeaderRow(field));
	var columnRow = createZoneColumnRow(colors[field]);
	table.appendChild(columnRow);
	table.appendChild(createZoneDataRow("zone-time"));
	table.appendChild(createZoneDataRow("zone-dist"));

	return table;
}

function createZoneHeaderRow(field) {
	var row = document.createElement("tr");
	var cell = document.createElement("td");
	cell.colSpan = numZones.toString();
	cell.innerHTML = getFieldName(field) + " zones";
	row.appendChild(cell);
	return row;
}

function createZoneColumnRow(baseColor) {
	var row = document.createElement("tr");
	row.classList.add("zone-column");

	for (var i = 0; i < numZones; i++) {
		var amount = 0.7 - i / (numZones - 1);
		var color = tinycolor(baseColor).brighten(amount * 80).toString();
		row.appendChild(createZoneColumn(color));
	}
	return row;
}

function createZoneColumn(color) {
	var cell = document.createElement("td");

	var columnDiv = document.createElement("div");
	columnDiv.style.backgroundColor = color;
	cell.appendChild(columnDiv);

	var zoneInfo = document.createElement("span");
	//zoneInfo.innerHTML = "Z1<br>3:30 - 4:05";
	cell.appendChild(zoneInfo);
	return cell;
}

function createZoneDataRow(dataType) {
	var row = document.createElement("tr");
	row.classList.add(dataType);

	for (var i = 0; i < numZones; i++) {
		var cell = document.createElement("td");
		row.appendChild(cell);
	}
	return row;
}

function refreshZones(field) {
	var zonesTable = document.getElementsByClassName("zones " + field)[0];
	var zoneData = getZoneData(field);
	var maxTimeInZone = Math.max(...zoneData.time);

	// columns
	var columnRow = zonesTable.getElementsByClassName("zone-column")[0];
	var columns = Array.from(columnRow.children);
	for (var i = 0; i < zoneData.time.length; i++) {
		var columnDiv = columns[i].getElementsByTagName("div")[0];
		var percentage = Math.ceil(100 * zoneData.time[i] / maxTimeInZone);
		columnDiv.style.height = percentage.toString() + "%";

		var columnInfoBox = columns[i].getElementsByTagName("span")[0];
		var infoText = "Z" + (i + 1) + "<br>";
		infoText += thresholdsString(i, field);
		columnInfoBox.innerHTML = infoText; 
	}

	// time and dist
	var timeRow = zonesTable.getElementsByClassName("zone-time")[0];
	var timeCells = Array.from(timeRow.children);
	var distRow = zonesTable.getElementsByClassName("zone-dist")[0];
	var distCells = Array.from(distRow.children);
	for (var i = 0; i < zoneData.time.length; i++) {
		timeCells[i].innerHTML = formatTime(zoneData.time[i]);
		distCells[i].innerHTML = formatDistance(zoneData.dist[i]);
	}
}

function getZoneData(field) {
	var zones = getZoneThresholds(field);
	var zeroArray = [];
	for (var i = 0; i < numZones + 1; i++) { // including zone 0
		zeroArray.push(0);
	}
	var zoneData = {
		time: zeroArray.slice(), // copy of the array
		dist: zeroArray.slice()
	};

	run.points.forEach(function(point) {
		if (point.ignore) {
			return;
		}
		var zone = getZone
		(zones, point[field]);
		zoneData.time[zone] += point.duration;
		zoneData.dist[zone] += point.distance;
	});

	// strip zone 0
	zoneData.time.shift();
	zoneData.dist.shift();
	return zoneData;
}

function getZone(zones, value) {
	var isFlipped = (zones[1] > zones[2]);
	var zone = 0;
	while (zone < numZones &&
		(isFlipped !== value > zones[zone])) {
		zone++;
	}
	return zone;
}

function getZoneThresholds(field) {
	if (isPace(field)) {
		return [600, 315, 270, 240, 210];
	}
	if (field == "hr") {
		var maxHr = parseInt(document.getElementById("maxhr").value);
		var restHr = parseInt(document.getElementById("resthr").value);
		var hrReserve = maxHr - restHr;
		var percents = [50, 60, 70, 80, 90];
		var thresholds = [];
		for (var i = 0; i < numZones; i++) {
			var threshold = 0.01 * percents[i] * hrReserve + restHr;
			thresholds.push(Math.round(threshold));
		}
		return thresholds;
	}
}

function thresholdsString(zone, field) {
	var zones = getZoneThresholds(field);
	var isFlipped = (zones[1] > zones[2]);
	if (zone == zones.length - 1) {
		return (isFlipped ? "<" : ">") + " " + format(zones[zone], field);
	}
	else {
		return removeUnit(format(zones[zone], field)) + " - " + format(zones[zone + 1], field);
	}
}

function addZoneSettings() {
	var settingsDiv = document.getElementsByClassName("settings zones")[0];
	// heart rate
	if (run.hasHr) {
		var header = document.createElement("b");
		header.innerHTML = "Heart rate";
		var headerDiv = document.createElement("div");
		headerDiv.appendChild(header);
		settingsDiv.appendChild(headerDiv);

		var maxHrDiv = document.createElement("div");
		maxHrDiv.innerHTML = "Max: ";
		var maxHrInput = document.createElement("input");
		maxHrInput.id = "maxhr";
		maxHrInput.type = "number";
		maxHrInput.value = 200;
		maxHrInput.min = 0;
		maxHrInput.onchange = function() {refreshZones("hr");};
		maxHrDiv.appendChild(maxHrInput);
		settingsDiv.appendChild(maxHrDiv);

		var restHrDiv = document.createElement("div");
		restHrDiv.innerHTML = "Rest: ";
		var restHrInput = document.createElement("input");
		restHrInput.id = "resthr";
		restHrInput.type = "number";
		restHrInput.value = 50;
		restHrInput.min = 0;
		restHrInput.onchange = function() {refreshZones("hr");};
		restHrDiv.appendChild(restHrInput);
		settingsDiv.appendChild(restHrDiv);
	}
}