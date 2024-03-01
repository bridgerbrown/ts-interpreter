// import { startRepl } from "./repl/repl";
export async function main() {
    try {
        console.log("Hello! This is the Monkey programming language!");
        console.log("Feel free to type in commands!");
        // startRepl();
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
main();
