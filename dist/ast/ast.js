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
exports.HashLiteral = exports.IndexExpression = exports.ArrayLiteral = exports.StringLiteral = exports.CallExpression = exports.FunctionLiteral = exports.BlockStatement = exports.IfExpression = exports.Boolean = exports.InfixExpression = exports.PrefixExpression = exports.ExpressionStatement = exports.IntegerLiteral = exports.Identifier = exports.ReturnStatement = exports.LetStatement = exports.Program = void 0;
var Program = /** @class */ (function () {
    function Program() {
        this.statements = [];
        this.statements = [];
    }
    Program.prototype.tokenLiteral = function () {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral();
        }
        else {
            return "";
        }
    };
    Program.prototype.string = function () {
        var e_1, _a;
        var out = "";
        try {
            for (var _b = __values(this.statements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var s = _c.value;
                out += s.string();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return out;
    };
    return Program;
}());
exports.Program = Program;
var LetStatement = /** @class */ (function () {
    function LetStatement(token, name, value) {
        this.token = token;
        this.name = name;
        this.value = value;
    }
    LetStatement.prototype.statementNode = function () { };
    LetStatement.prototype.tokenLiteral = function () { return this.token.literal; };
    LetStatement.prototype.string = function () {
        var _a, _b;
        var out = "let ".concat((_a = this.name) === null || _a === void 0 ? void 0 : _a.value, " = ").concat((_b = this.value) === null || _b === void 0 ? void 0 : _b.string(), ";");
        return out;
    };
    return LetStatement;
}());
exports.LetStatement = LetStatement;
var ReturnStatement = /** @class */ (function () {
    function ReturnStatement(token, value) {
        this.token = token;
        this.returnValue = value;
    }
    ReturnStatement.prototype.statementNode = function () { };
    ReturnStatement.prototype.tokenLiteral = function () { return this.token.literal; };
    ReturnStatement.prototype.string = function () {
        var out = "";
        out += this.tokenLiteral() + " ";
        if (this.returnValue !== null) {
            out += this.returnValue.toString();
        }
        out += ";";
        return out;
    };
    return ReturnStatement;
}());
exports.ReturnStatement = ReturnStatement;
var Identifier = /** @class */ (function () {
    function Identifier(token) {
        this.value = "";
        this.token = token;
        this.value = token.literal;
    }
    Identifier.prototype.expressionNode = function () { };
    Identifier.prototype.tokenLiteral = function () { return this.token.literal; };
    Identifier.prototype.string = function () { return this.value.toString(); };
    return Identifier;
}());
exports.Identifier = Identifier;
var IntegerLiteral = /** @class */ (function () {
    function IntegerLiteral(token, value) {
        this.token = token;
        this.value = value;
    }
    IntegerLiteral.prototype.expressionNode = function () { };
    IntegerLiteral.prototype.tokenLiteral = function () { return this.token.literal; };
    IntegerLiteral.prototype.string = function () {
        if (this.value) {
            return this.value.toString();
        }
        else {
            return "";
        }
    };
    return IntegerLiteral;
}());
exports.IntegerLiteral = IntegerLiteral;
var ExpressionStatement = /** @class */ (function () {
    function ExpressionStatement(token, expression) {
        this.token = token;
        this.expression = expression;
    }
    ExpressionStatement.prototype.statementNode = function () { };
    ExpressionStatement.prototype.tokenLiteral = function () { return this.token.literal; };
    ExpressionStatement.prototype.string = function () {
        if (this.expression !== null) {
            return "".concat(this.expression.string());
        }
        return "";
    };
    return ExpressionStatement;
}());
exports.ExpressionStatement = ExpressionStatement;
var PrefixExpression = /** @class */ (function () {
    function PrefixExpression(token, operator, right) {
        this.token = token;
        this.operator = operator;
        this.right = right;
    }
    PrefixExpression.prototype.expressionNode = function () { };
    PrefixExpression.prototype.tokenLiteral = function () { return this.token.literal; };
    PrefixExpression.prototype.string = function () {
        var _a;
        return "(".concat(this.operator).concat((_a = this.right) === null || _a === void 0 ? void 0 : _a.string(), ")");
    };
    return PrefixExpression;
}());
exports.PrefixExpression = PrefixExpression;
var InfixExpression = /** @class */ (function () {
    function InfixExpression(token, operator, left, right) {
        this.token = token;
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    InfixExpression.prototype.expressionNode = function () { };
    InfixExpression.prototype.tokenLiteral = function () { return this.token.literal; };
    InfixExpression.prototype.string = function () {
        var _a;
        return "(".concat(this.left.string(), " ").concat(this.operator, " ").concat((_a = this.right) === null || _a === void 0 ? void 0 : _a.string(), ")");
    };
    return InfixExpression;
}());
exports.InfixExpression = InfixExpression;
var Boolean = /** @class */ (function () {
    function Boolean(token, value) {
        this.token = token;
        this.value = value;
    }
    Boolean.prototype.expressionNode = function () { };
    Boolean.prototype.tokenLiteral = function () { return this.token.literal; };
    Boolean.prototype.string = function () { return this.token.literal; };
    return Boolean;
}());
exports.Boolean = Boolean;
var IfExpression = /** @class */ (function () {
    function IfExpression(token, condition, consequence, alternative) {
        this.token = token;
        this.condition = condition;
        this.consequence = consequence;
        this.alternative = alternative;
    }
    IfExpression.prototype.expressionNode = function () { };
    IfExpression.prototype.tokenLiteral = function () { return this.token.literal; };
    IfExpression.prototype.string = function () {
        var _a, _b, _c;
        var expression = "if" + ((_a = this.condition) === null || _a === void 0 ? void 0 : _a.string()) + " " + ((_b = this.consequence) === null || _b === void 0 ? void 0 : _b.string());
        if (this.alternative !== null) {
            expression += "else " + ((_c = this.alternative) === null || _c === void 0 ? void 0 : _c.string());
        }
        return expression;
    };
    return IfExpression;
}());
exports.IfExpression = IfExpression;
var BlockStatement = /** @class */ (function () {
    function BlockStatement(token, statements) {
        this.token = token;
        this.statements = statements;
    }
    BlockStatement.prototype.statementNode = function () { };
    BlockStatement.prototype.tokenLiteral = function () { return this.token.literal; };
    BlockStatement.prototype.string = function () {
        var e_2, _a;
        var statements = "";
        try {
            for (var _b = __values(this.statements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var s = _c.value;
                statements += s.string();
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return statements;
    };
    return BlockStatement;
}());
exports.BlockStatement = BlockStatement;
var FunctionLiteral = /** @class */ (function () {
    function FunctionLiteral(token, parameters, body) {
        this.token = token;
        this.parameters = parameters;
        this.body = body;
    }
    FunctionLiteral.prototype.expressionNode = function () { };
    FunctionLiteral.prototype.tokenLiteral = function () { return this.token.literal; };
    FunctionLiteral.prototype.string = function () {
        var e_3, _a;
        var params = [];
        if (this.parameters) {
            try {
                for (var _b = __values(this.parameters), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var p = _c.value;
                    params.push(p.string());
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        var body = "";
        if (this.body) {
            body = this.body.toString();
        }
        var str = this.tokenLiteral() + "(" + params.join(", ") + ") " + body;
        return str;
    };
    return FunctionLiteral;
}());
exports.FunctionLiteral = FunctionLiteral;
var CallExpression = /** @class */ (function () {
    function CallExpression(token, fn, args) {
        this.token = token;
        this.fn = fn;
        this.args = args;
    }
    CallExpression.prototype.expressionNode = function () { };
    CallExpression.prototype.tokenLiteral = function () { return this.token.literal; };
    CallExpression.prototype.string = function () {
        var e_4, _a;
        var args = [];
        if (this.args) {
            try {
                for (var _b = __values(this.args), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var arg = _c.value;
                    args.push(arg === null || arg === void 0 ? void 0 : arg.string());
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return this.fn.string() + "(" + this.args.join(", ") + ")";
        }
        return "";
    };
    return CallExpression;
}());
exports.CallExpression = CallExpression;
var StringLiteral = /** @class */ (function () {
    function StringLiteral(token, value) {
        this.token = token;
        this.value = value;
    }
    StringLiteral.prototype.expressionNode = function () { };
    StringLiteral.prototype.tokenLiteral = function () { return this.token.literal; };
    StringLiteral.prototype.string = function () { return this.token.literal; };
    return StringLiteral;
}());
exports.StringLiteral = StringLiteral;
var ArrayLiteral = /** @class */ (function () {
    function ArrayLiteral(token, elements) {
        this.token = token;
        this.elements = elements;
    }
    ArrayLiteral.prototype.expressionNode = function () { };
    ArrayLiteral.prototype.tokenLiteral = function () { return this.token.literal; };
    ArrayLiteral.prototype.string = function () {
        var e_5, _a;
        var arr = [];
        if (this.elements) {
            try {
                for (var _b = __values(this.elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var el = _c.value;
                    el ? arr.push(el.string()) : "null";
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return "[" + arr.join(", ") + "]";
        }
        return "[]";
    };
    return ArrayLiteral;
}());
exports.ArrayLiteral = ArrayLiteral;
var IndexExpression = /** @class */ (function () {
    function IndexExpression(token, left, index) {
        this.token = token;
        this.left = left;
        this.index = index;
    }
    IndexExpression.prototype.expressionNode = function () { };
    IndexExpression.prototype.tokenLiteral = function () { return this.token.literal; };
    IndexExpression.prototype.string = function () {
        var _a;
        return "(" + this.left.string() + "[" + ((_a = this.index) === null || _a === void 0 ? void 0 : _a.string()) + "]";
    };
    return IndexExpression;
}());
exports.IndexExpression = IndexExpression;
var HashLiteral = /** @class */ (function () {
    function HashLiteral(token, pairs) {
        this.token = token;
        this.pairs = pairs;
    }
    HashLiteral.prototype.expressionNode = function () { };
    HashLiteral.prototype.tokenLiteral = function () { return this.token.literal; };
    HashLiteral.prototype.string = function () {
        var e_6, _a;
        var pairs = [];
        try {
            for (var _b = __values(this.pairs.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                pairs.push("".concat(key.string(), ":").concat(value === null || value === void 0 ? void 0 : value.string()));
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return "{" + pairs.join(", ") + "}";
    };
    return HashLiteral;
}());
exports.HashLiteral = HashLiteral;
