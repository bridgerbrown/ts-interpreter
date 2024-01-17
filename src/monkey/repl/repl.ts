import { Token, Lexer } from "../lexer/lexer";
import readline from "readline";

export const repl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

repl.on("line", (input) => {
  const tokenizer = new Lexer(input);
  while (true) {
    const token = tokenizer.nextToken();
    console.log(token);
    if (token.type === "EOF") {
      break;
    }
  }
});
