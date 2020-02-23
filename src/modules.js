function toggleModule(sender) {
	var moduleName = sender.classList[1];
	var module = document.getElementsByClassName("module " + moduleName)[0];
	var state = (module.style.display != "none");

	if (state == 0) {
		// show module
		module.style.display = "";
		sender.style.filter = "";
	}
	else {
		// hide module
		module.style.display = "none";
		sender.style.filter = "invert(50%)";
	}
}