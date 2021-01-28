function isEqual <T extends object, U extends object>
(
obj1: T, 
obj2: U,  
) {
  // Array<Extract<keyof T, keyof U>>
}

isEqual({a: '1', b: '2'}, {a: '2'})

// export function isEqual(obj1, obj2, fields ): boolean {
//   return fields.every((field) => obj1[field] === obj2[field]);
// }

// const s = isEqual({a:1},{a:2},['a']) //返回false

// console.log(s)
