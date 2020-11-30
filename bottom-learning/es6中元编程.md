# es6中元编程

何为元编程？

「编写能改变语言语法特性或者运行时特性的程序」。换言之，一种语言本来做不到的事情，通过你编程来修改它，使得它可以做到了，这就是元编程。

meta-programming元编程中的 元 的概念可以理解为 程序 本身。”元编程能让你拥有可以扩展程序自身能力

举个例子：
```js
if (a == 1 && a == 2 && a == 3) {
    console.log("done");
}
```
怎样才能让这个条件满足，输出done。按照正常的逻辑是无法完成的，毕竟一个值不可能同时满足等于1、2、3

这是就可以用到元编程来改变这个不可能

```js
let a = {
    [Symbol.toPrimitive]: ((i) => () => ++i)(0)
}

if (a == 1 && a == 2 && a == 3) {
    console.log("done");
}
// done
```
`Symbol.toPrimitive`在对象转换为原始值的时候会被调用，初始值为1，调用一次+1，就可以满足`a == 1 && a == 2 && a == 3`，同时`Symbol.toPrimitive`也可以接受一个参数hint，hint的取值为number、string、default
```js
let obj = {
    [Symbol.toPrimitive](hint) {
        switch (hint) {
            case "number":
                return 123;
            case "string":
                return "str";
            case "default":
                return "default";
        }
    }
}
console.log(1-obj); // -122
console.log(1+obj); // 1default
console.log(`${obj}`); // str
```

## 还有哪些元编程？
### proxy
es5的Object.defineProperty()方法的es6升级版,用于自定义的对象的行为
```js
let leon = {
    age: 30
}
const validator = {
    get: function(target, key){
        // 若没这个属性返回37
        return key in target ? target[key] : 37;
    },
    set(target,key,value){
        if(typeof value!="number" || Number.isNaN(value)){
            throw new Error("年龄得是数字");
        }
    }
}
const proxy = new Proxy(leon,validator);
console.log(proxy.name);
// 37
proxy.age = "hi";
// Error: 年龄得是数字
```
### reflect-metadata
你可以通过装饰器来给类添加一些自定义的信息。然后通过反射将这些信息提取出来。当然你也可以通过反射来添加这些信息
```js
require("reflect-metadata")
class C {
    // @Reflect.metadata(metadataKey, metadataValue)
    method() {
    }
}
Reflect.defineMetadata("name", "jix", C.prototype, "method");

let metadataValue = Reflect.getMetadata("name", C.prototype, "method");
console.log(metadataValue);
// jix
```

## 应用
### 拓展数组索引访问
负索引访问，使`array[-N]` 与 `array[array.length - N]` 相同
```js
let array = [1, 2, 3];

array = new Proxy(array, {
  get(target, prop, receiver) {
    if (prop < 0) {
      console.log(prop, 'prop')
      prop = +prop + target.length;
    }
    return Reflect.get(target, prop, receiver);
  }
});


console.log(array[-1]); // 3
console.log(array[-2]); // 2
```
### 数据劫持
```js
let handlers = Symbol('handlers');

function makeObservable(target) {
  // 初始化存储 handler 的数组
  target[handlers] = [];

  // 存储 handler 函数到数组中以便于未来调用
  target.observe = function(handler) {
    this[handlers].push(handler);
  };

  // 创建代理以处理更改
  return new Proxy(target, {
    set(target, property, value, receiver) {
      // 转发写入操作到目标对象
      let success = Reflect.set(...arguments);
      // 如果设置属性的时候没有报错
      if (success) {
        // 调用所有 handler
        target[handlers].forEach(handler => handler(property, value));
      }
      return success;
    }
  });
}

let user = {};

user = makeObservable(user);

user.observe((key, value) => {
  console.log(`SET ${key}=${value}`);
});

user.name = "John";
// SET name=John
```