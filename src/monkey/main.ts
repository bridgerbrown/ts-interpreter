import { repl } from "./repl/repl";

async function main() {
  try {
    console.log("Hello! This is the Monkey programming language!");
    console.log("Feel free to type in commands!");
    repl.prompt();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
