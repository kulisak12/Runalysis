const names = [
	{id: "pace", name: "Pace"},
	{id: "elev", name: "Elevation"},
	{id: "gap", name: "GAP"},
	{id: "hr", name: "Heart rate"},
	{id: "temp", name: "Temperature"},
];

const FieldTypes = {
	ALL: 1,
	MAIN: 2,
	DEPENDANT: 3,
	PRIMARY: 4,
	SECONDARY: 5
};

const pausedThreshold = 10;
const slowestPaceToShow = 60 * 10;
const paceAxisPadding = 20;