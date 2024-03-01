class IntegerVal {
    constructor(value) {
        this.value = value;
    }
    type() { return "INTEGER" /* Objects.Integer_Obj */; }
    inspect() { return this.value.toString(); }
}
class BooleanVal {
    constructor(value) {
        this.value = value;
    }
    type() { return "BOOLEAN" /* Objects.Boolean_Obj */; }
    inspect() { return this.value.toString(); }
}
class NullVal {
    type() { return "NULL" /* Objects.Null_Obj */; }
    inspect() { return "null"; }
}
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
class ErrorVal {
    constructor(message) {
        this.message = message;
    }
    type() { return "ERROR" /* Objects.Error_Obj */; }
    inspect() { return "ERROR: " + this.message; }
}
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
class StringVal {
    constructor(value) {
        this.value = value;
    }
    type() { return "STRING" /* Objects.String_Obj */; }
    inspect() { return this.value; }
}
class BuiltIn {
    constructor(fn) {
        this.fn = fn;
    }
    type() { return "BUILTIN" /* Objects.BuiltIn_Obj */; }
    inspect() { return "builtin function"; }
}
class ArrayVal {
    constructor(elements) {
        this.elements = [];
        this.elements = elements;
    }
    type() { return "ARRAY" /* Objects.Array_Obj */; }
    inspect() {
        const elements = [];
        for (let e of this.elements) {
            elements.push(e?.inspect());
        }
        return "[" + elements.join(", ") + "]";
    }
}
export { IntegerVal, BooleanVal, NullVal, ReturnVal, ErrorVal, FunctionVal, StringVal, BuiltIn, ArrayVal };
