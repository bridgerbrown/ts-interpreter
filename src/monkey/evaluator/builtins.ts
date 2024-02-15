import { BuiltIn, ErrorVal, IntegerVal, Object, StringVal } from "../object/object";
import { newError, primitives } from "./evaluator";

export const builtins: Record<string, BuiltIn> = {
  "len": new BuiltIn((...args: (Object | null)[]): Object | ErrorVal | null => {
      if (args.length !== 1) {
        return newError(`wrong number of arguments. got=${args.length}, want=1`);
      }
      const arg = args[0] as Object;
      switch (true) {
        case (arg instanceof StringVal):
          return new IntegerVal((arg.value).length);
        default:
          return newError(`argument to 'len' not supported, got ${args[0]?.type()}`)
      }
    }
  ),
}
