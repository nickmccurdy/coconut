/*
 * TODO: node/scene/layer/label typings for cc (cocos)
 */

const cocosColor = (color: Color) => cc.color(...color);

export const textAlignment = (
  isVertical: boolean,
  position: VerticalAlignment | HorizontalAlignment,
) => {
  const prefix = isVertical ? 'VERTICAL_' : '';
  return cc[`${prefix}TEXT_ALIGNMENT_${position.toUpperCase()}`];
};

export const setBaseTextStyles = (
  label,
  fontWeight: number,
  fontStyle: FontStyle,
  color: Color,
  opacity: number,
) => {
  /**
   * Using "private" methods (_setFontWeight and _setFontStyle) from the Cocos API is the only
   * way to allow for both bold and dynamic color updates (enableStroke() and fontFillColor() will
   * both lock in the color).
   */

  // eslint-disable-next-line no-underscore-dangle
  label._setFontWeight(fontWeight);

  // eslint-disable-next-line no-underscore-dangle
  label._setFontStyle(fontStyle);

  label.setColor(cocosColor(color));
  label.setOpacity(opacity);
};

export const setLabel = (label, anchor: Point, position: Point) => {
  label.setAnchorPoint(...anchor);
  label.setPosition(...position);
};

export const setStrokeTextStyles = (label, strokeSize: number, strokeColor: Color) => {
  if (strokeSize > 0) label.enableStroke(cocosColor(strokeColor), strokeSize);
};

export const addLabel = (label, parent, zOrder) => {
  if (parent) parent.addChild(label, zOrder);
};
