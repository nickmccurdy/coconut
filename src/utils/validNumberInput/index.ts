// Allows only numbers to be typed by the user. Will not update the text input otherwise.
const validNumberInput = (string: string) => (
  string.split('').reduce((accumulator: string, character: string) => {
    const convertedNumber = +character;
    const isNotSpace = character !== ' ';
    const canConvertToNumber = typeof convertedNumber === 'number' && !Number.isNaN(convertedNumber);
    const isValid = isNotSpace && canConvertToNumber;
    const validString = isValid ? `${accumulator}${character}` : accumulator;
    return validString.trim();
  }, '')
);

export default validNumberInput;
