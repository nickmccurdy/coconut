const log = (...arguments_) => {
  // eslint-disable-next-line no-console
  if (window.DEBUG) console.log(...arguments_);
};

export default log;
