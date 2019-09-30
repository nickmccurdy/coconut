/**
 * Adds a list of global variables to the window object.
 *
 * @param globals Object of variables that should be made available on window.
 *
 * @example
 *
 * // The following invocation makes window.activityId and window.activityName available for use.
 * setGlobals({ activityId: 3349, activityName: 'My Game' });
 */
const setGlobals = (globals): void => {
  Object.entries(globals).forEach(([key, value]) => {
    window[key] = value;
  });
};

export default setGlobals;
