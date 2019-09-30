import Prando from 'prando';

import {
  itemExists,
  populateArray,
  prandoDigits,
  createPrandoDistributor,
  createPrandoIntGenerator,
  prandoShuffle,
} from '..';

const seed = 'Test_Seed';

describe('itemExists function', () => {
  it('should return true when the given item is included in the given array', () => {
    const exists = itemExists([1], 1);
    expect(exists).toMatchSnapshot();
  });

  it('should return false when the given item is not included in the given array', () => {
    const exists = itemExists([1], 2);
    expect(exists).toMatchSnapshot();
  });
});

// closure to mimic item-generation fn in a predictable manner that can pass unit tests
// because of predictability, length should be <= amount of unique numbers in nonUniqueArray
const createGenerateItemFn = () => {
  let i = -1;
  const nonUniqueArray = [2, 2, 2, 2, 845678, 3, 2, 3, 5, 5, 8, 9, 1, 733, 938];
  return () => {
    i += 1;
    return nonUniqueArray[i];
  };
};

const isDuplicate = (array, item) => array.includes(item);

describe('populateArray function', () => {
  it('should return a non-unique, populated array with the correct length when a isDuplicate callback is not provided', () => {
    const length = 3;
    const generateItem = createGenerateItemFn();
    expect(populateArray(length, generateItem)).toMatchSnapshot();
  });

  it('should return a unique, populated array with the correct length when a isDuplicate callback is provided', () => {
    const length = 6;
    const generateItem = createGenerateItemFn();
    expect(populateArray(length, generateItem, isDuplicate)).toMatchSnapshot();
  });
});

describe('createPrandoIntGenerator function', () => {
  const rng = new Prando(seed);
  const getInt = createPrandoIntGenerator(rng, [0, 9]);

  it('should return a callback function', () => {
    expect(typeof getInt).toMatchSnapshot();
  });

  it('should create a callback that returns proportionally distributed integers, and does so repeatedly', () => {
    const distributedIntegers1 = new Array(10)
      .fill(null)
      .reduce(accumulator => [...accumulator, getInt()], []);

    const distributedIntegers2 = new Array(10)
      .fill(null)
      .reduce(accumulator => [...accumulator, getInt()], []);

    expect(distributedIntegers1).toMatchSnapshot();
    expect(distributedIntegers2).toMatchSnapshot();
  });
});

describe('prandoShuffle function', () => {
  it('should return a new shuffled array using items from the given array', () => {
    expect(prandoShuffle(new Prando(seed), [3, 77, 939, 3])).toMatchSnapshot();
  });
});

describe('prandoDigits function', () => {
  const rng = new Prando(seed);

  it('should return an array of deterministically random digits, with the given length', () => {
    const digits = prandoDigits(rng, 8);
    expect(digits.length).toMatchSnapshot();
  });

  it('should return a unique array of deterministically random digits, including zeros, when passed both options', () => {
    const digits = prandoDigits(rng, 10, { unique: true, zeros: true });
    expect(digits).toMatchSnapshot();
  });

  it('should return an array of deterministically random digits with the given range', () => {
    const digits = prandoDigits(rng, 3, { unique: true, start: 1, end: 3 });
    expect(digits).toMatchSnapshot();
  });
});

describe('createPrandoDistributor function', () => {
  const rng = new Prando(seed);
  const types = [[1, 10], [2, 20], [3, 30], [4, 40]];
  const getType = createPrandoDistributor(rng, 10, types);

  it('should return a callback function', () => {
    expect(typeof getType).toMatchSnapshot();
  });

  it('should create a callback that returns a deterministically shuffled, proportionally distributed type', () => {
    const distributedTypes = new Array(10)
      .fill(null)
      .reduce((accumulator, _item, i) => [...accumulator, getType(i)], []);

    expect(distributedTypes).toMatchSnapshot();
  });

  it('should create a callback that returns the same type when passed in a duplicate index', () => {
    const getType2 = createPrandoDistributor(rng, 10, types);
    const type1 = getType2(1);
    const type2 = getType2(1);
    const isSameType = type1 === type2;
    expect(isSameType).toMatchSnapshot();
  });
});
