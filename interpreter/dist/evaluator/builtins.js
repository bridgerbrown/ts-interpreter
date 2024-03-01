"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builtins = void 0;
const object_1 = require("../object/object");
const evaluator_1 = require("./evaluator");
exports.builtins = {
    "len": new object_1.BuiltIn((...args) => {
        var _a;
        if (args.length !== 1) {
            return (0, evaluator_1.newError)(`wrong number of arguments. got=${args.length}, want=1`);
        }
        const arg = args[0];
        switch (true) {
            case (arg instanceof object_1.StringVal):
                return new object_1.IntegerVal((arg.inspect()).length);
            case (arg instanceof object_1.ArrayVal):
                return new object_1.IntegerVal((arg.elements).length);
            default:
                return (0, evaluator_1.newError)(`argument to 'len' not supported, got ${(_a = args[0]) === null || _a === void 0 ? void 0 : _a.type()}`);
        }
    }),
    "push": new object_1.BuiltIn((...args) => {
        if (args.length !== 2) {
            return (0, evaluator_1.newError)(`wrong number of arguments. got=${args.length} want=2`);
        }
        if (args[0] && args[0].type() !== "ARRAY" /* Objects.Array_Obj */) {
            return (0, evaluator_1.newError)(`argument to 'push' must be ARRAY, got ${args[0].type()}`);
        }
        const arr = args[0];
        const newElements = [...arr.elements, args[1]];
        return new object_1.ArrayVal(newElements);
    }),
    "prnt": new object_1.BuiltIn((...args) => {
        for (const arg of args) {
            arg ? console.log(arg.inspect()) : console.log("");
        }
        return null;
    })
};
