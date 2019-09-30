/*
  * TODO: Waiting on TypeScript ranges feature to accurately type acceptable numbers for color,
  * opacity, anchor, etc.
  *
  * TODO: node/scene/layer/label typings for cc (cocos)
  */

// TODO:
import { primaryFont } from '../../lib/constants';
import {
  textAlignment,
  setBaseTextStyles,
  setLabel,
  setStrokeTextStyles,
  addLabel,
} from './helpers';

/**
 * Creates a Cocos label
 *
 * @param parent Parent node (scene/layer/sprite) that the label should be added to.
 * @param options Options object.
 * @param options.text Text that the label will display.
 * @param options.opacity Opacity of the displayed text.
 * @param options.fontName Font of the displayed text.
 * @param options.fontSize Font size of the displayed text.
 * @param options.dimensions Maximum size of the label, forcing new lines when necessary.
 * @param options.horizontalAlign Horizontal alignment of the displayed text.
 * @param options.verticalAlign Vertical alignment of the displayed text.
 * @param options.fontWeight Font weight of the displayed text.
 * @param options.fontStyle Font style of the displayed text.
 * @param options.position Position (relative to `parent`) that the label `anchor` is placed at.
 * @param options.color Color of the displayed text.
 * @param options.strokeColor Stroke color of the displayed text. Requires a `strokeSize` greater
 * than 0.
 * @param options.strokeSize Stroke size of the displayed text.
 * @param options.anchor Anchor point of the label, to be used by `position`. @see {@link https://docs.cocos2d-x.org/cocos2d-x/en/basic_concepts/sprites.html|Cocos2d-x Sprites}
 *
 * @example
 *
 * const text = createLabel(MyGameLayer, {
 *   text: 'Title of Game',
 *   color: [255, 255, 255],
 *   fontSize: 22,
 *   position: [0, 0],
 * });
 *
 * @example
 *
 * this.text = createLabel(this, {
 *   text: 'Some paragraph text here.',
 *   fontWeight: 700,
 *   opacity: 100,
 * });
 */
const createLabel = ({
  parent = null,
  text = '',
  opacity = 255,
  fontName = primaryFont,
  fontSize = 16,
  dimensions = [0, 0] as Point,
  horizontalAlign = 'left' as HorizontalAlignment,
  verticalAlign = 'top' as VerticalAlignment,
  fontWeight = 400,
  fontStyle = 'normal' as FontStyle,
  position = [250, 250] as Point,
  color = [0, 0, 0] as Color,
  strokeColor = [255, 0, 0] as Color,
  strokeSize = 0,
  anchor = [0.5, 0.5] as Point,
  zOrder = 0,
} = {}) => {
  const label = new cc.LabelTTF(
    text,
    fontName,
    fontSize,
    cc.size(...dimensions),
    textAlignment(false, horizontalAlign),
    textAlignment(true, verticalAlign),
  );

  setBaseTextStyles(label, fontWeight, fontStyle, color, opacity);
  setStrokeTextStyles(label, strokeSize, strokeColor);
  setLabel(label, anchor, position);
  addLabel(label, parent, zOrder);

  return label;
};

export default createLabel;
