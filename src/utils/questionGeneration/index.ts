import { range } from 'lodash';

export const itemExists = (array, item) => array.includes(item);

export const populateArray = (length, generateItem, unique = false) => {
  const isDuplicate = typeof unique === 'function' ? unique : itemExists;
  return new Array(length).fill(null).reduce((accumulator, _currentItem, index) => {
    let newItem = generateItem(index);
    if (unique) while (isDuplicate(accumulator, newItem)) newItem = generateItem(index);
    return [...accumulator, newItem];
  }, []);
};

export const createPrandoIntGenerator = (rng, rangeArray) => {
  const prandoRange = range(rangeArray[0], rangeArray[1] + 1);
  let currentRange = prandoRange.slice();

  return () => {
    const rangeIndex = rng.nextInt(0, currentRange.length - 1);
    const resultIndex = currentRange[rangeIndex];
    currentRange.splice(rangeIndex, 1);
    if (currentRange.length === 0) currentRange = prandoRange.slice();
    return resultIndex;
  };
};

/**
 * Returns an array of shuffled values using a deterministic, pseudo-random method.
 *
 * @param {object} rng A Prando instance (https://www.npmjs.com/package/prando)
 * @param {array} array The array to shuffle
 * @param {boolean} allElementsUnidentifiable Whether or not each element of the returned array
 * should be unique when compared to the element of the same index from the passed in array. Note
 * that an infinite loop will occur if this value is true and the original array does not have
 * enough unique elements to make this possible (e.g. array has only one element, or the same value
 * exists in more than half of the array's elements).
 *
 * TODO: There are some edge cases that would need to be handled, but we should just throw an error
 * when it's determined that an infinite loop will be created by the allElementsShuffled option.
 */
export const prandoShuffle = (rng, array, allElementsUnidentifiable = false) => {
  const getIndex = createPrandoIntGenerator(rng, [0, array.length - 1]);
  const createArray = () => new Array(array.length).fill(null).reduce((accumulator) => (
    [...accumulator, array[getIndex()]]
  ), []);

  let newArray = createArray();

  if (allElementsUnidentifiable) {
    const isUnique = () => newArray.some((item, i) => item !== array[i]);
    while (!isUnique()) newArray = createArray();
  }

  return newArray;
};

export const prandoDigits = (rng, length, {
  unique = false,
  zeros = false,
  start,
  end,
} = {}) => {
  const numberDigits = typeof length === 'number' ? length : rng.nextInt(length[0], length[1]);
  const generateDigit = dynamicStart => rng.nextInt(start || dynamicStart, end || 9);
  const digitGenerator = () => generateDigit(1);
  const digitGeneratorWithNonLeadingZeros = i => (i === 0 ? generateDigit(1) : generateDigit(0));
  const generateItem = zeros ? digitGeneratorWithNonLeadingZeros : digitGenerator;
  return populateArray(numberDigits, generateItem, unique);
};

export const createPrandoDistributor = (rng, totalCount, typesArray) => {
  const types = typesArray.map(([name, percentage]) => ({ name, percentage, count: 0 }));
  let lastIndex = null;
  let lastTypeName = null;

  return (iterationIndex) => {
    const wasDuplicateQuestion = iterationIndex === lastIndex;
    if (wasDuplicateQuestion) return lastTypeName;

    const index = rng.nextInt(0, types.length - 1);
    const type = types[index];

    type.count += 1;
    lastIndex = iterationIndex;
    lastTypeName = type.name;

    const typeDistribution = (type.count * 100) / totalCount;
    const typeFullyDistributed = typeDistribution >= type.percentage;
    if (typeFullyDistributed) types.splice(index, 1);

    return type.name;
  };
};
