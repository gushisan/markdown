# ts高级特性
# Partial
`Partial` 译为 部分的/局部的/不完全的, 作用是将一个接口的所有参数变为非必填
### ts中的声明
```ts
/**
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### 用法示例
```ts
type Person = {
  name: string;
  age: number;
}

// 直接使用初始化所有参数都是必填
let tom:Person = {
    name: 'tom',
    age: 20
};


// 使用Partial将Person中所有的参数变为非必填
type PartialPerson = Partial<Person>;

let partialPerson: PartialPerson = {
  name: 'tom'
};
```

### 特殊的情况
```ts
type Person = {
  name: string;
  age: number;
  contact: {
    email: string;
    phone: number;
    wechat: string;
  }
}

type PartialPerson = Partial<Person>;

// 可以看出来 第一层属性都变成了非必填  第二层都没变
let partialPerson: PartialPerson = {
  name: 'tom',
  contact: { // error
    email: 'goodboyb@qq.com'
  }
};


// 再来看看ts内部类型的定义
/**
 * Make all properties in T optional
 */
type Partial<T> = {
    [P in keyof T]?: T[P];
};
// 可以看出来并没有考虑内层


// 稍微改造一下
/**
 * Make all properties in T optional
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Object ? DeepPartial<T[P]> : T[P];
}

// 现在针对那种特殊情况就能处理了
```

# Record
`Record` 译为 记录/记载, 作用是将一个类型的所有属性值都映射到另一个类型上并创造一个新的类型

### ts中的声明
```ts
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```
看类型的定义就可以看出来，将K中的每个属性([P in K]),都转为T类型, K可以是联合类型、对象、枚举…
```ts
type petsGroup = 'dog' | 'cat' | 'fish';

type numOrStr = number | string;

type IPets = Record<petsGroup, numOrStr>;

// type IPets = {
//     dog: numOrStr;
//     cat: numOrStr;
//     fish: numOrStr;
// }
```
# Pick
`Pick`译为挑选/选择, 作用是从一个复合类型中，取出几个想要的类型的组合一个新的类型
### ts中的声明
```ts
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```
`K extends keyof T`的作用是约束K的key在T的key中，不能超出这个范围，否则会报错的
## `keyof`
 - keyof 用于获取某种类型的所有键，其返回类型是联合类型
```ts
// keyof 用于获取某种类型的所有键，其返回类型是联合类型
interface B {
  id: number;
  name: string;
  age: number;
}

type B1 = keyof B;
// type B1 = "id" | "name" | "age"
```
## `extends`
这里的extends并不是用来继承的， 而是用来限制类型
```ts
// 对象extends
type T = {
  id: number;
  name: string;
}

type K = {
  id: number;
}
type IType = K extends T ? K : T;
// type IType = {
//     id: number;
//     name: string;
// }
// 此处 K extends T 限制K中必须有T的所有属性, 通俗点说就是T必须是K的子集


// 联合类型extends
type T = "id" | "name";
type K = "id";
type IType = K extends T ? K : T;
// type IType = "id"
// 此处限制为K必须包含于T，通俗点说就是K是T的子集
```
使用`Pick`挑选属性组成新的类型
```ts
interface B {
  id: number;
  name: string;
  age: number;
}

type PickB = Pick<B, "id" | "name">;

// type PickB = {
//     id: number;
//     name: string;
// }
```

# Exclude
`Exclude` 译为排除/不包括, `Exclude<T, U>` 表示从T中排除那些可分配给U的类型, 简单点说就是将 T 中某些属于 U 的类型移除掉。也可理解为取补集

ts中的声明
```ts
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;
```
例
```ts
// 例子1
type T = {
  name: string
  age: number
}

type U = {
  name: string
}

type IType = Exclude<keyof T, keyof U>
// type IType = "age"

type T0 = Exclude<"a" | "b" | "c", "a" | "b">
// type T0 = "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b" | 's'>
// type T1 = "c"
```

# Extract
`Extract` 译为提取,  `Extract<T, U>`从T中提取那些可分配给U的类型, 简单点说就是提取T中，U也有的元素，也可理解为取交集

ts中的定义
```ts
/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never;
```
例
```ts
type T0 = Extract<"a" | "b" | "c", "a" | "f">
// type T0 = "a"

type T = {
  name: string
  age: number
}

type U = {
  name: string
}

type IType = Extract<keyof T, keyof U>
// type IType = "name"
```

# ConstructorParameters
`ConstructorParameters` 译为构造函数参数, 获取元组中构造函数类型的参数

ts中的声明
```ts
/**
 * Obtain the parameters of a constructor function type in a tuple
 */
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;

```

可以用来获取类的参数类型组成的元组类型
```ts
class People {
  name: string
  age: number

  constructor(name: string) {
    this.name = name;
  }
}


type IType = ConstructorParameters<typeof People>
// type IType = [name: string]
// 注意这里typeof操作是取类型的作用
```

## `infer`
表示在 extends 条件语句中待推断的类型变量
```ts
// 例子1
// 若T是Array类型，则返回T的泛型，否则返回never类型
type Union<T> = T extends Array<infer U> ? U: never

type a = {
  name: string
}

type b = string[]


type c  = Union<b>
// type c = string
type d = Union<a>
// type d = never


// 例子2
// 若T满足(param: infer P) => any，则返回函数入参的类型，否则直接返回T
type ParamType<T> = T extends (param: infer P) => any ? P: T;
 
interface IDog {
    name: string;
    age:number;
}
 
type Func = (dog:IDog) => void;
 
type Param = ParamType<Func>; // IDog
type TypeString = ParamType<string> //string
```

理解了`infer` 我们在回来看ts中`ConstructorParameters` 的声明
```ts
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;

// T extends new (...args: any) => any 首先给T加了个约束 必须满足new (...args: any) => any 也就是说T必须是构造函数类型

// T extends new (...args: infer P) => any ? P : never
// T若满足new (...args: any) => any 则返回所有入参的类型, 否则返回never
```

# InstanceType
`InstanceType` 译为实例类型， 用来获取构造函数的返回类型

ts中的定义
```ts
/**
 * Obtain the return type of a constructor function type
 */
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;
```
例
```ts
class People {
  name: string
  age: number

  constructor(name: string) {
    this.name = name;
  }
}

type IType = InstanceType<typeof People>
// type IType = People
// 因为constructor默认返回this
// constructor People(name: string): People
```

# NonNullable
`NonNullable` 译为不可为空， `NonNullable<T>`从T中排除null和undefined

ts 中的定义
```ts
/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T extends null | undefined ? never : T;

```
例
```ts
type example = NonNullable<string | number | undefined>
// type example = string | number
```

# Parameters & ReturnType
- `Parameters` 用来获取函数参数的类型，


ts中的定义
```ts
/**
 * Obtain the parameters of a function type in a tuple
 */
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

例
```ts
type IFoo = (
  uname: string,
  uage: number
) => {
  name: string;
  age: number;
};
//参数类型
type Ibar = Parameters<IFoo>;
// type Ibar = [uname: string, uage: number]
type T0 = ReturnType<IFoo>;
// type T0 = {
//     name: string;
//     age: number;
// }
```
