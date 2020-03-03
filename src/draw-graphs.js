"use strict";
var graphs;

function drawGraphs() {
	addGraphBoxes();
	graphs = addGraphs();

	graphs.forEach(function(g) {
		defaultZoom(g);
		setColors(g);
		setOptions(g);
	});

	graphs.push(addAxis());
	sync(graphs);

	addGraphSettings();
}

// graph creation

function addGraphs() {
	var graphDivs = Array.from(document.getElementsByClassName("graph-div"));
	var graphs = [];
	graphDivs.forEach(function(graphDiv) {
		// each graph shows two fields
		var field1 = graphDiv.classList[1];
		var field2 = graphDiv.classList[2];
		var data = getGraphData(field1, field2);
		
		var g = new Dygraph(graphDiv, data, {
			labels: ["time", field1, field2],
			legend: "never",
			axes: {
				"x": {drawAxis: false, ticker: timeTicker},
				"y2": {independentTicks: true}
			}
		});
		graphs.push(g);
	});
	return graphs;
}

// create data source for graph
function getGraphData(field1, field2) {
	var data = [];
	for (var i = 0; i < run.points.length; i++) {
		var point = run.points[i];
		var pointArray = [];
		pointArray.push(point.sumDuration);
		pointArray.push(point[field1]);
		pointArray.push(point[field2]);
		data.push(pointArray);
	}
	return data;
}

function addGraphBoxes() {	
	var primaryFields = getAvailableData(FieldTypes.PRIMARY);
	var secondaryFields = getAvailableData(FieldTypes.SECONDARY);
	var graphsContainer = document.getElementById("graphs-container");
	// TODO only one field (pace) available
	// first graph
	graphsContainer.appendChild(
		createGraphBox(primaryFields[0], secondaryFields[0])
	);
	// x axis
	var axisGraphBox = createGraphBox("axis", "axis");
	var axisGraphDiv = axisGraphBox.children[1];
	axisGraphDiv.classList.remove("graph-div");
	axisGraphDiv.id = "axis-div";
	graphsContainer.appendChild(axisGraphBox);

	// second graph, field repeated
	if (primaryFields.length >= 2 && secondaryFields.length == 1) {
		graphsContainer.appendChild(
			createGraphBox(primaryFields[1], secondaryFields[0])
		);
	}
	// second graph, two new fields
	else if (secondaryFields.length >= 2) {
		graphsContainer.appendChild(
			createGraphBox(primaryFields[1], secondaryFields[1])
		);
	}
}

function createGraphBox(field1, field2) {
	var graphBox = document.createElement("div");
	graphBox.classList.add("graph-box", field1, field2);
	
	graphBox.appendChild(createFieldDiv(field1, "left"));

	var graphDiv = document.createElement("div");
	graphDiv.classList.add("graph-div", field1, field2);
	graphBox.appendChild(graphDiv);

	graphBox.appendChild(createFieldDiv(field2, "right"));

	return graphBox;
}

function createFieldDiv(field, side) {
	var fieldDiv = document.createElement("div");
	fieldDiv.classList.add("field-div", field, "side", side);

	var graphName = document.createElement("b");
	graphName.innerHTML = getFieldName(field) + ":";
	fieldDiv.appendChild(graphName);

	var legend = document.createElement("p");
	legend.classList.add("legend", field);
	legend.innerHTML = "--";
	fieldDiv.appendChild(legend);
	
	var selectionText = document.createElement("b");
	selectionText.innerHTML = "Selection:";
	fieldDiv.appendChild(selectionText);
	
	var statsValue = document.createElement("p");
	statsValue.classList.add("stats", field);
	fieldDiv.appendChild(statsValue);

	return fieldDiv;
}

// display adjustments

function setOptions(g) {
	g.plotter_.clear();
	// get field names
	var fields = getGraphFields(g);

	var seriesObj = {};
	seriesObj[fields[1]] = {
		fillGraph: true,
		strokeWidth: 0,
		axis: "y2"
	};

	var axesObj = {};
	var timeFormatter = {
		axisLabelFormatter: formatTime,
		ticker: timeTicker
	};
	var numberFormatter = {
		ticker: Dygraph.numericTicks
	}
	if (isPace(fields[0])) {
		axesObj["y"] = timeFormatter;
	}
	else {
		axesObj["y"] = null;
	}

	g.updateOptions({
		animatedZooms: true,
		axes: axesObj,
		series: seriesObj,
		drawCallback: visibleRange,
		highlightCallback: highlight,
		unhighlightCallback: unhighlight,
	});
}

function setColors(g) {
	var seriesObj = {};
	Object.keys(colors).forEach(function(key) {
		seriesObj[key] = {color: colors[key]};
	});
	g.updateOptions({
		series: seriesObj
	});
}

function sync(graphs) {
	var sync = Dygraph.synchronize(graphs, {
		selection: true,
		zoom: true,
		range: false
	});
}

// custom graph where only the axis is shown
function addAxis() {
	var data = [];
	for (var i = 0; i < run.points.length; i++) {
		var point = run.points[i];
		var pointArray = [];
		pointArray.push(point.sumDuration);
		pointArray.push(1);
		data.push(pointArray);
	}
	
	var g = new Dygraph(document.getElementById("axis-div"), data, {
		labels: ["time", "second"],
		legend: "never",
		visibility: [false],
		series: {
			"second": {
				axis: "y2"
			}
		},
		axes: {
			"x": {drawAxis: true, ticker: timeTicker},
			"y": {drawAxis: true, ticker: emptyTicker},
			"y2": {drawAxis: true}
		}
	});

	return g;
}

// user interaction

function highlight(event, x, points, row, seriesName) {
	// the first point is missing some information
	if (x == 0) {
		return;
	}
	var point = getPointByTime(x);
	getAvailableData(FieldTypes.ALL).forEach(function(field) {
		var fieldLegendEles = Array.from(document.getElementsByClassName("legend " + field));
		fieldLegendEles.forEach(function(legendEle) {
			legendEle.innerHTML = format(point[field], field);
		});
	});

	// highlight point on the map
	var coords = SMap.Coords.fromWGS84(point.lon, point.lat);
	if (markerLayer.getMarkers().length == 0) {
		// add a marker
		var marker = new SMap.Marker(coords, "highlighter");
		markerLayer.addMarker(marker);
	}
	else {
		// move the marker
		markerLayer.getMarkers()[0].setCoords(coords);
	}

}

function unhighlight(event) {
	getAvailableData(FieldTypes.ALL).forEach(function(field) {
		var fieldLegendEles = Array.from(document.getElementsByClassName("legend " + field));
		fieldLegendEles.forEach(function(legendEle) {
			legendEle.innerHTML = "--";
		});
	});

	markerLayer.removeAll();
}

function defaultZoom(g) {
	var fields = getGraphFields(g);
	if (!isPace(fields[0])) {
		g.resetZoom();
		return;
	}
	// find optimal value range
	var extremes = getExtremes(fields[0]);
	var min = extremes[0] - paceAxisPadding;
	var max = extremes[1] + paceAxisPadding;
	if (max > slowestPaceToShow) {
		max = slowestPaceToShow;
	}
	g.updateOptions({
		dateWindow: g.xAxisExtremes(),
		axes: {"y": {valueRange: [max, min]}}
	});
}

function visibleRange(g, isInitial) {
	var range = g.xAxisRange();
	var leftPoint = getPointByTime(range[0]);
	var rightPoint = getPointByTime(range[1]);
	
	getAvailableData(FieldTypes.ALL).forEach(function(field) {
		var fieldStatsEles = Array.from(document.getElementsByClassName("stats " + field));
		fieldStatsEles.forEach(function(statsEle) {
			var stat = rangeStats(leftPoint, rightPoint, field);
			statsEle.innerHTML = format(stat, field);
		});
	});
}

// custom settings

function addGraphSettings() {
	// get all graph elements
	var fieldGraphs = [];
	fieldGraphs.push(graphs[0]);
	if (graphs.length > 1) {
		fieldGraphs.push(graphs[1]);
	}

	var fieldGraphBoxes = getFieldGraphBoxes();
	var settingsDiv = document.getElementsByClassName("settings graphs")[0];

	// for each graph
	for (var i = 0; i < fieldGraphs.length; i++) {
		let g = fieldGraphs[i];
		let graphBox = fieldGraphBoxes[i];
		var fields = getGraphFields(g);
		var graphSettingsDiv = document.createElement("div");
		graphSettingsDiv.classList.add("graph-settings");

		var primarySelection = createSelection(FieldTypes.PRIMARY, fields[0]);
		primarySelection.onchange = function() {swapFields(this.value, g, graphBox, FieldTypes.PRIMARY)};
		graphSettingsDiv.appendChild(primarySelection);
		var secondarySelection = createSelection(FieldTypes.SECONDARY, fields[1]);
		secondarySelection.onchange = function() {swapFields(this.value, g, graphBox, FieldTypes.SECONDARY)};
		graphSettingsDiv.appendChild(secondarySelection);

		settingsDiv.appendChild(graphSettingsDiv);
	}
}

function createSelection(fieldTypes, selected) {
	var selection = document.createElement("select");
	var index = 0;
	getAvailableData(fieldTypes).forEach(function(field) {
		var item = document.createElement("option");
		item.value = field;
		item.innerHTML = getFieldName(field);
		selection.appendChild(item);
	});
	selection.classList.add("graph-selection");
	selection.value = selected;
	return selection;
}

function swapFields(newField, g, graphBox, fieldType) {
	var oldFields = getGraphFields(g);
	var oldField;
	if (fieldType == FieldTypes.PRIMARY) {
		oldField = oldFields[0];
	}
	else {
		oldField = oldFields[1];
	}
	var newFields = oldFields.slice();
	newFields[oldFields.indexOf(oldField)] = newField;

	// change classes
	var elementList = [];
	elementList.push(graphBox);
	elementList.push(graphBox.getElementsByClassName("graph-div")[0]);
	elementList.forEach(function(element) {
		element.classList.remove(oldFields[0], oldFields[1]);
		element.classList.add(newFields[0], newFields[1]);
	});

	// change field div
	var replacedDiv = graphBox.getElementsByClassName("field-div " + oldField)[0];
	var side = replacedDiv.classList[3];
	var newDiv = createFieldDiv(newField, side);
	graphBox.replaceChild(newDiv, replacedDiv);

	// update everything
	g.updateOptions({
		file: getGraphData(newFields[0], newFields[1]),
		labels: ["time", newFields[0], newFields[1]]
	});
	setOptions(g);
	defaultZoom(g);
	sync(graphs);
}

// get methods

function getGraphFields(g) {
	var field1 = g.getOption("labels")[1];
	var field2 = g.getOption("labels")[2];
	return [field1, field2];
}

function getFieldGraphBoxes() {
	var fieldGraphBoxes = Array.from(document.getElementsByClassName("graph-box"));
	for (var i = 0; i < fieldGraphBoxes.length; i++) {
		var classes = fieldGraphBoxes[i].classList;
		if (classes.contains("top") || classes.contains("axis")) {
			fieldGraphBoxes.splice(i, 1);
			i--;
		}
	}
	return fieldGraphBoxes;
}