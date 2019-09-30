const createDoubleTapDetector = () => {
  const validTimeBetweenClicks = 300;
  let previousClickTime = null;
  const isValidDoubleClick = (currentClickTime) => {
    if (!previousClickTime) return false;
    return currentClickTime - previousClickTime <= validTimeBetweenClicks;
  };

  return () => {
    const currentClickTime = Date.now();
    let isDoubleTap = false;
    if (isValidDoubleClick(currentClickTime)) isDoubleTap = true;
    previousClickTime = currentClickTime;
    return isDoubleTap;
  };
};

export default createDoubleTapDetector;
