import log from '../log';

const onlyDebug = (func) => {
  if (window.DEBUG) {
    func();
    if (Object.keys(window.debugInfo).length > 0) log('Debug info: ', window.debugInfo);
  }
};

const ensureInfo = () => {
  onlyDebug(() => {
    if (!window.debugInfo) window.debugInfo = {};
  });
};

export const markDebugLoaded = () => {
  ensureInfo();
  onlyDebug(() => {
    window.debugInfo.loaded = true;
  });
};

export const updateDebugScore = (scoreArray) => {
  ensureInfo();
  onlyDebug(() => {
    window.debugInfo.score = scoreArray;
  });
};
