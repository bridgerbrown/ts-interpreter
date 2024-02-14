"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
var Environment = /** @class */ (function () {
    function Environment(outer) {
        this.store = new Map();
        this.outer = outer;
    }
    Environment.prototype.get = function (name) {
        var _a;
        var obj = this.store.get(name);
        if (!obj)
            obj = (_a = this.outer) === null || _a === void 0 ? void 0 : _a.get(name);
        return obj;
    };
    Environment.prototype.set = function (name, val) {
        this.store.set(name, val);
    };
    return Environment;
}());
exports.Environment = Environment;
