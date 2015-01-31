'use strict';

var InputView = require('ampersand-input-view-extension');
var $ = require('jquery');
require('jquery.inputmask');
var extend = require('extend');
var isAndroid = !!~navigator.userAgent.indexOf('Android');

var maskDefaults = {
  autoUnmask: true,
  placeholder: ' ',
  showMaskOnFocus: false,
  showMaskOnHover: false,
  greedy: false
};

var MaskedInputView = InputView.extend({
  props: {
    mask   : 'any', // array or string
    maskOptions: 'object'
  },

  initialize: function () {
    InputView.prototype.initialize.apply(this, arguments);
    this.on('change:mask', this.applyMask);
  },
  render    : function () {
    InputView.prototype.render.apply(this, arguments);
    this.applyMask();
  },
  applyMask : function () {
    if (this.mask && this.input && !isAndroid) {
      $(this.input).inputmask(
        extend({ mask: this.mask }, maskDefaults, this.maskOptions)
      ).on('input keyup', this.handleInputChanged);
    }
  },
  setValue: function (value) {
    this.value = value;

    $(this.input).val(value);

    if (!this.getErrorMessage(this.value)) {
      this.shouldValidate = true;
    }
  },
  handleInputChanged: function () {
    if (document.activeElement === this.input) {
      this.directlyEdited = true;
    }
    this.value = this.clean($(this.input).val());
  }
});

module.exports = MaskedInputView;