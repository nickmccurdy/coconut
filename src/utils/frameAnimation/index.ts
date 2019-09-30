import { isPlainObject } from 'lodash';

import getCachedFrame from '../getCachedFrame';

/**
 * Formats the file number to include preceding zeros
 */
const fileNumber = (number, placeCount) => {
  const additionalZeroCount = placeCount - `${number}`.length;
  if (additionalZeroCount > 0) {
    const zeros = new Array(additionalZeroCount).fill(0).join('');
    return `${zeros}${number}`;
  }
  return number;
};

/**
 * Creates a cc.Animation object which can be used as an argument to a cc.Animate action.
 *
 * Keep in mind, although this helper includes many convenience options, optimally, all sprites
 * should have the same static path, be in a sequential order starting with 1, and not skip any
 * frame numbers in between — providing for a cleaner codebase overall.
 *
 * An array including information about the sprites being animated is required. Optionally, you can
 * pass multiple frame set arrays, each as separate arguments. This can be useful when an animation
 * includes sprites that are spread across multiple paths. This array/arrays can be passed
 * starting with either the first or second argument. Each array includes:
 *   - last file number of frame set (not including preceding zeros)
 *   - static portion of file path, up to, but not including the file number and extension
 *   - place count of the file number (optional, defaults to 3) (example: 001 has place count of 3)
 *   - starting file number of frame set (optional, defaults to 1)
 *   - file numbers that are missing and should be skipped (optional)
 *
 * An optional options object that controls the animation can be passed as the first argument,
 * containing a custom `delay` and/or `loops` property, which are then passed to the cc.Animation
 * object.
 *
 * Examples:
 *
 * const basicAnimation = frameAnimation([8, 'path-to-file']);
 *
 * const customAnimation = frameAnimation(
 *   { delay: 4, loops: 2 },
 *   [8, 'path-to-file'],
 *   [44, 'path-to-file', 5, 4, [102, 55, 87]],
 *   [23, 'path-to-file'],
 * );
 *
 * TODO: We could require that frameNumEnd include the preceding zeros and then automatically grab
 * fileNumPlaceCount, but this would be a breaking change.
 */

const frameAnimation = (
  firstArgument: { delay?: number; loops?: number } | [number, string],
  ...rest: [number, string]
) => {
  const optionsSupplied = isPlainObject(firstArgument);
  const customSettings = optionsSupplied ? firstArgument : {};
  const { delay, loops } = { delay: 0.111, loops: 1, ...customSettings };
  const frameSets = optionsSupplied ? rest : [firstArgument, ...rest];

  const frames = frameSets.reduce(
    (
      accumulator,
      [
        frameNumberEnd,
        staticFilePath,
        fileNumberPlaceCount = 3,
        frameNumberStart = 1,
        skippedFrameNumbers = [],
      ],
    ) => {
      for (let i = frameNumberStart; i <= frameNumberEnd; i += 1) {
        if (!skippedFrameNumbers.includes(i)) {
          const filename = `${staticFilePath}${fileNumber(i, fileNumberPlaceCount)}.png`;
          accumulator.push(getCachedFrame(filename));
        }
      }

      return accumulator;
    },
    [],
  );

  return new cc.Animation(frames, delay, loops);
};

export default frameAnimation;
