function drawGraphs(run) {
	var availableData = getAvailableData(run);
	addGraphBoxes(availableData);
	graphs = addGraphs(run);
	sync(graphs);

}


function addGraphs(run) {
	var graphDivs = Array.from(document.getElementsByClassName("graph-div"));
	var graphs = [];
	graphDivs.forEach(function(graphDiv) {
		var field1 = graphDiv.classList[1];
		var field2 = graphDiv.classList[2];
		var data = [];
		for (var i = 0; i < run.points.length; i++) {
			var point = run.points[i];
			var pointArray = [];
			pointArray.push(point.sumDuration);
			pointArray.push(point[field1]);
			pointArray.push(point[field2]);
			data.push(pointArray);
		}


		var seriesObj = {};
		seriesObj[getFieldName(field2)] = {
			fillGraph: true,
			strokeWidth: 0,
			axis: "y2"
		};
		var g = new Dygraph(graphDiv, data, {
			labels: ["Time", getFieldName(field1), getFieldName(field2)],
			legend: "always",
			series: seriesObj,
			//legendFormatter: legendFormatter,
			axes: {
				"y1": {
					independentTicks: true
				},
				"y2": {
					independentTicks: true
				}
			}
		});
		graphs.push(g);
	});
	return graphs;
}

function getAvailableData(run) {
	var availableData = ["pace"];
	if (run.hasEle) {availableData.push("elev", "gap");}
	if (run.hasHr) {availableData.push("hr");}
	if (run.hasCad) {availableData.push("cad");}
	if (run.hasTemp) {availableData.push("temp");}

	return availableData;
}

function addGraphBoxes(availableData) {
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
	
	graphBox.appendChild(createStatsDiv(field1, "left"));

	var graphDiv = document.createElement("div");
	graphDiv.classList.add("graph-div", field1, field2);
	graphBox.appendChild(graphDiv);

	graphBox.appendChild(createStatsDiv(field2, "right"));

	return graphBox;
}

function createStatsDiv(field, side) {
	var statsDiv = document.createElement("div");
	statsDiv.classList.add("stats-div", side);

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

	return statsDiv;
}

function sync(graphs) {
	var sync = Dygraph.synchronize(graphs, {
		selection: true,
		zoom: true,
		range: false
	});
}

/*
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
