"use strict";
var graphs;

function drawGraphs() {
	addGraphBoxes();
	graphs = addGraphs();
	graphs.forEach(function(g) {defaultZoom(g);});

	setColors(graphs);
	setOptions(graphs);
	addAxis(graphs);
	sync(graphs);

}


function addGraphs() {
	var graphDivs = Array.from(document.getElementsByClassName("graph-div"));
	var graphs = [];
	graphDivs.forEach(function(graphDiv) {
		// each graph shows two fields
		var field1 = graphDiv.classList[1];
		var field2 = graphDiv.classList[2];
		// create data source for graph
		var data = [];
		for (var i = 0; i < run.points.length; i++) {
			var point = run.points[i];
			var pointArray = [];
			pointArray.push(point.sumDuration);
			pointArray.push(point[field1]);
			pointArray.push(point[field2]);
			data.push(pointArray);
		}
		
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

function setOptions(graphs) {
	graphs.forEach(function(g) {
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
		if (isPace(fields[0])) {
			axesObj["y"] = timeFormatter;
		}
		if (isPace(fields[1])) {
			axesObj["y2"] = timeFormatter;
		}

		g.updateOptions({
			animatedZooms: true,
			axes: axesObj,
			series: seriesObj,
			drawCallback: visibleRange,
			highlightCallback: highlight,
			//unhighlightCallback: unhighlight, // TODO: do I want to unhighlight?
		});
	});
}

function highlight(event, x, points, row, seriesName) {
	// the first point is missing some information
	if (x == 0) {
		return;
	}
	getAvailableData(FieldTypes.ALL).forEach(function(field) {
		var fieldLegendEles = Array.from(document.getElementsByClassName("legend " + field));
		fieldLegendEles.forEach(function(legendEle) {
			legendEle.innerHTML = format(getPointByTime(x)[field], field);
		});
	});
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
	var timeDiff = pointDifference(leftPoint, rightPoint, "sumDuration");
	getAvailableData(FieldTypes.ALL).forEach(function(field) {
		var fieldStatsEles = Array.from(document.getElementsByClassName("stats " + field));
		fieldStatsEles.forEach(function(statsEle) {
			if (isPace(field) || field == "hr" || field == "cad") {
				var sumField = "sum" + field.charAt(0).toUpperCase() + field.slice(1); // pace -> sumPace
				var avg = pointDifference(leftPoint, rightPoint, sumField) / timeDiff;
				statsEle.innerHTML = format(avg, field);
			}
			else if (field == "elev" || field == "sumDuration" || field == "sumDistance") {
				var difference = pointDifference(leftPoint, rightPoint, field);
				statsEle.innerHTML = format(difference, field);
			}
		});
	});
}

function setColors(graphs) {
	var seriesObj = {};
	seriesObj["pace"] = {color: "blue"};
	seriesObj["elev"] = {color: "gray"};
	seriesObj["gap"] = {color: "green"};
	seriesObj["hr"] = {color: "red"};
	seriesObj["cad"] = {color: "purple"};

	graphs.forEach(function(g) {
		g.updateOptions({
			series: seriesObj
		});
	});
}

function getGraphFields(g) {
	var field1 = g.getOption("labels")[1];
	var field2 = g.getOption("labels")[2];
	return [field1, field2];
}

function getAvailableData(fieldType) {
	var main = ["sumDuration", "sumDistance"];
	var primary = ["pace"];
	var secondary = [];
	if (run.hasEle) {
		primary.push("gap");
		secondary.push("elev");
	}
	if (run.hasHr) {
		secondary.push("hr");
	}
	if (run.hasCad) {
		primary.push("cad");
	}
	if (run.hasTemp) {
		secondary.push("temp");
	}

	if (fieldType == FieldTypes.ALL) {
		return Array.prototype.concat(main, primary, secondary);
	}
	if (fieldType == FieldTypes.MAIN) {
		return main;
	}
	if (fieldType == FieldTypes.DEPENDANT) {
		return Array.prototype.concat(primary, secondary);
	}
	if (fieldType == FieldTypes.PRIMARY) {
		return primary;
	}
	if (fieldType == FieldTypes.SECONDARY) {
		return secondary;
	}

	// wrong value
	console.warn("Wrong field type");
	return null;
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

function sync(graphs) {
	var sync = Dygraph.synchronize(graphs, {
		selection: true,
		zoom: true,
		range: false
	});
}

// custom graph where only the axis is shown
function addAxis(graphs) {
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

	graphs.push(g);
}