function drawGraphs(run) {
	var availableData = getAvailableData(run);
	addDataSelector(availableData);
	addGraphBoxes(availableData);
	graphs = addGraphs(run);
	sync(graphs);

}


function addGraphs(run) {
	var graphDivs = Array.from(document.getElementsByClassName("graph-div"));
	var graphs = [];
	graphDivs.forEach(function(graphDiv) {
		var field = graphDiv.classList[1];
		var data = [];
		for (var i = 0; i < run.points.length; i++) {
			var point = run.points[i];
			var pointArray = [];
			pointArray.push(point.sumDuration);
			pointArray.push(point[field]);
			data.push(pointArray);
		}

		var g = new Dygraph(graphDiv, data, {
			labels: ["Time", getFieldName(field)],
			labelsDiv: document.getElementsByClassName("labels-div " + field)[0],
			legend: "always",
			legendFormatter: legendFormatter,
			axes: {
				"x": {
					drawAxis: true
				}
			}
		});
		graphs.push(g);
	});
	return graphs;
}

function legendFormatter(data) {
	if (data.x == null) { // nothing highlighted
	  return "--";
	}
	var result = "";
	for (var i = 0; i < data.series.length; i++) {
		if (i > 0) {
			result += "<br>";
		}
		result += data.series[i].yHTML;
	}
	return result;
}

function getAvailableData(run) {
	var availableData = ["elev", "pace", "gap"];
	if (run.hasHr) {availableData.push("hr");}
	if (run.hasCad) {availableData.push("cad");}
	if (run.hasTemp) {availableData.push("temp");}

	return availableData;
}

function addDataSelector(availableData) {
	var selectorDescriptions = document.getElementById("selector-descriptions");
	var selectorCheckboxes = document.getElementById("selector-checkboxes");
	availableData.forEach(function(field) {
		var td = document.createElement("td");
		var input = document.createElement("input");
		input.classList.add("selection", field);
		input.type = "checkbox";
		input.value = getFieldName(field);
		td.appendChild(input);
		selectorCheckboxes.appendChild(td);

		td = document.createElement("td");
		var description = document.createElement("span");
		description.innerHTML = getFieldName(field);
		td.appendChild(description);
		selectorDescriptions.appendChild(td);
	});
}

function addGraphBoxes(availableData) {
	availableData.forEach(function(field) {
		addGraphBox(field);
	});
}

function addGraphBox(field) {
	var graphBox = document.createElement("div");
	graphBox.classList.add("graph-box", field);
	
	var statsDiv = document.createElement("div");
	statsDiv.classList.add("stats-div");

	var graphName = document.createElement("b");
	graphName.innerHTML = getFieldName(field);
	statsDiv.appendChild(graphName);

	var labelsDiv = document.createElement("p");
	labelsDiv.classList.add("labels-div", field);
	statsDiv.appendChild(labelsDiv);
	
	var avgText = document.createElement("p");
	avgText.innerHTML = "Avg:";
	statsDiv.appendChild(avgText);
	
	var avgValue = document.createElement("p");
	avgValue.innerHTML = "todo";
	avgValue.classList.add("avg", field);
	statsDiv.appendChild(avgValue);
	graphBox.appendChild(statsDiv);

	var graphDiv = document.createElement("div");
	graphDiv.classList.add("graph-div", field);
	graphBox.appendChild(graphDiv);
	document.getElementById("graphs-container").appendChild(graphBox);
}

function sync(graphs) {
	var sync = Dygraph.synchronize(graphs, {
		selection: true,
		zoom: true,
		range: false
	});
}

function defaultZoom(graph, initial) {
	var slowestPaceToShow = 60*10;
	var extremes = graph.yAxisExtremes();
	var max = extremes[0][0];
	var min = extremes[0][1];
	if (min > slowestPaceToShow) {
		min = slowestPaceToShow;
	}
	if (!graph.isZoomed()) {
		graph.updateOptions({axes: {"y": {valueRange: [min, max]}}});
	}
}

/*
	visibility: [false, true, true, false, false, false, true, true, false],
	//animatedZooms: true, // cannot determine if graph is zoomed
	drawCallback: defaultZoom,
	xRangePad: 0,
	yRangePad: 0.5,
	rollPeriod: 2,
	showRoller: true,
	series: {
		"Elevation": {
			fillGraph: true,
			color: "gray",
			strokeWidth: 0,
			axis: "y2"
		},

*/
