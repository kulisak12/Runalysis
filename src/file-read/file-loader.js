// check uploaded file
function getFile() {
	var file = document.getElementById("file").files[0];
	
	if (file == null) {
		return;
	}

	if (file.name.endsWith(".gpx")) {
		readFile(file, gpxParser);
	}
	else { // unsupported format
		document.getElementById("error").innerHTML = "Please upload a .gpx file.";
		return;
	}
}


// extract content
function readFile(file, parser) {
	var reader = new FileReader();
	reader.onload = function() {
		var run = parser(reader.result);
		sessionStorage.setItem("runData", JSON.stringify(run));

		document.getElementById("error").innerHTML = "";
		document.getElementById("file").value = "";
		window.location.href = "view.html";
	};
	reader.readAsText(file);
}
