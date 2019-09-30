import is from 'is_js';
import validNumberInput from '../validNumberInput';
import log from '../log';

/**
 * Creates an input (EditBox)
 *
 * @param {object} parent The scene, layer, or node.
 * @param {function} onEditingDidBegin Callback to be invoked when input gains focus.
 * @param {function} onEditingDidEnd Callback to be invoked when input loses focus.
 * @param {function} onTextChanged Callback to be invoked when a key is pressed.
 * @param {function} onReturn Callback to be invoked when the return key is pressed.
 * @param {number} tabIndex Order of tabbing from one input to another.
 * @param {number[]} size Size of the edit box. Must be large enough for the font size given
 * otherwise input will not show up.
 * @param {number[]} fontColor Input font color.
 * @param {number[]} placeholderFontColor Placeholder font color.
 * @param {number[]} position Position of input, relative to parent.
 * @param {number} fontSize Input font size.
 * @param {number} maxLength Maximum character length allowed.
 * @param {string} placeholderText Placeholder text that appears when the input is not focused.
 * @param {'all' | 'numeric'} inputType Type of values that the input should accept.
 * @param {boolean} shouldResizeOnReturn Whether or not to implement the resize hack for Android
 * (see notes below).
 * @param {boolean} debug Whether or not to log events. Note that window.debug must be enabled as
 * well (adding `?p1=1` to the url query string), which prevents input debug from accidentally
 * being added to production.
 * @example
 *
 * // Creates a hidden input with [0, 0] size. Allows for a custom cursor.
 * this.input = new Input({
 *  parent: this,
 *  onTextChanged: this.handleChange,
 *  onReturn: this.handleReturn,
 *  inputType: 'numeric',
 *  size: [0, 0],
 *  maxLength: 1,
 *  shouldResizeOnReturn: false,
 * });
 */
class Input extends cc.EditBox {
  constructor({
    parent,
    onEditingDidBegin = () => {},
    onEditingDidEnd = () => {},
    onTextChanged = () => {},
    onReturn = () => {},
    tabIndex = 1,
    size = [50, 50],
    fontColor = [0, 0, 0],
    placeholderFontColor = [0, 0, 0],
    position = [0, 0],
    placeholderText = '',
    fontSize = 50,
    maxLength = 999999,
    inputType = 'all',
    shouldResizeOnReturn = true,
    debug = false,
  }) {
    super(cc.size(...size));
    this.debug = debug;
    this.onTextChanged = onTextChanged;
    this.onEditingDidBegin = onEditingDidBegin;
    this.onEditingDidEnd = onEditingDidEnd;
    this.onReturn = onReturn;
    this.shouldResizeOnReturn = shouldResizeOnReturn;
    this.value = '';
    this.fontColor = cc.color(...fontColor);
    this.fontSize = fontSize;

    // Could not get setInputMode to work, so created custom functions to filter out key types
    this.inputType = inputType;

    this.isAndroid = is.android();

    this.setup(
      tabIndex,
      placeholderFontColor,
      position,
      placeholderText,
      maxLength,
    );

    parent.addChild(this);
  }

  setup(
    tabIndex,
    placeholderFontColor,
    position,
    placeholderText,
    maxLength,
  ) {
    this.setTouchEnabled(true);
    this.setMaxLength(maxLength);

    // Needed for focus and tabbing
    this.stayOnTop(true);

    // Tabbing only works once. And events are swallowed up by the edit box, so we have no way of
    // detecting tab without modifying Cocos framework. If we had access to tab event, we could
    // simply refocus the first input after the last input is tabbed out of. There is a new event
    // listener(editBoxEditingDidEndWithAction) that allows you to check for tab, but it's only
    // available in Cocos Creator. Cocos2d-html and Cocos2d-js have likely been deprecated.
    this.setTabIndex(tabIndex);

    this.setPosition(...position);
    this.setPlaceHolder(placeholderText);
    this.setPlaceholderFontColor(cc.color(...placeholderFontColor));
    this.setEventListeners();
  }

  debugLog(...arguments_) {
    if (this.debug) log(...arguments_);
  }

  toggleTouchEnabled(enabled) {
    this.debugLog('Setting touch enabled to: ', enabled);
    this.setTouchEnabled(enabled);
  }

  setEventListeners() {
    // NOTE: Cocos does not handle resizing correctly on Android when an input is focused (although
    // iOS works fine). To prevent the game from shrinking to fit the available space when the
    // virtual keyboard is open, we turn resizing off via resizeWithBrowserSize. This is not enough
    // however since Cocos triggers resize on orientation change, and it does so before the virtual
    // keyboard is closed. To counter this, we call the resize event ourselves with a small timeout
    // after the input box loses focus, giving the virtual keyboard time to close, and therefore
    // giving us an accurate full screen resize. Finally, there are times when an input can
    // temporarily lose focus, causing our resize event to trigger (when we don't want it to). In
    // these cases, we simply cancel our timeout that triggers the resize.
    if (this.isAndroid) {
      this.debugLog('Setting up input and disabling cc.view.resizeWithBrowserSize for Android.');
      cc.view.resizeWithBrowserSize(false);
    }

    // Needed for listeners to work
    this.setDelegate(this);

    this.editBoxEditingDidBegin = this.handleEditingDidBegin;
    this.editBoxEditingDidEnd = this.handleEditingDidEnd;
    this.editBoxTextChanged = this.handleTextChanged;
    this.editBoxReturn = this.handleReturn;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.debugLog('Setting input value to: ', value);
    this.value = value;
    this.setString(value);
  }

  handleReturn() {
    this.onReturn();

    // Return will trigger editBoxEditingDidEnd. In some cases, when return is used to submit a
    // problem and then we instantly refocus another input, we don't want to trigger a resize,
    // because the virtual keyboard will be open. See note above for resizeWithBrowserSize.
    if (!this.shouldResizeOnReturn && this.isAndroid) {
      this.debugLog('Input return key pressed on Android, cancelling resize hack since shouldResizeOnReturn option is false.');
      clearTimeout(this.resizeTimeout);
    }
  }

  handleEditingDidEnd() {
    this.debugLog('Editing did end.');
    this.onEditingDidEnd();

    // Resize after virtual keyboard closes. See note above for resizeWithBrowserSize.
    if (this.isAndroid) {
      this.debugLog('Input lost focus on Android, resizing in 1 second, after virtual keyboard closes.');

      // eslint-disable-next-line no-underscore-dangle
      this.resizeTimeout = setTimeout(cc.view._resizeEvent, 1000);
    }
  }

  handleEditingDidBegin() {
    this.debugLog('Editing did begin.');
    this.onEditingDidBegin();

    // Do not resize when focusing on an input, which will cause a temporary loss in focus on
    // another input that might have been focused. See note above for resizeWithBrowserSize.
    if (this.isAndroid) {
      this.debugLog('Input gained focus on Android, cancelling resize hack since virtual keyboard will be open.');
      clearTimeout(this.resizeTimeout);
    }
  }

  handleTextChanged(target) {
    this.debugLog('Input text changed, received value of: ', target.string);

    if (this.inputType === 'numeric') {
      const userInput = target.string;
      const filteredUserInput = validNumberInput(userInput);
      const shouldUpdateValue = this.value !== filteredUserInput;

      // Ignore what was typed and use filtered input, removing non numeric keys and spaces.
      target.setString(filteredUserInput);

      if (shouldUpdateValue) {
        this.debugLog('Numeric input updating with valid input.');
        this.value = filteredUserInput;
        this.onTextChanged(this.value);
      }
    } else {
      this.value = target.string;
      this.onTextChanged(this.value);
    }
  }

  toggleFocus(shouldFocus) {
    this.debugLog('Setting focus to: ', shouldFocus);

    if (shouldFocus) {
      this.setFocus();
    } else {
      // Cocos does not provide the ability to blur, so we hack it.
      this.setVisible(false);
      setTimeout(() => this.setVisible(true), 100);
    }
  }
}

export default Input;
