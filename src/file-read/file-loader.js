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

function sampleFile() {
	var file = new XMLHttpRequest();
    file.onreadystatechange = function () {
		if(file.readyState === 4) {
			if(file.status === 200 || file.status == 0){
				var fileText = file.responseText;
				var run = gpxParser(fileText);
				sessionStorage.setItem("runData", JSON.stringify(run));
				
				document.getElementById("error").innerHTML = "";
				window.location.href = "view.html";
            }
        }
    }
	file.open("GET", "../bezzastaveni.gpx", false);
    file.send(null);
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
