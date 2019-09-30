import { range } from 'lodash';
import createLabel from '../createLabel';
import { primaryFont } from '../../lib/constants';

/*
 * TODO: Underline, background colors, placeholders (fill in blank), vertical text
 * alignment, events for dynamic updates(e.g.highlight on click).
 *
 * NOTE: A space followed by an underscore will create a new line. Therefore this node does not
 * support words that start with a leading underscore (you'd end up with a new line every time one
 * of those words appear).
 *
 * NOTE: This is an experimental node, with the goal of potentially deprecating the MultiLabel node.
*/

/**
 * Helper for creating complex labels. Use cases include multiline text, styled text (highlights,
 * bold, underline, etc.), letter spacing, word spacing, line height, and dynamic updates (e.g.
 * fill in blank, click word to highlight, etc.).
 *
 * Note that span elements can not be nested. In other words, if a word in between styled text needs
 * an additional style, the previous style element must be closed, a new style element must be
 * created, and then the previous style can be continued again via another style element.
 *
 * @param {object} options
 * @param {object} options.parent Parent node/layer/scene that paragraph should be added to.
 * @param {array} options.containerDimensions The width and height that paragraph should be
 * constrained to (used for vertical and horizontal alignment and automatically creating new lines).
 * @param {array} options.position Position (relative to the parent) that paragraph should be placed
 * at.
 * @param {array} options.wordSpacing Spacing between words.
 * at.
 * @param {array} options.letterSpacing Spacing between characters.
 * at.
 * @param {number} options.lineHeight Spacing between new lines.
 * @param {string} options.text The initial text to be added when creating the paragraph.
 * @param {number} options.opacity Opacity of the initial text.
 * @param {number} options.fontSize Font size of the initial text.
 * @param {array} options.fontColorPrimary Font color of the initial text.
 */
class Paragraph extends cc.Node {
  constructor({
    parent = null,
    text = '',
    containerDimensions = [200, 100],
    position = [0, 0],
    anchor = [0.5, 0.5],
    fontSize = 16,
    fontWeight = 400,
    fontStyle = 'normal',
    fontName = primaryFont,
    wordSpacing = 1,
    letterSpacing = 1,
    opacity = 255,
    fontColorPrimary = [0, 0, 0],
    lineHeight = 1.2,
  }) {
    super();
    this.fontColorPrimary = fontColorPrimary;
    this.opacity = opacity;
    this.wordSpacing = wordSpacing;
    this.letterSpacing = letterSpacing;
    this.fontWeight = fontWeight;
    this.fontStyle = fontStyle;
    this.fontSize = fontSize;
    this.fontName = fontName;
    this.lineHeight = lineHeight;
    this.containerDimensions = containerDimensions;
    this.setInitialState();
    this.setup(parent, position, anchor, text);
  }

  setup(parent, position, anchor, text) {
    parent.addChild(this);

    this.setPosition(...position);
    this.setAnchorPoint(...anchor);

    if (text !== '') this.setString(text);
  }

  setString(text) {
    this.formattedText = text;
    this.render();
  }

  setInitialState() {
    this.parsedText = '';
    this.formattedSubstrings = [];
    this.paragraphLabels = [];
    this.charLabels = [];
    this.currentWordNode = new cc.Node();
    this.lineWidth = 0;
  }

  removeLabels() {
    this.paragraphLabels.forEach(label => label.removeFromParent());
  }

  nextCharLabelPos() {
    const lastLabel = this.charLabels[this.charLabels.length - 1];
    let position = [0, 0];

    if (lastLabel) {
      const { x, width, y } = lastLabel.getBoundingBoxToWorld();
      const xPos = x + width * this.letterSpacing;
      position = [xPos, y];
    }

    return position;
  }

  nextWordLabelPos() {
    const lastLabel = this.paragraphLabels[this.paragraphLabels.length - 1];
    let position = [0, 0];

    if (lastLabel) {
      const { width: nodeWidth } = this.currentWordNode.getBoundingBoxToWorld();
      const potentialWidth = this.lineWidth + nodeWidth;

      if (potentialWidth > this.containerDimensions[0] || this.shouldLineBreak) {
        const { height, y } = lastLabel.getBoundingBoxToWorld();
        position = [0, y - height * this.lineHeight];
        this.lineWidth = 0;
        this.shouldLineBreak = false;
      } else {
        const { x, width, y } = lastLabel.getBoundingBoxToWorld();
        const xPos = x + width * this.wordSpacing;
        position = [xPos, y];
        this.lineWidth += nodeWidth;
      }
    }

    return position;
  }

  addLabelToWordNode(
    text,
    {
      color = this.fontColorPrimary,
      fontSize = this.fontSize,
      opacity = this.opacity,
      fontWeight = this.fontWeight,
      fontStyle = this.fontStyle,
      fontName = this.fontName,
    } = {},
  ) {
    const label = createLabel(this.currentWordNode, {
      text,
      color,
      opacity,
      fontSize,
      fontWeight,
      fontStyle,
      fontName,
      anchor: [0, 0],
      position: this.nextCharLabelPos(),
    });

    this.charLabels.push(label);
  }

  addWordNode() {
    const position = this.nextWordLabelPos();
    this.currentWordNode.setPosition(...position);
    this.addChild(this.currentWordNode);
    this.currentWordNode = new cc.Node();
    this.charLabels.forEach(charLabel => this.paragraphLabels.push(charLabel));
    this.charLabels = [];
  }

  addLabel(char, isLastChar, settings) {
    if (char === '_') {
      this.shouldLineBreak = true;
    } else {
      this.addLabelToWordNode(char, settings);
      if (isLastChar || char === ' ') this.addWordNode();
    }
  }

  // Get clean paragraph text without span element wrappers.
  parseText() {
    // Find all span elements and capture the json settings object and text to be formatted.
    const spanRegex = /<span\s(.*?)>(.*?)<\/span>/g;

    let tagLengthTotal = 0;
    let previousLastIndex = 0;
    let results;

    // TODO: Update with `matchAll`.
    // Operate on all span elements until no more are found.
    // eslint solution coming soon: https://github.com/airbnb/javascript/issues/1439
    // eslint-disable-next-line no-cond-assign
    while ((results = spanRegex.exec(this.formattedText)) !== null) {
      // Match and capturing groups from regex expression
      const [match, jsonSettings, spanText] = results;

      // Turn settings string into an object we can work with.
      const settings = JSON.parse(jsonSettings);

      const startingIndex = results.index - tagLengthTotal;
      const endIndex = results.index - tagLengthTotal + spanText.length;
      const indexRange = [startingIndex, endIndex];
      const textBetweenSpans = this.formattedText.slice(previousLastIndex, results.index);

      tagLengthTotal += match.length - spanText.length;

      this.parsedText += `${textBetweenSpans}${spanText}`;

      // Save settings along with location in the parsed text that they apply to.
      this.formattedSubstrings.push({ settings, indexRange });

      previousLastIndex = spanRegex.lastIndex;
    }

    const textAfterAllSpanMatches = this.formattedText.slice(previousLastIndex);
    this.parsedText += textAfterAllSpanMatches;
  }

  addLabels() {
    let currentIndex = 0;
    const parsedTextChars = this.parsedText.split('');

    // Create a label for every character, allowing for precision formatting.
    parsedTextChars.forEach((char, i) => {
      const isLastChar = i === parsedTextChars.length - 1;
      const index = this.parsedText.indexOf(char, currentIndex);

      // Find any formatting settings that belong to this character.
      const formattedSubstring = this.formattedSubstrings.find(format => {
        const [start, end] = format.indexRange;
        return range(start, end).includes(index);
      }) || {};

      this.addLabel(char, isLastChar, formattedSubstring.settings);

      currentIndex += char.length;
    });
  }

  // Invoked every time the text is dynamically changed, updating positional calculations (e.g. a
  // long word replaces a placeholder and causes line width to exceed container width, requiring a
  // new line to be added).
  render() {
    this.removeLabels();
    this.setInitialState();
    this.parseText();
    this.addLabels();
  }
}

export default Paragraph;
