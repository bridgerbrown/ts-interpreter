
type ObjectType = string;

const enum Objects {
  Integer_Obj = "INTEGER",
  Boolean_Obj = "BOOLEAN",
  Null_Obj = "NULL"
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

export { Object, Objects, IntegerVal, BooleanVal, NullVal };
