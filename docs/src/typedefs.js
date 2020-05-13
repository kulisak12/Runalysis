/**
 * @module Types
 */

/**
 * A track point object.
 * Carries the data for this point and for the previous section.
 * @typedef {Object} Point
 * @property {number} lat Latitude of point
 * @property {number} lon Longitude of point
 * @property {number} date Timestamp of point
 * @property {boolean} ignore If run was paused and this section should therefore be ignored
 * @property {number} duration Duration of section, in seconds
 * @property {number} sumDuration Total duration until point, in seconds
 * @property {number} distance Length of section, in meters
 * @property {number} sumDistance Total distance until point, in seconds
 * @property {number} elev Elevation of point, in meters
 * @property {number} elevDiff Change in elevation over section, in meters
 * @property {number} sumElevGain Total elevation gain until point
 * @property {number} incline Incline of section, represented as a fraction
 * @property {number} pace Speed of section, in km/h
 * @property {number} sumPace Weighted sum of pace until point, in km/h * s
 * @property {number} gap Grade adjusted speed of section, in km/h
 * @property {number} sumGap Weighted sum of gap until point, in km/h * s
 * @property {(null|number)} hr Heart rate of point, in bpm, may not exist
 * @property {number} sumHr Weighted sum of hr until point, in bpm * s, 0 if hr doesn't exist
 * @property {(null|number)} cad Cadence of point, in spm, may not exist
 * @property {number} sumCad Weighted sum of cad until point, in spm * s, 0 if cad doesn't exist
 * @property {(null|number)} temp Temperature of point, in degrees C, may not exist
 * @property {number} sumTemp Weighted sum of temp until point, in C * s, 0 if temp doesn't exist
 */

 /**
 * A run object.
 * Carries all data of the activity.
 * @typedef {Object} Run
 * @property {string} name Activity name
 * @property {string} source File extension of source
 * @property {string} startTime Timestamp of activity start
 * @property {Point[]} points Array of track points
 * @property {Array} laps Array of point indeces indicating laps
 * @property {boolean} hasEle Whether elevation information exists
 * @property {boolean} hasHr Whether heart rate information exists
 * @property {boolean} hasCad Whether cadence information exists
 * @property {boolean} hasTemp Whether temperature information exists
 */
