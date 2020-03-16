function displaySharedData() {
	var url = window.location.href;
	var parametersString = url.substr(url.indexOf("?") + 1);

	var parameters = parametersString.split("&");
	for (var i = 0; i < parameters.length; i++) {
		parameters[i] = parameters[i].split("=");
	}

	var numbersContainer = document.getElementById("numbers-container");
	// date
	var date = new Date(parameters[0][1]);
	var options = {dateStyle: "full", timeStyle: "medium"};
	var dateBox = document.createElement("div");
	dateBox.classList.add("date-box");
	var dateValue = document.createElement("p");
	dateValue.innerHTML = date.toLocaleString("en-GB", options);
	dateBox.appendChild(dateValue);
	numbersContainer.appendChild(dateBox);

	for (var i = 1; i < parameters.length; i++) {
		var field = parameters[i][0];
		var stat = parseInt(parameters[i][1]);
		var numberBox = createNumberBox(field, format(stat, field));
		numbersContainer.appendChild(numberBox);
	}
}