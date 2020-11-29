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