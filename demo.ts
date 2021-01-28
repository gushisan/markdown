// function isEqual <T extends object, K extends object>
// (
// obj1: T, 
// obj2: K, 
// fields: Array<Extract<keyof T, keyof K>>
// ) {
//   return fields.every((field) => obj1[field] != obj2[field]);
// }

// isEqual({a: '1', b: '2'}, {a: '2'}, ['a'])
