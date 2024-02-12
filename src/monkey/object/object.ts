
type ObjectType = string;

const enum Objects {
  Integer_Obj = "INTEGER",
  Boolean_Obj = "BOOLEAN",
  Null_Obj = "NULL",
  Return_Value_Obj = "RETURN_VALUE"
}

interface Object {
  type(): ObjectType;
  inspect(obj: Object): string;
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

export { Object, Objects, IntegerVal, BooleanVal, NullVal, ReturnVal };
