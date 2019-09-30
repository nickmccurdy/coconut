/**
 * Creates a rectangle, great for debugging (i.e. getting a visual guide when positioning nodes),
 * and for creating custom click areas (using an invisible background color via the color option).
 */
const createRect = (
  {
    parent = null,
    position = [0, 0],
    size = [100, 100],
    color = [0, 0, 0, 100],
    lineWidth = 0,
    lineColor = [255, 255, 255, 100],
  } = {},
) => {
  const rect = new cc.DrawNode();
  const contentSize = cc.size(...size);
  const to = cc.p(...size);

  // Keep from at 0, making it easy to calculate size. Use setPosition to move rect.
  const from = cc.p(0, 0);

  // Required for getBoundingBoxToWorld() to return the correct size of rect.
  rect.setContentSize(contentSize);

  rect.drawRect(from, to, cc.color(...color), lineWidth, cc.color(...lineColor));
  rect.setPosition(...position);
  if (parent) parent.addChild(rect);
  return rect;
};

export default createRect;
