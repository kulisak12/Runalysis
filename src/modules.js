function toggleModule(sender) {
	var moduleName = sender.classList[1];
	var module = document.getElementsByClassName("module " + moduleName)[0];
	var state = (module.style.display != "none");

	// show module
	if (state == 0) {
		module.style.display = "";
		sender.style.filter = "";
	}
	// hide module
	else {
		module.style.display = "none";
		sender.style.filter = "invert(50%)";
	}
}

function addShareLink() {
	var fields = ["sumDistance", "sumDuration", "pace", "sumElevGain", "elapsed"];
	if (run.hasHr) {
		fields.push("hr");
	}
	if (run.hasCad) {
		fields.push("cad");
	}

	var shareString = "share.html?";
	shareString += "date=" + run.startTime;
	fields.forEach(function(field) {
		shareString += "&" + field + "=" + Math.round(getOverallStat(field));
	});

	var shareAnchor = document.getElementById("share").getElementsByTagName("a")[0];
	shareAnchor.href = shareString;
}