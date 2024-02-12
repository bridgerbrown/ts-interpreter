"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullVal = exports.BooleanVal = exports.IntegerVal = void 0;
var IntegerVal = /** @class */ (function () {
    function IntegerVal(value) {
        this.value = value;
    }
    IntegerVal.prototype.type = function () { return "INTEGER" /* Objects.Integer_Obj */; };
    IntegerVal.prototype.inspect = function () { return this.value.toString(); };
    return IntegerVal;
}());
exports.IntegerVal = IntegerVal;
var BooleanVal = /** @class */ (function () {
    function BooleanVal(value) {
        this.value = value;
    }
    BooleanVal.prototype.type = function () { return "BOOLEAN" /* Objects.Boolean_Obj */; };
    BooleanVal.prototype.inspect = function () { return this.value.toString(); };
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
