import { ArrayVal, BuiltIn, ErrorVal, IntegerVal, Object, Objects, StringVal } from "../object/object";
import { newError, primitives } from "./evaluator";

export const builtins: Record<string, BuiltIn> = {
  "len": new BuiltIn((...args: (Object | null)[]): Object | ErrorVal | null => {
      if (args.length !== 1) {
        return newError(`wrong number of arguments. got=${args.length}, want=1`);
      }
      const arg = args[0] as Object;
      switch (true) {
        case (arg instanceof StringVal):
          return new IntegerVal((arg.inspect()).length);
        case (arg instanceof ArrayVal):
          return new IntegerVal(((arg as ArrayVal).elements).length);
        default:
          return newError(`argument to 'len' not supported, got ${args[0]?.type()}`)
      }
    }
  ),
  "push": new BuiltIn((...args: (Object | null)[]): Object | ErrorVal | null => {
    if (args.length !== 2) {
      return newError(`wrong number of arguments. got=${args.length} want=2`);
    }
    if (args[0] && args[0].type() !== Objects.Array_Obj) {
      return newError(`argument to 'push' must be ARRAY, got ${args[0].type()}`);
    }
    const arr = args[0] as ArrayVal;
    const newElements = [...arr.elements, args[1]];
    
    return new ArrayVal(newElements);
  }),
}
