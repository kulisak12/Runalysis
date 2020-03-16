function dropzoneInit() {
	var options = {
		paramName: "file",
		maxFilesize: 20, // MB
		maxFiles: 1,
		autoProcessQueue: false,
		acceptedFiles: ".gpx",
		init: function() {
			this.on("addedfile", processFile);
		  }
	};

	Dropzone.options.gps = options;
}

// send dropzone events
function processFile(file) {
	gps.dropzone.emit("success", file, "success", null);
	gps.dropzone.emit("complete", file);
	if (file.name.endsWith(".gpx")) {
		readFile(file, gpxParser);
	}
}

function sampleFile() {
	var file = new XMLHttpRequest();
    file.onreadystatechange = function () {
		if(file.readyState === 4) {
			if(file.status === 200 || file.status == 0){
				var fileText = file.responseText;
				var run = gpxParser(fileText);
				sessionStorage.setItem("runData", JSON.stringify(run));				
				window.location.href = "view.html";
            }
        }
    }
	file.open("GET", "../sample.gpx", false);
    file.send(null);
}

// extract content
function readFile(file, parser) {
	var reader = new FileReader();
	reader.onload = function() {
		var run = parser(reader.result);
		sessionStorage.setItem("runData", JSON.stringify(run));
		window.location.href = "view.html";
	};
	setTimeout(function() {reader.readAsText(file)}, 1000);
}
