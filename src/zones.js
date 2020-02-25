function addZones() {
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

	var columnRow = createZoneColumnRow(colors[field]);
	table.appendChild(columnRow);
	table.appendChild(createZoneDataRow("zone-time"));
	table.appendChild(createZoneDataRow("zone-dist"));

	return table;
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
		return [128, 143, 159, 174, 190];
	}
}