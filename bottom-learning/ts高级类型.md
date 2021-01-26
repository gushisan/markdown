# ts高级类型
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
#### `keyof`
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
#### `extends`
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