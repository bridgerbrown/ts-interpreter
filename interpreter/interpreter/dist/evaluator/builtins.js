import { ArrayVal, BuiltIn, IntegerVal, StringVal } from "../object/object";
import { newError } from "./evaluator";
export const builtins = {
    "len": new BuiltIn((...args) => {
        if (args.length !== 1) {
            return newError(`wrong number of arguments. got=${args.length}, want=1`);
        }
        const arg = args[0];
        switch (true) {
            case (arg instanceof StringVal):
                return new IntegerVal((arg.inspect()).length);
            case (arg instanceof ArrayVal):
                return new IntegerVal((arg.elements).length);
            default:
                return newError(`argument to 'len' not supported, got ${args[0]?.type()}`);
        }
    }),
    "push": new BuiltIn((...args) => {
        if (args.length !== 2) {
            return newError(`wrong number of arguments. got=${args.length} want=2`);
        }
        if (args[0] && args[0].type() !== "ARRAY" /* Objects.Array_Obj */) {
            return newError(`argument to 'push' must be ARRAY, got ${args[0].type()}`);
        }
        const arr = args[0];
        const newElements = [...arr.elements, args[1]];
        return new ArrayVal(newElements);
    }),
    "prnt": new BuiltIn((...args) => {
        for (const arg of args) {
            arg ? console.log(arg.inspect()) : console.log("");
        }
        return null;
    })
};
