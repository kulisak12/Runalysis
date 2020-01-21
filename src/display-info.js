function createGraph(run) {
	canvas = document.getElementById("top-layer");
	ctx = canvas.getContext("2d");
	clickedX = null;

	var data = [];
	for (var i = 0; i < run.points.length; i++) {
		var point = run.points[i];
		var pointArray = [];
		pointArray.push(point.sumDuration);
		pointArray.push(point.sumDistance);
		pointArray.push(point.elev);
		pointArray.push(point.hr);
		pointArray.push(point.cad);
		pointArray.push(point.temp);
		pointArray.push(point.date);
		pointArray.push(point.pace);
		pointArray.push(point.gap);
		pointArray.push(point.incline);

		data.push(pointArray);
	}

	g = new Dygraph(document.getElementById("graphdiv"),
              data,
              {
				labels: ["Duration", "Distance", "Elevation", "Heart rate", "Cadence", "Temperature", "Time", "Pace", "GAP", "Incline"],
				visibility: [false, true, true, false, false, false, true, false, false],
				animatedZooms: true,
				//showRangeSelector: true,
				clickCallback: drawLine,
				highlightCallback: drawHighlight,
				series: {
					"Elevation": {
						fillGraph: true,
						strokeWidth: 0,
						axis: "y2"
					},
					"Heart rate": {
						fillGraph: true,
						strokeWidth: 0,
						axis: "y2"
					},
					"Pace": {
						axis: "y"
					},
					"GAP": {
						axis: "y"
					},
				},
				/*axes: {
					"y": {
						independentTicks: true,
						valueRange: [0, 12]
					},
					"y2": {
						independentTicks: true,
						valueRange: [0, 300],
						axisLabelFormatter: function(y2) {
							return y2.toString() + " min/km";
						}
					}
				}*/
			  });
}

function drawLine(e, x, points) {
	clickedX = x;
	var lineWidth = 1;
	
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	var area = g.getArea();
	var xCoord = g.toDomCoords(x, 100)[0];
	ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
	ctx.fillRect(xCoord - lineWidth, area.y, 2*lineWidth, area.h);
}

function drawHighlight(e, x, points, row, seriesName) {
	if (clickedX == null) {
		return;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var area = g.getArea();
	var xCoord = g.toDomCoords(x, 100)[0];
	var clickedXCoord = g.toDomCoords(clickedX, 100)[0];

	ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
	ctx.fillRect(xCoord, area.y, clickedXCoord - xCoord, area.h);

	drawLine(e, clickedX, points);
}


function padZeros(str, zeros) {
	while (str.length < zeros) {
		str = "0" + str;
	}
	return str;
}

function formatPace(pace) {
	pace = parseInt(pace);
	var secs = pace % 60;
	var minutes = (pace - secs) / 60;
	return minutes.toString() + ":" + padZeros(secs.toString(), 2);
}