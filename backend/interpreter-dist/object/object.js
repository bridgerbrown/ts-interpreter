"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayVal = exports.BuiltIn = exports.StringVal = exports.FunctionVal = exports.ErrorVal = exports.ReturnVal = exports.NullVal = exports.BooleanVal = exports.IntegerVal = void 0;
class IntegerVal {
    constructor(value) {
        this.value = value;
    }
    type() { return "INTEGER" /* Objects.Integer_Obj */; }
    inspect() { return this.value.toString(); }
}
exports.IntegerVal = IntegerVal;
class BooleanVal {
    constructor(value) {
        this.value = value;
    }
    type() { return "BOOLEAN" /* Objects.Boolean_Obj */; }
    inspect() { return this.value.toString(); }
}
exports.BooleanVal = BooleanVal;
class NullVal {
    type() { return "NULL" /* Objects.Null_Obj */; }
    inspect() { return "null"; }
}
exports.NullVal = NullVal;
class ReturnVal {
    constructor(value) {
        this.value = value;
    }
    type() { return "RETURN_VALUE" /* Objects.Return_Value_Obj */; }
    inspect() {
        if (this.value) {
            return this.value.toString();
        }
        return "";
    }
}
exports.ReturnVal = ReturnVal;
class ErrorVal {
    constructor(message) {
        this.message = message;
    }
    type() { return "ERROR" /* Objects.Error_Obj */; }
    inspect() { return "ERROR: " + this.message; }
}
exports.ErrorVal = ErrorVal;
class FunctionVal {
    constructor(parameters, body, env) {
        this.parameters = parameters;
        this.body = body;
        this.env = env;
    }
    type() { return "FUNCTION" /* Objects.Function_Obj */; }
    inspect() {
        let strs = [];
        if (this.parameters) {
            for (let p of this.parameters)
                strs.push(p);
        }
        return `fn(${strs.join(", ")}) {\n${this.body}\n}`;
    }
}
exports.FunctionVal = FunctionVal;
class StringVal {
    constructor(value) {
        this.value = value;
    }
    type() { return "STRING" /* Objects.String_Obj */; }
    inspect() { return this.value; }
}
exports.StringVal = StringVal;
class BuiltIn {
    constructor(fn) {
        this.fn = fn;
    }
    type() { return "BUILTIN" /* Objects.BuiltIn_Obj */; }
    inspect() { return "builtin function"; }
}
exports.BuiltIn = BuiltIn;
class ArrayVal {
    constructor(elements) {
        this.elements = [];
        this.elements = elements;
    }
    type() { return "ARRAY" /* Objects.Array_Obj */; }
    inspect() {
        const elements = [];
        for (let e of this.elements) {
            elements.push(e === null || e === void 0 ? void 0 : e.inspect());
        }
        return "[" + elements.join(", ") + "]";
    }
}
exports.ArrayVal = ArrayVal;
