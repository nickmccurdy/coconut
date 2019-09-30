const calculations = touch => {
  // eslint-disable-next-line no-underscore-dangle
  const startPoint = touch._startPoint;

  // eslint-disable-next-line no-underscore-dangle
  const endPoint = touch._point;

  const deltaX = endPoint.x - startPoint.x;
  const deltaY = endPoint.y - startPoint.y;

  return {
    deltaX,
    deltaY,
    absX: Math.abs(deltaX),
    absY: Math.abs(deltaY),
  };
};

const isFlick = (startTouchTime, absX, absY) => {
  const time = Date.now() - startTouchTime;
  const velocity = Math.sqrt((absX * absX) + (absY * absY)) / time;
  return velocity > 0.5;
};

const isUpDown = (absX, absY, distanceFactor, angleFactor) => (
  (absY > distanceFactor) && (absY > (absX / angleFactor))
);

const isLeftRight = (absX, absY, distanceFactor, angleFactor) => (
  (absX > distanceFactor) && (absX > (absY / angleFactor))
);

// NOTE: Invoke function factory on touch began event.
const createSwipeDetector = () => {
  const startTouchTime = Date.now();

  // NOTE: Invoke closure on touch end event.
  return touch => {
    const {
      deltaX, deltaY, absX, absY,
    } = calculations(touch);

    let up = false;
    let down = false;
    let left = false;
    let right = false;

    if (isFlick(startTouchTime, absX, absY)) {
      const angleFactor = 5;
      const distanceFactor = 40;

      if (isUpDown(absX, absY, distanceFactor, angleFactor)) {
        if (deltaY > 0) up = true;
        else down = true;
      } else if (isLeftRight(absX, absY, distanceFactor, angleFactor)) {
        if (deltaX > 0) right = true;
        else left = true;
      }
    }

    return {
      up,
      down,
      left,
      right,
    };
  };
};

export default createSwipeDetector;
