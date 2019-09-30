/**
 * Determines if a location (e.g. click, mouse move) is on a target (e.g. sprite)
 */
const isPointOnTarget = (event, target) => {
  const rect = target.getBoundingBoxToWorld();
  const point = event.getLocation();
  return cc.rectContainsPoint(rect, point);
};

export default isPointOnTarget;
