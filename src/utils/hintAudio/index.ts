/**
 * Collection of helpers for setting and overriding multiple intervals that play repeatedly after
 * a set amount of time (great for hint audio files, with different hints active at different times
 * depending on the situation).
 */

let hintInterval = null;
let activeInterval = null;

const removeInterval = () => {
  if (hintInterval) {
    clearInterval(hintInterval);
    hintInterval = null;
  }
};

export const stopHintInterval = (gameIsOver = false) => {
  removeInterval();
  activeInterval = null;

  // clear any intervals that are set after game ends (because of timers)
  if (gameIsOver) setTimeout(removeInterval, 5000);
};

export const setHintInterval = (fn, playAudio, timer) => {
  stopHintInterval();
  hintInterval = setInterval(() => playAudio(), timer);
  activeInterval = fn;
};

export const resetHintInterval = () => {
  removeInterval();
  if (activeInterval) activeInterval();
};
