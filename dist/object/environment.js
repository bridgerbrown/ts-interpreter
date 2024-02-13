"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
var Environment = /** @class */ (function () {
    function Environment() {
        this.store = new Map();
    }
    Environment.prototype.get = function (name) {
        var obj = this.store.get(name);
        return obj;
    };
    Environment.prototype.set = function (name, val) {
        this.store.set(name, val);
    };
    return Environment;
}());
exports.Environment = Environment;
