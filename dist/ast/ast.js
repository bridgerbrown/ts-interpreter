"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallExpression = exports.FunctionLiteral = exports.BlockStatement = exports.IfExpression = exports.Boolean = exports.InfixExpression = exports.PrefixExpression = exports.ExpressionStatement = exports.IntegerLiteral = exports.Identifier = exports.ReturnStatement = exports.LetStatement = exports.Program = void 0;
var Program = /** @class */ (function () {
    function Program() {
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
        var out = "";
        for (var _i = 0, _a = this.statements; _i < _a.length; _i++) {
            var s = _a[_i];
            out += s.string();
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
    LetStatement.prototype.tokenLiteral = function () {
        return this.token.literal;
    };
    LetStatement.prototype.string = function () {
        var out = "";
        out += this.tokenLiteral() + " ";
        out += this.name ? this.name.string() : "";
        out += " = ";
        if (this.value !== null) {
            out += this.value.string();
        }
        out += ";";
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
    ReturnStatement.prototype.tokenLiteral = function () {
        return this.token.literal;
    };
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
    Identifier.prototype.tokenLiteral = function () {
        return this.token.literal;
    };
    Identifier.prototype.string = function () {
        return this.token.literal;
    };
    return Identifier;
}());
exports.Identifier = Identifier;
var IntegerLiteral = /** @class */ (function () {
    function IntegerLiteral(token) {
        this.value = 0;
        this.token = token;
    }
    IntegerLiteral.prototype.expressionNode = function () { };
    IntegerLiteral.prototype.tokenLiteral = function () {
        return this.token.literal;
    };
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
    ExpressionStatement.prototype.tokenLiteral = function () {
        return this.token.literal;
    };
    ExpressionStatement.prototype.string = function () {
        if (this.expression !== null) {
            return "".concat(this.expression.tokenLiteral());
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
    PrefixExpression.prototype.expressionNode = function () {
    };
    PrefixExpression.prototype.tokenLiteral = function () {
        return this.token.literal;
    };
    PrefixExpression.prototype.string = function () {
        var _a;
        return "(" + this.operator + ((_a = this.right) === null || _a === void 0 ? void 0 : _a.toString()) + ")";
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
    InfixExpression.prototype.expressionNode = function () {
    };
    InfixExpression.prototype.tokenLiteral = function () {
        return this.token.literal;
    };
    InfixExpression.prototype.string = function () {
        var _a;
        return "(" + this.left.toString() + " " + this.operator + " " + ((_a = this.right) === null || _a === void 0 ? void 0 : _a.toString()) + ")";
    };
    return InfixExpression;
}());
exports.InfixExpression = InfixExpression;
var Boolean = /** @class */ (function () {
    function Boolean(token, value) {
        this.token = token;
        this.value = value;
    }
    Boolean.prototype.expressionNode = function () {
    };
    Boolean.prototype.tokenLiteral = function () {
        return this.token.literal;
    };
    Boolean.prototype.string = function () {
        return this.token.literal;
    };
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
    IfExpression.prototype.expressionNode = function () {
    };
    IfExpression.prototype.tokenLiteral = function () {
        return this.token.literal;
    };
    IfExpression.prototype.string = function () {
        var _a, _b;
        var expression = "if" + ((_a = this.condition) === null || _a === void 0 ? void 0 : _a.string()) + " " + ((_b = this.consequence) === null || _b === void 0 ? void 0 : _b.string());
        if (this.alternative !== null) {
            expression += "else " + this.alternative.string();
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
    BlockStatement.prototype.statementNode = function () {
    };
    BlockStatement.prototype.tokenLiteral = function () {
        return this.token.literal;
    };
    BlockStatement.prototype.string = function () {
        var statements = "";
        for (var _i = 0, _a = this.statements; _i < _a.length; _i++) {
            var s = _a[_i];
            statements += s.string();
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
    FunctionLiteral.prototype.expressionNode = function () {
    };
    FunctionLiteral.prototype.tokenLiteral = function () {
        return this.token.literal;
    };
    FunctionLiteral.prototype.string = function () {
        var params = [];
        if (this.parameters) {
            for (var _i = 0, _a = this.parameters; _i < _a.length; _i++) {
                var p = _a[_i];
                params.push(p.string());
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
    CallExpression.prototype.expressionNode = function () {
    };
    CallExpression.prototype.tokenLiteral = function () {
        return this.token.literal;
    };
    CallExpression.prototype.string = function () {
        var args = [];
        if (this.args) {
            for (var _i = 0, _a = this.args; _i < _a.length; _i++) {
                var arg = _a[_i];
                args.push(arg === null || arg === void 0 ? void 0 : arg.string());
            }
            return this.fn.string() + "(" + this.args.join(", ") + ")";
        }
        return "";
    };
    return CallExpression;
}());
exports.CallExpression = CallExpression;
