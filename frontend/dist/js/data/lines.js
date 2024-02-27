export const randomStmt = [
  'let',
  'function',
  'len',
  'array',
  'math',
  'boolean',
  'if'
]

export const mathStmt = [
  'x + -x * x',
  'x + x * x / x',
  '-x / x - x',
  'x / -x * x',
  'x + x * x - x',
  '-x + x / x - x + x * x',
  '(x + x * x + x / x) * x + -x',
  'x * (x * x) + x'
]

export const booleanStmt = [
  'x < x',
  'x > x',
  'x != x',
  '1 != 1',
  'true != false',
  '(x < x) == true',
  '(x < x) == false',
  '(x > x) == true',
  '(x < x) == false'
]

export const ifStmt = [
  'if (x < x) { 10 } else { x }',
  'if (x > x) { 10 } else { x }'
]

export const letStmt = [
  'let a = x * x; x;',
  'let a = x; let b = a; b;',
  'let a = x; let b = a; let c = a + b + 5; c;'
]

export const functionStmt = [
  'let identity = fn(y) { y * 5; }; identity(x);',
  'let double = fn(y) { y * 2; }; double(x);',
  'let add = fn(y, z) { y + z; }; add(x, x);',
  'let add = fn(y, z) { y + z; }; add(5 + x, add(5, 5));'
]

export const lenStmt = [
  'len("four")',
  'len("hello")',
  'len("interpreter")',
  'len("testing")'
]

export const arrayStmt = [
  '[1, 2, 3][0]',
  '[1, 2, 3][1]',
  'let myArray = [1, 2, 3]; myArray[2];',
  'let myArray = [1, 2, 3]; myArray[1];',
  'let myArray = [1, 2, 3]; myArray[0] + myArray[1] + myArray[2];',
  'let myArray = [1, 2, 3]; myArray[0] * myArray[1] + myArray[2];'
]