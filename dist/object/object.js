"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashPair = exports.HashVal = exports.HashKey = exports.ArrayVal = exports.BuiltIn = exports.StringVal = exports.FunctionVal = exports.ErrorVal = exports.ReturnVal = exports.NullVal = exports.BooleanVal = exports.IntegerVal = void 0;
var HashKey = /** @class */ (function () {
    function HashKey(type, value) {
        this.type = type;
        this.value = value;
    }
    return HashKey;
}());
exports.HashKey = HashKey;
var IntegerVal = /** @class */ (function () {
    function IntegerVal(value) {
        this.value = value;
    }
    IntegerVal.prototype.type = function () { return "INTEGER" /* Objects.Integer_Obj */; };
    IntegerVal.prototype.inspect = function () { return this.value.toString(); };
    IntegerVal.prototype.hashKey = function () {
        return new HashKey(this.type(), BigInt(this.value));
    };
    return IntegerVal;
}());
exports.IntegerVal = IntegerVal;
var BooleanVal = /** @class */ (function () {
    function BooleanVal(value) {
        this.value = value;
    }
    BooleanVal.prototype.type = function () { return "BOOLEAN" /* Objects.Boolean_Obj */; };
    BooleanVal.prototype.inspect = function () { return this.value.toString(); };
    BooleanVal.prototype.hashKey = function () {
        var value;
        value ? value = 1 : value = 0;
        return new HashKey(this.type(), value);
    };
    return BooleanVal;
}());
exports.BooleanVal = BooleanVal;
var NullVal = /** @class */ (function () {
    function NullVal() {
    }
    NullVal.prototype.type = function () { return "NULL" /* Objects.Null_Obj */; };
    NullVal.prototype.inspect = function () { return "null"; };
    return NullVal;
}());
exports.NullVal = NullVal;
var ReturnVal = /** @class */ (function () {
    function ReturnVal(value) {
        this.value = value;
    }
    ReturnVal.prototype.type = function () { return "RETURN_VALUE" /* Objects.Return_Value_Obj */; };
    ReturnVal.prototype.inspect = function () {
        if (this.value) {
            return this.value.toString();
        }
        return "";
    };
    return ReturnVal;
}());
exports.ReturnVal = ReturnVal;
var ErrorVal = /** @class */ (function () {
    function ErrorVal(message) {
        this.message = message;
    }
    ErrorVal.prototype.type = function () { return "ERROR" /* Objects.Error_Obj */; };
    ErrorVal.prototype.inspect = function () { return "ERROR: " + this.message; };
    return ErrorVal;
}());
exports.ErrorVal = ErrorVal;
var FunctionVal = /** @class */ (function () {
    function FunctionVal(parameters, body, env) {
        this.parameters = parameters;
        this.body = body;
        this.env = env;
    }
    FunctionVal.prototype.type = function () { return "FUNCTION" /* Objects.Function_Obj */; };
    FunctionVal.prototype.inspect = function () {
        var e_1, _a;
        var strs = [];
        if (this.parameters) {
            try {
                for (var _b = __values(this.parameters), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var p = _c.value;
                    strs.push(p);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return "fn(".concat(strs.join(", "), ") {\n").concat(this.body, "\n}");
    };
    return FunctionVal;
}());
exports.FunctionVal = FunctionVal;
var StringVal = /** @class */ (function () {
    function StringVal(value) {
        this.value = value;
    }
    StringVal.prototype.type = function () { return "STRING" /* Objects.String_Obj */; };
    StringVal.prototype.inspect = function () { return this.value; };
    StringVal.prototype.hashKey = function () {
        var h = BigInt("14695981039346656037n");
        var fnvPrime = BigInt("1099511628211n");
        for (var i = 0; i < this.value.length; i++) {
            h ^= BigInt(this.value.charCodeAt(i));
            h *= fnvPrime;
        }
        return new HashKey("STRING" /* Objects.String_Obj */, h);
    };
    return StringVal;
}());
exports.StringVal = StringVal;
var BuiltIn = /** @class */ (function () {
    function BuiltIn(fn) {
        this.fn = fn;
    }
    BuiltIn.prototype.type = function () { return "BUILTIN" /* Objects.BuiltIn_Obj */; };
    BuiltIn.prototype.inspect = function () { return "builtin function"; };
    return BuiltIn;
}());
exports.BuiltIn = BuiltIn;
var ArrayVal = /** @class */ (function () {
    function ArrayVal(elements) {
        this.elements = [];
        this.elements = elements;
    }
    ArrayVal.prototype.type = function () { return "ARRAY" /* Objects.Array_Obj */; };
    ArrayVal.prototype.inspect = function () {
        var e_2, _a;
        var elements = [];
        try {
            for (var _b = __values(this.elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var e = _c.value;
                elements.push(e === null || e === void 0 ? void 0 : e.inspect());
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return "[" + elements.join(", ") + "]";
    };
    return ArrayVal;
}());
exports.ArrayVal = ArrayVal;
var HashPair = /** @class */ (function () {
    function HashPair(key, value) {
        this.key = key;
        this.value = value;
    }
    return HashPair;
}());
exports.HashPair = HashPair;
var HashVal = /** @class */ (function () {
    function HashVal(pairs) {
        this.pairs = pairs;
    }
    HashVal.prototype.type = function () { return "HASH" /* Objects.Hash_Obj */; };
    HashVal.prototype.inspect = function () {
        var e_3, _a;
        var _b, _c;
        var pairs = [];
        try {
            for (var _d = __values(this.pairs.entries()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var _f = __read(_e.value, 2), key = _f[0], pair = _f[1];
                pairs.push("".concat((_b = pair.key) === null || _b === void 0 ? void 0 : _b.inspect(), ": ").concat((_c = pair.value) === null || _c === void 0 ? void 0 : _c.inspect()));
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return "{ " + pairs.join(", ") + " }";
    };
    return HashVal;
}());
exports.HashVal = HashVal;
