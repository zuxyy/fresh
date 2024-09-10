// import Translation from 'Translation';

var us_ = us_ || (function () {
    var module = {};

    module.onLoad = function () {
      var i;
      var ffl = document.getElementsByTagName('form');
      var ff = [];
      // NodeList changes while we move form to different parent; preload into array.
      for (i = 0; i < ffl.length; i++) {
        ff.push(ffl[i]);
      }

      for (i = 0; i < ff.length; i++) {
        var f = ff[i];
        var a = f.getAttribute('us_mode');
        if (!a) {
          continue;
        }
        if (a == 'popup') {
          createAndShowPopup(f);
        }
        autodetectCharset(f);
        f.addEventListener('submit', function (event) {
          if (!module.onSubmit(event.target)) {
            event.preventDefault();
          }
        }, false);
      }
      centerAllPopups();
      onResizeOld = document.onresize;
      document.onresize = function () {
        module.onResize();
      };

      var datepickerElements = document.getElementsByClassName('formdatepicker');
      for (var i in datepickerElements) {
        var picker = new Pikaday({ field: datepickerElements[i], format: dateFormat.toUpperCase() });
      }

      var msg = {
        type: 'formDimensionPopulate',
        width: document.body.scrollWidth,
        height: document.body.scrollHeight,
        originUrl: window.location.href,
      };

      window.top.postMessage(msg, '*');

      onLoadCalled = true;
    };

    module.onResize = function () {
      centerAllPopups();
    };

    module.onSubmit = function (form) {
      if (!onLoadCalled) {
        alert('module.onLoad() has not been called');
        return false;
      }

      _hideErrorMessages(form);

      if (!_validateTextInputsAndDropdowns(form) ||
        !_validateCheckboxes(form) ||
        !_validateRadios(form)) {
        return false;
      }
      ;

      return true;
    };

    function autodetectCharset(form) {
      var ee = form.getElementsByTagName('input');
      for (var i = 0; i < ee.length; i++) {
        var e = ee[i];
        if (e.getAttribute('name') == 'charset') {
          if (e.value == '') {
            // http://stackoverflow.com/questions/318831
            e.value = window.characterSet ? window.characterSet : window.charset;
          }
          return;
        }
      }
    }

    function createAndShowPopup(form) {
      var d = document;
      // outerHTML(): http://stackoverflow.com/questions/1700870
      var e = d.createElement('div');
      e.style.position = 'absolute';
      e.style.width = 'auto';
      e = d.body.appendChild(e);
      e.appendChild(form);
      form.style.display = '';
      popups.push(e);
    }

    function centerAllPopups() {
      // Multiple popups will overlap, but nobody cares until somebody cares.
      var w = window;
      var d = document;
      var ww = w.innerWidth ? w.innerWidth : d.body.clientWidth;
      var wh = w.innerHeight ? w.innerHeight : d.body.clientHeight;
      for (var i = 0; i < popups.length; i++) {
        var e = popups[i];
        var ew = parseInt(e.offsetWidth + '');
        var eh = parseInt(e.offsetHeight + '');
        e.style.left = (ww - ew) / 2 + d.body.scrollLeft + (i * 10);
        e.style.top = (wh - eh) / 2 + d.body.scrollTop + (i * 10);
      }
    }

    function trim(s) {
      return s == null ? '' : s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };

    function _validateTextInputsAndDropdowns(form) {
      var elements = form.querySelectorAll('input[type=text], textarea, select');

      if (elements.length == 0) {
        return true;
      }

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        if (inputsInitialBorderColor[element.name]
          && inputsInitialBorderColor[element.name].length > 0) {
          element.style["border-color"] = inputsInitialBorderColor[element.name];
        } else {
          inputsInitialBorderColor[element.name] = element.style["border-color"];
        }

        var nameAttr = element.getAttribute('name');
        if (nameAttr === 'email') hasEmail = true;
        if (nameAttr === 'phone') hasPhone = true;

        var value = trim(element.value);

        var isEmpty = (value === '');
        var isRequired = (element.getAttribute('_required') === '1');

        if (isEmpty) {

          if (isRequired) {
            var message = Translations.form.missingField.replace('%s', element.getAttribute('_label'));
            _showErrorMessage(message, element);
            element.style["border-color"] = '#ff592d';
            element.focus();
            return false;
          }

        } else {

          function showError(e, message) {
            if (!message) {
              message = Translations.form.invalidField.replace('%s', e.getAttribute('_label'));
            }

            _showErrorMessage(message, e);
            e.style["border-color"] = "#ff592d";
            e.focus();
          }

          var validatorType = element.getAttribute('_validator');
          var regExp = null;

          switch (validatorType) {
            case null:
            case '':
            case 'string':
            case 'text':
              break;

            case 'date':
              regExp = dateFormat.replace(/dd?/i, '([0-9]{1,2})');
              regExp = regExp.replace(/mm?/i, '([0-9]{1,2})');
              regExp = regExp.replace(/yy{1,3}/i, '([0-9]{2,4})');
              regExp = new RegExp(regExp);
              var matches = regExp.exec(value);
              var error = Translations.form.invalidDate;

              if (matches && matches[1] && matches[2] && matches[3]) {
                var dateValue = parseInt(matches[1], 10),
                  monthValue = parseInt(matches[2], 10),
                  yearValue = parseInt(matches[3], 10);

                var date = new Date(yearValue, monthValue - 1, dateValue);
                if (date.getFullYear() != yearValue
                  || date.getMonth() + 1 != monthValue
                  || date.getDate() != dateValue) {
                  showError(element, error);
                  return false;
                }
              } else {
                showError(element, error);
                return false;
              }
              break;

            case 'email':
              regExp = us_emailRegexp;
              break;

            case 'phone':
              regExp = us_phoneRegexp;
              break;

            case 'number':
            case 'float':
              regExp = /^[+\-]?\d+(\.\d+)?$/;
              break;

            default:
              alert('Internal error: unknown validator "' + validatorType + '"');
              element.focus();
              return false;
          }

          if (regExp && !regExp.test(value) && validatorType != 'date') {
            showError(element);
            return false;
          }
        }
      }

      return true;
    };

    function _validateCheckboxes(form) {
      return _validateOptionsList(form, "checkbox");
    };

    function _validateRadios(form) {
      return _validateOptionsList(form, "radio");
    };

    function _validateOptionsList(form, type) {
      var elements = form.querySelectorAll('input[type=' + type + ']');
      if (elements.length == 0) {
        return true;
      }
      var requiredArray = new Array();

      var escapedName = "";

      function getParentUl(element) {
        if (!element || element == document) return null;

        if (element.parentNode.nodeName && element.parentNode.nodeName.toLowerCase() === 'ul') {
          return element.parentNode;
        } else {
          return getParentUl(element.parentNode);
        }
      }

      // Sort required elements by name.
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute('_required') === '1' && elements[i].getAttribute('name')) {
          escapedName = elements[i].getAttribute('name').replace(/(:|\.|\[|\])/g, '\\$1');

          if (requiredArray.indexOf(escapedName) === -1) {
            requiredArray.push(escapedName);
          }
        }
      }

      for (var i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute('_required') === '1' && elements[i].getAttribute('data-virtual-name')) {
          escapedName = elements[i].getAttribute('data-virtual-name').replace(/(:|\.|\[|\])/g, '\\$1');

          if (requiredArray.indexOf(escapedName) === -1) {
            requiredArray.push(escapedName);
          }
        }
      }

      // Check required elements.
      for (var j in requiredArray) {
        escapedName = requiredArray[j];
        var checkedLength = form.querySelectorAll('input[name=' + escapedName + ']:checked, ' +
          'input[data-virtual-name=' + escapedName + ']:checked').length;

        var allElements = form.querySelectorAll('input[name=' + escapedName + '], ' +
          'input[data-virtual-name=' + escapedName + ']');

        if (checkedLength === 0) {
          var ul = getParentUl(allElements[0]);

          var message = Translations.form.missingField.replace('%s', allElements[0].getAttribute('_label'));

          var maybeFullMessage = allElements[0].getAttribute('_fullErrorMessage');

          if(maybeFullMessage) message = maybeFullMessage;

          _showErrorMessage(message, ul);

          return false;
        }
      }

      return true;
    };

    function _showErrorMessage(message, block) {
      if (block) {
        var errorBlock = block.parentNode.querySelector(".error-block");

        errorBlock.innerHTML = message;
        errorBlock.style.display = 'block';
      }
    };

    function _hideErrorMessages(form) {
      var errorBlocks = form.querySelectorAll(".error-block");

      if (errorBlocks.length == 0) {
        return;
      }

      for (var i = 0; i < errorBlocks.length; i++) {
        var block = errorBlocks[i];
        block.innerHtml = '';
        block.style.display = 'none';
      }
    };

    function _isInIframe() {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    }

    /** Формат даты **/
    var dateFormat = 'dd.mm.yyyy';
    var us_emailRegexp = /^[a-zA-Z0-9_+=-]+[a-zA-Z0-9\._+=-]*@[a-zA-Z0-9][a-zA-Z0-9-]*(\.[a-zA-Z0-9]([a-zA-Z0-9-]*))*\.([a-zA-Z]{2,14})$/;
    var us_phoneRegexp = /^\s*[\d +()-.]{7,32}\s*$/;
    var onLoadCalled = false;
    var onResizeOld = null;
    var popups = [];
    var hasEmail = false;
    var hasPhone = false;
    var inputsInitialBorderColor = {};

    if (document.readyState == 'complete') {
      module.onLoad();
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        module.onLoad();
      }, false);
    }

    return module;
  })();
