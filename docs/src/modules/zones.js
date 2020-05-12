/**
 * Create the zones module
 */
function addZones() {
	// add settings
	if (run.hasHr) {
		addZoneSettings("hr");
	}
	addZoneSettings("pace");

	// create a table for each field
	var zonesContainer = document.getElementById("zones-container");
	var zoneFields = ["pace", "gap"];
	if (run.hasHr) {zoneFields.push("hr")};
	
	zoneFields.forEach(function(field) {
		zonesContainer.appendChild(createZoneTable(field));
		refreshZones(field);
	});

}

/**
 * Create a table to display the individual zones
 * @param {string} field 
 * @returns {HTMLTableElement} Table
 */
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

/**
 * Create the header for each table
 * @param {string} field 
 * @returns {HTMLTableRowElement} Header row
 */
function createZoneHeaderRow(field) {
	var row = document.createElement("tr");
	var cell = document.createElement("td");
	cell.colSpan = numZones.toString();
	cell.innerHTML = getFieldName(field) + " zones";
	row.appendChild(cell);
	return row;
}

/**
 * Create a row for zone charts
 * @param {string} baseColor Field color
 * @returns {HTMLTableRowElement} Column row
 */
function createZoneColumnRow(baseColor) {
	var row = document.createElement("tr");
	row.classList.add("zone-column");

	for (var i = 0; i < numZones; i++) {
		// get a shade of the base color
		var amount = 0.7 - i / (numZones - 1);
		var color = tinycolor(baseColor).brighten(amount * 80).toString();
		row.appendChild(createZoneColumn(color));
	}
	return row;
}

/**
 * Create a chart column
 * @param {string} color
 * @returns {HTMLTableCellElement} Column cell
 */
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

/**
 * Create a row for total duration and distance labels
 * @param {string} dataType zone-time or zone-dist
 * @returns {HTMLTableRowElement} Totals row
 */
function createZoneDataRow(dataType) {
	var row = document.createElement("tr");
	row.classList.add(dataType);

	for (var i = 0; i < numZones; i++) {
		var cell = document.createElement("td");
		row.appendChild(cell);
	}
	return row;
}

/**
 * Recalculate the zone distribution
 * @param {string} field 
 */
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

/**
 * Get the zone distribution
 * @param {string} field 
 * @returns {Array} Array of objects with total time and distance for each zone
 */
function getZoneData(field) {
	var zones = getZoneThresholds(field);
	var zeroArray = fillArray(0, numZones + 1); // including zone 0
	var zoneData = {
		time: zeroArray.slice(), // copy of the array
		dist: zeroArray.slice()
	};

	run.points.forEach(function(point) {
		if (point.ignore) {
			return;
		}
		var zone = getZone(zones, point[field]);
		zoneData.time[zone] += point.duration;
		zoneData.dist[zone] += point.distance;
	});

	// strip zone 0
	zoneData.time.shift();
	zoneData.dist.shift();
	return zoneData;
}

/**
 * Determine in which zone does a given value belong
 * @param {number[]} zones Zone thresholds
 * @param {number} value 
 * @returns {number} Zone index
 */
function getZone(zones, value) {
	var zone = 0;
	while (zone < numZones && value > zones[zone]) {
		zone++;
	}
	return zone;
}

/**
 * Get the user's custom zones, or the default values
 * @param {string} field 
 * @returns {number[]} Zone thresholds
 */
function getZoneThresholds(field) {
	if (isPace(field)) {
		field = "pace";
	}
	var zones = localStorage.getItem(field);
	if (zones == null) {
		if (field == "pace") {
			return [toSpeed(600), toSpeed(315), toSpeed(270), toSpeed(240), toSpeed(210)];
		}
		else if (field == "hr") {
			return [125, 140, 155, 170, 185];
		}
	}
	else {
		return JSON.parse(zones);
	}
}

/**
 * Get a range string for the given zone
 * @param {number} zone Zone index
 * @param {string} field 
 * @returns {string} Formatted range
 */
function thresholdsString(zone, field) {
	var zones = getZoneThresholds(field);
	var isFlipped = (zones[1] > zones[2]); // highest to lowest
	if (zone == zones.length - 1) {
		return (isFlipped ? "<" : ">") + " " + format(zones[zone], field);
	}
	else {
		return removeUnit(format(zones[zone], field)) + " - " + format(zones[zone + 1], field);
	}
}

/**
 * Display the zone customization dialogue
 * @param {string} field 
 */
function openPopup(field) {
	document.getElementById("popup").style.display = "block";
	var dialogue = document.getElementById("dialogue");
	dialogue.getElementsByClassName("save")[0].onclick = function() {saveZoneSettings(field);};
	dialogue.getElementsByClassName("reset")[0].onclick = function() {resetZoneSettings(field);};
	dialogue.getElementsByClassName("header")[0].innerHTML = getFieldName(field) + " zone settings";

	var toTimeFormat = {
		to: function(value) {return formatTime(value);},
		from: function(value) {return value;}
	};
	var options = {
		start: getZoneThresholds(field),
		step: 1,
		format: {
			to: function(value) {return Math.round(value);},
			from: function(value) {return value;}
		}
	};
	
	if (isPace(field)) {
		for (var i = 0; i < numZones; i++) {
			options.start[i] = Math.round(toPace(options.start[i]));
		}
		options.start.reverse();
		options.direction = "rtl";
		options.range = {"min": [120, 1], "75%": [420, 1], "max": [900, 1]};
		options.tooltips = fillArray(toTimeFormat, numZones);
	}
	if (field == "hr") {
		options.direction = "ltr";
		options.range = {"min": 80, "max": 220};
		options.tooltips = fillArray(true, numZones);
		options.margin = 3;
	}

	noUiSlider.create(document.getElementById("slider"), options);
}

/**
 * Close the zone customization popup
 */
function closePopup() {
	document.getElementById("slider").noUiSlider.destroy();
	document.getElementById("popup").style.display = "none";
}

/**
 * Update user's custom zones with values from customization dialogue
 * @param {string} field 
 */
function saveZoneSettings(field) {
	var values = document.getElementById("slider").noUiSlider.get();
	if (isPace(field)) {
		for (var i = 0; i < numZones; i++) {
			values[i] = toSpeed(values[i]);
		}
		field = "pace";
	}
	localStorage.setItem(field, JSON.stringify(values));
	document.getElementsByClassName("zones-customized " + field)[0].innerHTML = "Customized zones";
	refreshZones(field);
	refreshZones("gap");

	closePopup();
}

/**
 * Restore default zone values
 * @param {string} field 
 */
function resetZoneSettings(field) {
	localStorage.removeItem(field);
	document.getElementsByClassName("zones-customized " + field)[0].innerHTML = "Default zones";
	refreshZones(field);
	refreshZones("gap");

	closePopup();
}

/**
 * Create a sidebar with zone customization buttons
 * @param {string} field 
 */
function addZoneSettings(field) {
	var settingsDiv = document.getElementsByClassName("settings zones")[0];
	var zones = localStorage.getItem(field);
	settingsDiv.appendChild(createHeader(field));
	settingsDiv.appendChild(createCustomizedLabel(field));
	if (zones != null) {
		settingsDiv.getElementsByClassName("zones-customized " + field)[0].innerHTML = "Customized zones";
	}
	settingsDiv.appendChild(createPopupButton(field));
}

/**
 * Create a header with field name above the customization button
 * @param {string} field 
 * @returns {HTMLElement} Header element
 */
function createHeader(field) {
	var header = document.createElement("b");
	header.innerHTML = (field == "hr") ? "Heart rate" : "Pace";
	header.classList.add("header");
	return header;
}

/**
 * Create a label which says whether default or custom zones are in use
 * @param {string} field 
 * @returns {HTMLElement} Label element
 */
function createCustomizedLabel(field) {
	var label = document.createElement("i");
	label.innerHTML = "Default zones";
	label.classList.add("zones-customized", field);
	return label;
}

/**
 * Create a customize button which opens the popup
 * @param {string} field 
 * @returns {HTMLButtonElement} Button
 */
function createPopupButton(field) {
	var button = document.createElement("button");
	button.innerHTML = "Customize";
	button.classList.add("customize-button");
	button.onclick = function() {openPopup(field)};
	return button;
}

/**
 * Create an array filled with one value
 * @param {*} value Value to be filled
 * @param {number} length Final array lenght
 * @returns {Array}
 */
function fillArray(value, length) {
	var arr = [];
	for (var i = 0; i < length; i++) {
		arr.push(value);
	}
	return arr;
}