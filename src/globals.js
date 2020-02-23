const names = [
	{id: "pace", name: "Pace"},
	{id: "elev", name: "Elevation"},
	{id: "gap", name: "GAP"},
	{id: "hr", name: "Heart rate"},
	{id: "cad", name: "Cadence"},
	{id: "temp", name: "Temperature"},
	{id: "sumDistance", name: "Distance"},
	{id: "sumDuration", name: "Time"},
	{id: "elapsed", name: "Elapsed time"},
	{id: "sumElevGain", name: "Elev gain"},
	{id: "trimp", name: "Trimp"},
];

const colors = {
	"pace": "blue",
	"elev": "gray",
	"gap": "green",
	"hr": "red",
	"cad": "purple",
	"temp": "orange"
};

const FieldTypes = {
	ALL: 1,
	MAIN: 2,
	DEPENDANT: 3,
	PRIMARY: 4,
	SECONDARY: 5
};

const pausedThreshold = 10;
const slowestPaceToShow = 60 * 10;
const maxPace = 60 * 60;
const paceAxisPadding = 20;