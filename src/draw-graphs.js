"use strict";
var graphs;

function drawGraphs() {
	addGraphBoxes();
	graphs = addGraphs();
	graphs.forEach(function(g) {defaultZoom(g);});

	setColors(graphs);
	setOptions(graphs);
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
			labels: ["Time", field1, field2],
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
	graphs[0].plotter_.clear();
	// only show one x axis, between the two graphs
	graphs[0].updateOptions({
		axes: {
			"x": {
				drawAxis: true,
				axisLabelFormatter: formatTime,
			}
		}
	});

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
	getAvailableData().forEach(function(field) {
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
	getAvailableData().forEach(function(field) {
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

function getAvailableData() {
	var availableData = ["sumDuration", "sumDistance", "pace"];
	if (run.hasEle) {availableData.push("elev", "gap");}
	if (run.hasHr) {availableData.push("hr");}
	if (run.hasCad) {availableData.push("cad");}
	if (run.hasTemp) {availableData.push("temp");}

	return availableData;
}

function addGraphBoxes() {	
	var availableData = getAvailableData();
	availableData = availableData.slice(2); // remove sumDistance, sumDuration
	// first graph
	document.getElementById("graphs-container").appendChild(
		createGraphBox(availableData[0], availableData[1])
	);
	// second graph, field repeated
	if (availableData.length == 3) {
		document.getElementById("graphs-container").appendChild(
			createGraphBox(availableData[0], availableData[2])
		);
	}
	// second graph, two new fields
	if (availableData.length > 3) {
		document.getElementById("graphs-container").appendChild(
			createGraphBox(availableData[2], availableData[3])
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
	fieldDiv.classList.add("field-div", side);

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
