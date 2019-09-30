/**
 * Helper for action objects that act as a replacement for switch statements. Will use the passed in
 * key if it exists, otherwise will use `obj.default`. Will return the value of the property unless
 * the key is a function, in which case it will return the return value of that function.
 *
 * @param object The action object.
 * @param key Key to check on the action obj.
 * @param shouldGetFunctionReturn Should validValue invoke the valid property if the property is a
 * function? If set to true, will return that function's value, as opposed to the function itself.
 *
 * @example
 *
 * const actionObject = {
 *   key1: 1,
 *   default: 0,
 * };
 *
 * const value = validValue(actionObject, 'key1'); // -> 1
 * const value2 = validValue(actionObject, 'key2'); // -> 0
 */
const validValue = (object, key, shouldGetFunctionReturn = true) => {
  if (typeof object.default === 'undefined') {
    throw new TypeError(`Action objects passed to ${validValue.name} must have a default property.`);
  }

  const value = object[key];
  const validKey = value || object.default;
  const isPropertyFunction = typeof validKey === 'function';
  const shouldInvokeFunction = isPropertyFunction && shouldGetFunctionReturn;
  return shouldInvokeFunction ? validKey() : validKey;
};

export default validValue;
