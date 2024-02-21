"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Router_1 = require("./services/Router");
window.app = {
    router: Router_1.default
};
var $ = function (selectors) { return document.querySelector(selectors); };
var $$ = function (selectors) { return document.querySelectorAll(selectors); };
HTMLElement.prototype.$ = function (selectors) {
    return this.querySelector(selectors);
};
HTMLElement.prototype.$$ = function (selectors) {
    return this.querySelectorAll(selectors);
};
HTMLElement.prototype.on = function (type, listener, options) {
    this.addEventListener(type, listener, options);
};
HTMLElement.prototype.off = function (type, listener, options) {
    this.removeEventListener(type, listener, options);
};
window.addEventListener("DOMContentLoaded", function () {
    window.app.router.init();
});
