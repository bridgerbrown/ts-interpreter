import { start } from "./repl/repl";
async function main() {
    try {
        console.log("Hello! This is the Monkey programming language!");
        console.log("Feel free to type in commands!");
        start();
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
main();
