import { BlockStatement, Identifier } from "../ast/ast";
import { Environment } from "./environment";

type ObjectType = string;

const enum Objects {
  Integer_Obj = "INTEGER",
  Boolean_Obj = "BOOLEAN",
  Null_Obj = "NULL",
  Return_Value_Obj = "RETURN_VALUE",
  Error_Obj = "ERROR",
  Function_Obj = "FUNCTION",
  String_Obj = "STRING"
}

interface Object {
  type(): ObjectType;
  inspect(): string;
}

class IntegerVal {
  public value: number;
  constructor(value: number) {
    this.value = value;
  }

  type(): ObjectType { return Objects.Integer_Obj; }
  inspect(): string { return this.value.toString(); }
}

class BooleanVal {
  public value: boolean;
  constructor(value: boolean) {
    this.value = value;
  }

  type(): ObjectType { return Objects.Boolean_Obj; }
  inspect(): string { return this.value.toString(); }
}

class NullVal {
  type(): ObjectType { return Objects.Null_Obj; }
  inspect(): string { return "null"; }
}

class ReturnVal {
  public value: Object | null;
  constructor(value: Object | null) {
    this.value = value;
  }
  type(): ObjectType { return Objects.Return_Value_Obj; }
  inspect(): string { 
    if (this.value) {
      return this.value.toString()
    }
    return "";
  }
}

class ErrorVal {
  message: string;
  constructor(message: string) {
    this.message = message;
  }

  type(): ObjectType { return Objects.Error_Obj; }
  inspect(): string { return "ERROR: " + this.message; }
}

class FunctionVal {
  parameters: Identifier[] | null;
  body: BlockStatement | null
  env: Environment | null;
  constructor(parameters: Identifier[] | null, body: BlockStatement | null, env: Environment | null) {
    this.parameters = parameters;
    this.body = body;
    this.env = env;
  }

  type(): ObjectType { return Objects.Function_Obj; }
  inspect(): string { 
    let strs = [];
    if (this.parameters) {
      for (let p of this.parameters) strs.push(p);
    }
    return `fn(${strs.join(", ")}) {\n${this.body}\n}`
  }
}

class StringVal {
  value: string;
  constructor(value: string) {
    this.value = value;
  }

  type(): ObjectType { return Objects.String_Obj; }
  inspect(): string { return this.value; }
}

export { Object, Objects, IntegerVal, BooleanVal, NullVal, ReturnVal, ErrorVal, FunctionVal, StringVal };
