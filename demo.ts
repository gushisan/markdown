// type NonNullable<T> = T & {};

type dd = {
  name: string
  age: number
}


type s = NonNullable<string>

let str: NonNullable<string> = ''

str = null;

str = undefined;

console.log(str)
