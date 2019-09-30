import createLabel from '../../../utils/createLabel';
import createRect from '../../../utils/createRect';
import { containsSuperScript } from '../MultiLabel/helpers/superSubScripts';

class Fraction extends cc.Node {
  constructor({
    whole = '',
    numerator = '',
    denominator = '',
    fontSize = 12,
    color = [0, 0, 0],
  } = {}) {
    super();
    const wholeNumberOffset = 5;
    let adjustedFontSize = fontSize;

    const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
    let width = 0;
    let height = 0;

    const updateContentSize = (changeWidthBy, changeHeightBy) => {
      width += changeWidthBy;
      height = changeHeightBy;

      this.setContentSize(width, height);
    };

    const addNumberLabel = (text, position) => createLabel(this, {
      text,
      color,
      position,
      adjustedFontSize,
      anchor: [0, 0],
      verticalAlign: containsSuperScript(text) ? 'bottom' : 'top',
    });

    const setWholeNumber = () => addNumberLabel(whole, [0, 0]);

    const setNumerator = pipeObject => {
      const {
        width: pipeObjectWidth,
        height: pipeObjectHeight,
        x,
      } = pipeObject.getBoundingBox();

      const yPosition = pipeObjectHeight / 2;
      const xPosition = x + pipeObjectWidth + wholeNumberOffset;

      if (whole !== '') adjustedFontSize *= 0.85;

      return addNumberLabel(numerator, [xPosition, yPosition]);
    };

    const setDenominator = pipeObject => {
      const {
        x,
        y,
        height: pipeObjectHeight,
      } = pipeObject.getBoundingBox();
      const yPosition = (y - pipeObjectHeight) + (pipeObjectHeight * 0.35) - 8;
      const denominatorLabel = addNumberLabel(denominator, [x, yPosition]);

      return {
        numeratorLabel: pipeObject,
        denominatorLabel,
      };
    };

    const repositionX = pipeObject => {
      const { numeratorLabel, denominatorLabel } = pipeObject;
      const numeratorWidth = numeratorLabel.getBoundingBox().width;
      const denominatorWidth = denominatorLabel.getBoundingBox().width;

      let to = numeratorWidth;
      let from = numeratorLabel.x;

      if (denominatorWidth > numeratorWidth) {
        to = denominatorWidth;
        from = denominatorLabel.x;
        const changeInNumeratorXPosition = (denominatorWidth - numeratorWidth) / 2;
        numeratorLabel.setPositionX(numeratorLabel.getBoundingBox().x + changeInNumeratorXPosition);
      } else if (numeratorWidth > denominatorWidth) {
        const changeInDenominatorXPosition = (numeratorWidth - denominatorWidth) / 2;
        denominatorLabel.setPositionX(
          numeratorLabel.getBoundingBox().x + changeInDenominatorXPosition,
        );
      }

      return {
        to,
        from,
        numeratorLabel,
        denominatorLabel,
      };
    };

    const drawFractionBar = ({
      to,
      from,
      numeratorLabel,
      denominatorLabel,
    }) => {
      const {
        y,
        height: pipeObjectHeight,
      } = numeratorLabel.getBoundingBox();
      const yPosition = y + (pipeObjectHeight * 0.35) - 5;
      createRect(this, {
        position: [from, yPosition],
        size: [to, fontSize / 20],
        color,
      });

      return {
        to,
        from,
        numeratorLabel,
        denominatorLabel,
      };
    };

    const recalculateSizePositionX = ({
      to,
      from,
      numeratorLabel,
      denominatorLabel,
    }) => {
      const offsetFrom = whole === '' ? -(wholeNumberOffset + 0.5) : 0;
      const actualWidth = from + to + offsetFrom;
      const { height: numeratorHeight } = numeratorLabel.getBoundingBox();
      const { height: denominatorHeight } = denominatorLabel.getBoundingBox();
      const actualHeight = (denominatorHeight * 0.65) + (numeratorHeight * 0.65) + 4;

      updateContentSize(actualWidth, actualHeight);

      if (offsetFrom !== 0) {
        const changeInX = Math.abs(0 - from);
        this.getChildren()
          .forEach(child => child.setPositionX(child.getBoundingBox().x - changeInX));
      }
      return { actualHeight, numeratorLabel };
    };

    const repositionY = pipeObject => {
      const { y, height: pipeObjectHeight } = pipeObject.numeratorLabel.getBoundingBox();
      const changeInY = pipeObject.actualHeight - Math.abs(0 - y - pipeObjectHeight);
      this.getChildren().forEach(child => child.setPositionY(child.getBoundingBox().y + changeInY));
    };

    (() => {
      pipe(
        setWholeNumber,
        setNumerator,
        setDenominator,
        repositionX,
        drawFractionBar,
        recalculateSizePositionX,
        repositionY,
      )();
    })();
  }
}

export default Fraction;
