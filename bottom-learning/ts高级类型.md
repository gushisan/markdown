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
看类型的定义就可以看出来，将K中的每个属性([P in K]),都转为T类型