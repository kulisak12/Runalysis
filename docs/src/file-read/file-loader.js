/**
 * @category FileReading
 * @module FileLoader
 * @description Accepts an uploaded file and processes it.
 */

/**
 * Set options for Dropzone.
 */
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

/**
 * Send events to Dropzone.
 * @param {File} file The uploaded file
 */
function processFile(file) {
	gps.dropzone.emit("success", file, "success", null);
	gps.dropzone.emit("complete", file);

	if (file.name.endsWith(".gpx")) {
		readFile(file, gpxParser);
	}
}

/**
 * Extract file content, send it to a parser and redirect to view page.
 * @param {File} file The uploaded file
 * @param {Function} parser 
 */
function readFile(file, parser) {
	var reader = new FileReader();
	reader.onload = function() {
		var run = parser(reader.result);
		sessionStorage.setItem("runData", JSON.stringify(run));
		window.location.href = "view";
	};
	setTimeout(function() {reader.readAsText(file)}, 1000);
}
