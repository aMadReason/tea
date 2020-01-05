"use strict";
exports.__esModule = true;
exports.uuid = function () {
    var cryptoObj = window.crypto || window.msCrypto;
    var uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
        return (c ^
            (cryptoObj.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
    });
    return uuid;
};
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
        return (c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
    });
}
exports.uuidv4 = uuidv4;
exports.genId = function () {
    return (new Date().getTime().toString(36) +
        "_" +
        (Date.now() + Math.random().toString()).split(".").join("_"));
};
