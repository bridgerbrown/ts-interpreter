class HashKey {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
class IntegerVal {
    constructor(value) {
        this.value = value;
    }
    type() { return "INTEGER" /* Objects.Integer_Obj */; }
    inspect() { return this.value.toString(); }
    hashKey() {
        return new HashKey(this.type(), BigInt(this.value));
    }
}
class BooleanVal {
    constructor(value) {
        this.value = value;
    }
    type() { return "BOOLEAN" /* Objects.Boolean_Obj */; }
    inspect() { return this.value.toString(); }
    hashKey() {
        let value;
        value ? value = 1 : value = 0;
        return new HashKey(this.type(), value);
    }
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
    hashKey() {
        let h = BigInt(14695981039346656037n);
        const fnvPrime = BigInt(1099511628211n);
        for (let i = 0; i < this.value.length; i++) {
            h ^= BigInt(this.value.charCodeAt(i));
            h *= fnvPrime;
        }
        return new HashKey("STRING" /* Objects.String_Obj */, h);
    }
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
class HashPair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
class HashVal {
    constructor(pairs) {
        this.pairs = pairs;
    }
    type() { return "HASH" /* Objects.Hash_Obj */; }
    inspect() {
        const pairs = [];
        for (let [key, pair] of this.pairs) {
            pairs.push(`${pair.key?.inspect()}: ${pair.value?.inspect()}`);
        }
        return "{ " + pairs.join(", ") + " }";
    }
}
export { IntegerVal, BooleanVal, NullVal, ReturnVal, ErrorVal, FunctionVal, StringVal, BuiltIn, ArrayVal, HashKey, HashVal, HashPair };
