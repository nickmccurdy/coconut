/**
 * NOTE: Howler bug #2 (v 2.0.12). On all browsers, if html5 is true, and if onend event is fired,
 * then onstop also fires. If html5 is false, then the expected behavior is executed (i.e. onend
 * only fires when audio reaches end, and onstop only fires when stop() is invoked).
 *
 * NOTE: Howler bug #3 (v 2.0.12). In rare cases (Windows version? device hardware?), bad
 * performance on IE11.
 *
 * NOTE: iOS Safari has limits on audio played inside of setTimeout callbacks.
 *
 * NOTE: Be mindful of forcing events inside of event handlers, otherwise unexpected results will
 * occur. An example of a previous bug: executing code inside of onend() handler that eventually
 * invokes stop() on that same audio, causing the onstop() handler to also execute. These bugs, when
 * combined with any Howler bugs (see bug #2 above), can create a tangled web of issues.
 */

import { Howl } from 'howler';

let queue = [];
let effectQueue = [];
let currentAudio = null;
let lastEndedId = null;
let backgroundAudio = null;

export const stopCurrentAudio = clearQueue => {
  if (clearQueue) queue = [];

  if (currentAudio) {
    currentAudio.stop();
    currentAudio = null;
  }
};

const playNext = () => {
  if (queue.length > 0) {
    currentAudio = queue.shift();
    currentAudio.play();
  }
};

/**
 * Places audio in queue. Plays immediately if queue is empty. No option to loop.
 *
 * Note that onend and onstop are two mutually exclusive events. Use onDone for callback that should
 * execute regardless of whether the audio ends or is manually stopped.
 */
export const queueAudio = (source, {
  onPlay, onEnd, onStop, onDone,
} = {}) => {
  queue.push(new Howl({
    src: [source],
    onplay: onPlay,
    onend(id) {
      if (onEnd) onEnd();
      if (onDone) onDone();
      lastEndedId = id;
      currentAudio = null;
      playNext();
    },
    onstop(id) {
      const didPseudoStop = lastEndedId === id; // (See bug #2 above)

      if (!didPseudoStop) {
        if (onStop) onStop();
        if (onDone) onDone();
      }
    },
  }));

  if (!currentAudio) playNext();
};

/**
 * Returns a new Howl. Will not be stopped by `stopCurrentAudio()`. Can play audio immediately by
 * leaving autoPlay as default. However, for performance reasons (especially on IE, where a new
 * HTML audio element is created with each new Howl), if the audio is played inside a function that
 * is called more than once, you probably want to create the Howl and then reuse it, calling play()
 * on it when needed.
 *
 * @example
 *
 * playEffect('res/assets/audio/some-audio-path.mp3');
 *
 * const sound = playEffect('res/assets/audio/some-audio-path.mp3', { autoplay: false });
 * sound.play();
 */
export const playEffect = (source, {
  volume,
  onPlay = () => {},
  onEnd = () => {},
  loop,
  autoplay = true,
} = {}) => {
  const effect = new Howl({
    volume,
    loop,
    onplay: () => {
      onPlay();
      effectQueue = effectQueue.filter(audio => audio !== effect);
      effectQueue.push(effect);
    },
    onend: () => {
      onEnd();
      effectQueue = effectQueue.filter(audio => audio !== effect);
    },
    onstop: () => {
      effectQueue = effectQueue.filter(audio => audio !== effect);
    },
    src: [source],
    autoplay,
  });
  return effect;
};

/**
 * Play looped audio immediately, usually with lower volume desired.
 */
export const playBackgroundAudio = (source, volume = 0.8) => {
  backgroundAudio = playEffect(source, { volume, loop: true });
};

/**
 * Stop the background audio.
 */
export const stopBackgroundAudio = () => {
  if (backgroundAudio) {
    backgroundAudio.stop();
    backgroundAudio = null;
  }
};

(() => {
  window.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (currentAudio) currentAudio.pause();
      effectQueue.forEach(audio => {
        if (audio.playing()) audio.pause();
      });
    } else {
      if (currentAudio) currentAudio.play();
      effectQueue.forEach(audio => audio.play());
    }
  });
})();
