import { isArray } from 'lodash';

/**
 * Adds one or more children to a parent.
 *
 * @param {object} parent The scene, layer, or node.
 * @param  {...(object|array)} children The child, or an array of the child, zOrder, and tag.
 * @return {undefined}
 * @example
 *
 * addChildren(this, child);
 *
 * addChildren(this, [child, 2, 'someChild`'], child, child, child, [child, 1, 'someOtherChild`']);
 */
const addChildren = (parent, ...children) => {
  children.forEach((item) => {
    if (isArray(item)) parent.addChild(...item);
    else parent.addChild(item);
  });
};

export default addChildren;
