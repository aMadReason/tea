// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"webcomponents/GameEl.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/* global ShadyCSS */
var css = "\n\n  .responder {\n    height: 100px;\n  }\n\n  .commander textarea {\n    width: 100%;    \n  }\n\n";

var markup = function markup(values) {
  return "\n  <style>".concat(values.css, "</style>\n  <div>\n  <article>\n    <div class=\"scene\">scene</div>    \n    <div class=\"responder\"></div>    \n  </article>\n  <form class=\"commander\">\n    <input type=\"text\">\n    <button type=\"submit\">Go</button>\n  </form>\n  </div>\n");
};

var Component =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(Component, _HTMLElement);

  function Component() {
    var _this;

    _classCallCheck(this, Component);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Component).call(this)); // !required!

    _this._hasShadow = true; // true or fals to disable or enable shadow dom

    _this.dom = _this._hasShadow ? _this.attachShadow({
      mode: "open"
    }) : _assertThisInitialized(_this);
    _this.subs = {}; // setup your template

    var template = document.createElement("template"); // we're using innerHTML but you could manually create each element and add to this._elements for complex use-cases

    template.innerHTML = markup({
      css: css
    });
    /* Style Polyfill Step 1 */

    if (window.ShadyCSS) ShadyCSS.prepareTemplate(template, Component.tag); // eslint-disable-line

    /* END Style Polyfill Step 1 */

    _this.instance = document.importNode(template.content, true); // copy template contents into 'this'

    /* Style Polyfill Step 2 */

    if (window.ShadyCSS) ShadyCSS.styleElement(_assertThisInitialized(_this)); // eslint-disable-line

    /* END Style Polyfill Step 2 */

    _this.dom.appendChild(_this.instance);

    _this._setElements();

    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(Component, [{
    key: "_setElements",
    value: function _setElements() {
      this.G = null;
      this.scene = this.dom.querySelector(".scene");
      this.responder = this.dom.querySelector(".responder");
      this.commander = this.dom.querySelector(".commander"); // const focusables = this.querySelectorAll(
      //   "a, input, button, textarea, [tabindex='0'], [contenteditable='true']"
      // );
      // this.elements = [...[].slice.call(focusables)];
    }
  }, {
    key: "_dispatch",
    value: function _dispatch() {
      var event = new CustomEvent("tea-event", {
        detail: {}
      });
      this.dispatchEvent(event);
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return false; // if value hadn't changed do nothing

      return this;
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this;

      this.commander.addEventListener("submit", function (e) {
        return _this2.handleSubmit(e);
      });
      this.addEventListener("click", function (e) {
        return _this2.handleClick(e);
      });
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      var _this3 = this;

      this.commander.removeEventListener("submit", function (e) {
        return _this3.handleSubmit(e);
      });
      this.removeEventListener("click", function (e) {
        return _this3.handleClick(e);
      });
    }
  }, {
    key: "handleClick",
    value: function handleClick(e) {
      var _this4 = this;

      var target = e.composedPath()[0];
      if (target.tagName !== "BUTTON") return true;
      var _target$dataset = target.dataset,
          noun = _target$dataset.noun,
          described = _target$dataset.described,
          verb = _target$dataset.verb;
      if (!noun) return true;
      var location = this.G.getActiveLocation();
      var things = this.G.getThingsByInsideKey(location.key);
      var found = this.G.getThingsByNoun(noun, described, things);
      var thing = found[0];
      var cmd = this.G.command("".concat(verb, " ").concat(thing.name));
      var txt = cmd.response();
      thing.getActionKeys().map(function (key) {
        return txt = _this4.replaceVerb(txt, key, thing);
      });
      this.responder.innerHTML = txt;
    }
  }, {
    key: "replaceNoun",
    value: function replaceNoun(text, thing) {
      var noun = thing.noun,
          described = thing.described;
      return text.replace(noun, "<button data-verb=\"help\" data-described=\"".concat(described, "\" data-noun=\"").concat(noun, "\">").concat(noun, "</button>"));
    }
  }, {
    key: "replaceVerb",
    value: function replaceVerb(text, verb, thing) {
      var described = thing.described,
          noun = thing.noun;
      return text.replace(verb, "<button data-verb=\"".concat(verb, "\" data-described=\"").concat(described, "\" data-noun=\"").concat(noun, "\">").concat(verb, "</button>"));
    }
  }, {
    key: "subHandler",
    value: function subHandler() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "command";

      if (name === "location-change") {
        console.log("location-change");
        this.updateScene();
      }

      if (name === "command") {
        console.log("command");
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.stopPropagation();
      e.preventDefault();
      var txt = this.commander.children[0].value;
      var res = this.G.command(txt);
      this.responder.innerHTML = res.response();
    }
  }, {
    key: "setGame",
    value: function setGame(value) {
      this.G = value;
      console.log(this.G);

      if (this.G && this.G.pubsub) {
        this.G.pubsub.subscribe("location-change", function () {
          return console.log(123);
        });
      }

      this.updateScene();
    }
  }, {
    key: "updateScene",
    value: function updateScene() {
      var _this5 = this;

      var location = this.G.getActiveLocation();
      var things = this.G.getThingsByInsideKey(location.key);
      var desc = location.callMethod("describe");
      var thingDescs = things.map(function (i) {
        var txt = i.callMethod("describe");
        return _this5.replaceNoun(txt, i);
      });
      var content = "\n      <p>".concat(desc, "</p>      \n      <ul>\n        ").concat(thingDescs.map(function (i) {
        return "<li>".concat(i, "</li>");
      }).join(""), "\n      </ul>\n    ");
      this.scene.innerHTML = content;
    }
  }, {
    key: "game",
    get: function get() {
      return this.G;
    },
    set: function set(value) {
      this.setGame(value);
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return [];
    }
  }]);

  return Component;
}(_wrapNativeSuper(HTMLElement));

var tag = "tea-game-el";

if (window.customElements.get(tag) === undefined) {
  window.customElements.define(tag, Component);
} // magic that registers the tag


var _default = Component;
exports.default = _default;
},{}],"C:/Users/Amanda/AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49472" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/Amanda/AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js","webcomponents/GameEl.js"], null)
//# sourceMappingURL=/GameEl.fed716ee.js.map