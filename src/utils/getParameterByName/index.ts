/**
  * Returns the value of a query key that's set in the url.
  *
  * @param name The query name/key to check.
  * @param url The url to extract the query option from.
  *
  * @example
  *
  * // Returns the value of the actid key (that is, 5111).
  * getParameterByName('actid', 'http://127.0.0.1:8000/?actid=5111');
  */
const getParameterByName = (name, url = window.location.href) => {
  const formattedName = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${formattedName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export default getParameterByName;
