const resourcePath = (resource, isImage) => {
  const shouldInitiateWithSprite = resource !== null && !isImage;
  return shouldInitiateWithSprite ? `#${resource}` : resource;
};

const setAnchorPoint = (sprite, aligned, anchor) => {
  const anchorPoints = aligned ? [0, 1] : anchor;
  sprite.setAnchorPoint(...anchorPoints);
};

const setPosition = (sprite, aligned, position) => {
  const positions = aligned ? [0, 720] : position;
  sprite.setPosition(...positions);
};

/**
 * Creates a sprite with either an image (using isImage option) or a sprite frame.
 */
const createSprite = ({
  aligned = false,
  parent = null,
  resource = null,
  isImage = false,
  position = [300, 300],
  anchor = [0.5, 0.5],
  zOrder = 0,
  scale = [window.g_scaleRatio || 1, window.g_scaleRatio || 1],
} = {}) => {
  const sprite = new cc.Sprite(resourcePath(resource, isImage));
  if (parent) parent.addChild(sprite, zOrder);
  setAnchorPoint(sprite, aligned, anchor);
  setPosition(sprite, aligned, position);
  sprite.setScale(...scale);
  return sprite;
};

export default createSprite;
