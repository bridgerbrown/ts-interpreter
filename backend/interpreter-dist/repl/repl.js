"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startInterpreter = void 0;
const evaluator_1 = require("../evaluator/evaluator");
const lexer_1 = require("../lexer/lexer");
const environment_1 = require("../object/environment");
const parser_1 = require("../parser/parser");
const prompt = '>> ';
function printParserErrors(errors) {
    console.log(monkeyFaceAscii);
    console.log("Whoops! We ran into some monkey business here!\n");
    console.log(" parser errors:\n");
    for (const message of errors) {
        console.log(`\t${message}\n`);
    }
}
const monkeyFaceAscii = String.raw `
          __,__
  .--.  .-"    "-.  .--.
 //..\\// .-..-. \\//..\\
|||| '||//  Y   \\||'|| ||
||\\  \\\\0 | 0// // // ||
\\ '- ,\\-""""""-//, -'//
 ''-'  //  ^  ^  \\ '-''
      || \\_  _.// ||
      \\  \\'~'// //
       '._ '-=-'_.' 
          '----'
`;
/*
export function startRepl(): void {
  const env = new Environment();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt(prompt);
  rl.prompt();

  rl.on("line", (line: string) => {
    const lexer = new Lexer(line);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    if (parser.errors.length !== 0) {
      printParserErrors(parser.errors)
    }
    const evaluated = evaluate(program, env);
    if (evaluated !== null) {
      process.stdout.write(evaluated.inspect() + '\n');
    }

    rl.prompt();
  }).on("close", () => {
    process.exit(0);
  });
}
*/
function startInterpreter(line) {
    try {
        const env = new environment_1.Environment();
        const lexer = new lexer_1.Lexer(line);
        const parser = new parser_1.Parser(lexer);
        const program = parser.parseProgram();
        const evaluated = (0, evaluator_1.evaluate)(program, env);
        if (evaluated !== null) {
            return evaluated.inspect();
        }
        if (parser.errors.length !== 0) {
            return parserErrors(parser.errors);
        }
    }
    catch (error) {
        return error.toString();
    }
    return "";
}
exports.startInterpreter = startInterpreter;
function parserErrors(errors) {
    const messages = [];
    messages.push("Interpreter error:");
    messages.push(" parser errors:");
    for (const message of errors) {
        messages.push(`\t${message}`);
    }
    return messages.join('\n');
}
