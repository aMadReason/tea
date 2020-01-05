"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var howler_1 = require("howler");
var HowlerChannel = (function () {
    function HowlerChannel(options) {
        if (options === void 0) { options = {}; }
        var _a = options.fade, fade = _a === void 0 ? false : _a, _b = options.duration, duration = _b === void 0 ? 2000 : _b, _c = options.volume, volume = _c === void 0 ? false : _c;
        this.sounds = [];
        this.volume = volume || howler_1.Howler.volume();
        this.fade = fade;
        this.duration = duration;
        return this;
    }
    HowlerChannel.prototype.get = function (key) {
        if (key === void 0) { key = false; }
        return key ? this.sounds.find(function (i) { return i.key === key; }) : this.sounds;
    };
    HowlerChannel.prototype.getPlaying = function () {
        return this.sounds.filter(function (i) { return i.playing; });
    };
    HowlerChannel.prototype.getNotPlaying = function () {
        return this.sounds.filter(function (i) { return !i.playing; });
    };
    HowlerChannel.prototype.addSound = function (soundData) {
        var _this = this;
        var sound = __assign({}, soundData);
        if (this.get(sound.key))
            return;
        var howl = new howler_1.Howl(__assign(__assign({}, soundData), { onplayerror: function () {
                if (soundData.autoplay)
                    howl.once("unlock", function () { return howl.play(); });
            }, onplay: function () { return (_this.get(sound.key).playing = true); }, onend: function () { return (_this.get(sound.key).playing = false); }, onstop: function () { return (_this.get(sound.key).playing = false); }, onfade: function () { return howl.volume() === 0 && howl.stop(); } }));
        this.sounds.push(__assign(__assign({}, sound), { howl: howl }));
        return this;
    };
    HowlerChannel.prototype.addSounds = function (soundList) {
        var _this = this;
        soundList.map(function (t) { return _this.addSound(t); });
        return this;
    };
    HowlerChannel.prototype.volume = function (num) {
        this.volume = num;
        this.sounds.map(function (i) {
            i.volume = num;
            return i.howl.volume(num);
        });
    };
    HowlerChannel.prototype.play = function (key, options) {
        if (options === void 0) { options = {}; }
        var _a = options.fade, fade = _a === void 0 ? false : _a, _b = options.duration, duration = _b === void 0 ? 2000 : _b;
        if (!key)
            return;
        var sound = this.get(key);
        var howl = sound.howl;
        if (!sound || !howl || sound.playing)
            return;
        if (!fade)
            return howl.play();
        var volume = sound.volume || this.volume;
        return howl.fade(0, volume, duration).play();
    };
    HowlerChannel.prototype.stop = function (key, options) {
        if (key === void 0) { key = false; }
        if (options === void 0) { options = {}; }
        var _a = options.fade, fade = _a === void 0 ? this.fade : _a, _b = options.duration, duration = _b === void 0 ? this.duration : _b;
        if (!key)
            return;
        var sound = this.get(key);
        var howl = sound.howl;
        if (!sound || !howl || !sound.playing)
            return;
        if (!fade)
            return howl.stop();
        return howl.fade(sound.howl.volume(), 0, duration);
    };
    HowlerChannel.prototype["switch"] = function (keys, options) {
        if (keys === void 0) { keys = {}; }
        if (options === void 0) { options = {}; }
        var _a = keys.from, from = _a === void 0 ? false : _a, _b = keys.to, to = _b === void 0 ? false : _b;
        var _c = options.fade, fade = _c === void 0 ? this.fade : _c, _d = options.duration, duration = _d === void 0 ? this.duration : _d;
        var fromSounds = this.getPlaying();
        var toSounds = this.getNotPlaying();
        if (from)
            fromSounds = this.sounds.filter(function (i) { return from.includes(i.key); });
        if (to)
            toSounds = this.sounds.filter(function (i) { return from.includes(i.key); });
        this.stopAll({ fade: fade, duration: duration }, fromSounds);
        this.playAll({ fade: fade, duration: duration }, toSounds);
    };
    HowlerChannel.prototype.stopAll = function (options, sounds) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (sounds === void 0) { sounds = this.sounds; }
        var _a = options.fade, fade = _a === void 0 ? this.fade : _a, _b = options.duration, duration = _b === void 0 ? this.duration : _b;
        sounds.map(function (i) { return _this.stop(i.key, { fade: fade, duration: duration }); });
    };
    HowlerChannel.prototype.playAll = function (options, sounds) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (sounds === void 0) { sounds = this.sounds; }
        var _a = options.fade, fade = _a === void 0 ? this.fade : _a, _b = options.duration, duration = _b === void 0 ? this.duration : _b;
        sounds.map(function (i) { return _this.play(i.key, { fade: fade, duration: duration }); });
    };
    return HowlerChannel;
}());
exports["default"] = HowlerChannel;
