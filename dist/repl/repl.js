"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var evaluator_1 = require("../evaluator/evaluator");
var lexer_1 = require("../lexer/lexer");
var environment_1 = require("../object/environment");
var parser_1 = require("../parser/parser");
var readline = require("node:readline/promises");
var prompt = '>> ';
function printParserErrors(errors) {
    var e_1, _a;
    console.log(monkeyFaceAscii);
    console.log("Whoops! We ran into some monkey business here!\n");
    console.log(" parser errors:\n");
    try {
        for (var errors_1 = __values(errors), errors_1_1 = errors_1.next(); !errors_1_1.done; errors_1_1 = errors_1.next()) {
            var message = errors_1_1.value;
            console.log("\t".concat(message, "\n"));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (errors_1_1 && !errors_1_1.done && (_a = errors_1.return)) _a.call(errors_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
var monkeyFaceAscii = String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n          __,__\n  .--.  .-\"    \"-.  .--.\n //..\\// .-..-. \\//..\\\n|||| '||//  Y   \\||'|| ||\n||\\  \\\\0 | 0// // // ||\n\\ '- ,\\-\"\"\"\"\"\"-//, -'//\n ''-'  //  ^  ^  \\ '-''\n      || \\_  _.// ||\n      \\  \\'~'// //\n       '._ '-=-'_.' \n          '----'\n"], ["\n          __,__\n  .--.  .-\"    \"-.  .--.\n //..\\\\// .-..-. \\\\//..\\\\\n|||| '||//  Y   \\\\||'|| ||\n||\\\\  \\\\\\\\0 | 0// // // ||\n\\\\ '- ,\\\\-\"\"\"\"\"\"-//, -'//\n ''-'  //  ^  ^  \\\\ '-''\n      || \\\\_  _.// ||\n      \\\\  \\\\'~'// //\n       '._ '-=-'_.' \n          '----'\n"])));
function start() {
    var env = new environment_1.Environment();
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.setPrompt(prompt);
    rl.prompt();
    rl.on("line", function (line) {
        var lexer = new lexer_1.Lexer(line);
        var parser = new parser_1.Parser(lexer);
        var program = parser.parseProgram();
        if (parser.errors.length !== 0) {
            printParserErrors(parser.errors);
        }
        var evaluated = (0, evaluator_1.evaluate)(program, env);
        if (evaluated !== null) {
            process.stdout.write(evaluated.inspect() + '\n');
        }
        rl.prompt();
    }).on("close", function () {
        process.exit(0);
    });
}
exports.start = start;
var templateObject_1;
