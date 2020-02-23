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