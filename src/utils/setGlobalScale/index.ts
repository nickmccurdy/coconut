const setGlobalScale = (...sprites) => {
  sprites.forEach(sprite => sprite.setScale(window.g_scaleRatio, window.g_scaleRatio));
};

export default setGlobalScale;
