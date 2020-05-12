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

/**
 * Enumerate for field types based on where in graphs they are plotted
 * @enum {number}
 */
const FieldTypes = {
	ALL: 1,
	/** Fields on the x axis */
	MAIN: 2,
	/** Fields on the y axis */
	DEPENDANT: 3,
	/** Fields drawn with a line */
	PRIMARY: 4,
	/** Fields drawn using a filled area */
	SECONDARY: 5
};

const pausedThreshold = 10;
const cutoffArea = 60;
const slowestSpeed = 1;
const maxPace = 60 * 60; // unused?
const axisPadding = 20;
const numZones = 5;
const shareCoordAccuracy = 1e5;