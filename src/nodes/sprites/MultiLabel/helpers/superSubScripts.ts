// NOTE: This file is similar to https://github.com/msn0/subsup, but that package produces
// minifcation errors and has not been updated in over a year.

const superscripts = {
  0: '⁰',
  1: '¹',
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
  7: '⁷',
  8: '⁸',
  9: '⁹',
  '+': '⁺',
  '-': '⁻',
  '=': '⁼',
  '(': '⁽',
  ')': '⁾',
  n: 'ⁿ',
  i: 'ⁱ',
};

const subscripts = {
  0: '₀',
  1: '₁',
  2: '₂',
  3: '₃',
  4: '₄',
  5: '₅',
  6: '₆',
  7: '₇',
  8: '₈',
  9: '₉',
  '+': '₊',
  '-': '₋',
  '=': '₌',
  '(': '₍',
  ')': '₎',
};

const parse = input => (`${input}`).split('');

const to = chart => input => chart[input];

export const sup = input => parse(input).map(to(superscripts)).join('');

export const sub = input => parse(input).map(to(subscripts)).join('');

export const containsSuperScript = input => Object.values(superscripts)
  .some(value => input.includes(value));
