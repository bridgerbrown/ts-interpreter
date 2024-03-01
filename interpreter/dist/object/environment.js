"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
class Environment {
    constructor(outer) {
        this.store = new Map();
        this.outer = outer;
    }
    get(name) {
        var _a;
        let obj = this.store.get(name);
        if (!obj)
            obj = (_a = this.outer) === null || _a === void 0 ? void 0 : _a.get(name);
        return obj;
    }
    set(name, val) {
        this.store.set(name, val);
    }
}
exports.Environment = Environment;
