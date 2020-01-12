// check uploaded file
function getFile() {
	const formEle = document.getElementById("file");
	const errorEle = document.getElementById("error");
	var file = formEle.files[0];
	
	if (file == null) {
		return;
	}
	if (!file.name.endsWith(".gpx")) {
		errorEle.innerHTML = "Please upload a .gpx file.";
		return;
	}
	errorEle.innerHTML = "";
	formEle.value = "";
	readFile(file);
}

// extract content
function readFile(file) {
	var reader = new FileReader();
		reader.onload = function() {
			sessionStorage.setItem("gpxXml", reader.result);
			window.location.href = "view.html";
		};
		reader.readAsText(file);
}
