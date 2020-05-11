function dropzoneInit() {
	var options = {
		maxFilesize: 20, // MB
		maxFiles: 1,
		autoProcessQueue: false,
		acceptedFiles: ".gpx",
		dictDefaultMessage: "Drop a .gpx file here",
		dictInvalidFileType: "Unsupported format, please use .gpx.",
		accept: function(file, done) {
			done();
			processFile(file);
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
