import Prando from 'prando';
import log from '../log';

import getParameterByName from '../getParameterByName';

/**
 * Returns a pseudorandom number generator, created with Prando, using the `p2` query option (set in
 * the url) as the seed.
 *
 * @see {@link https://en.wikipedia.org/wiki/Pseudorandom_number_generator|Wikipedia Explanation}
 * @see {@link https://github.com/zeh/prando|Prando}
 *
 * @example
 *
 * // Given URL of http://127.0.0.1:8000/?p2=123, this will return Prando instance using seed 123.
 * createPseudorandomNumberGenerator();
 */
const createPseudorandomNumberGenerator = () => {
  let seed = getParameterByName('param2') || getParameterByName('p2');
  if (!seed || seed === '0') seed = `${Date.now()}`;
  log('Seed: ', seed);
  return new Prando(seed);
};

export default createPseudorandomNumberGenerator;
