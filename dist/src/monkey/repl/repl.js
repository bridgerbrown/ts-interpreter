import { evaluate } from "../evaluator/evaluator";
import { Lexer } from "../lexer/lexer";
import { Environment } from "../object/environment";
import { Parser } from "../parser/parser";
import * as readline from 'node:readline/promises';
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
export function start() {
    const env = new Environment();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.setPrompt(prompt);
    rl.prompt();
    rl.on("line", (line) => {
        const lexer = new Lexer(line);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();
        if (parser.errors.length !== 0) {
            printParserErrors(parser.errors);
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
