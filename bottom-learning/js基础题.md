# js基础题
### 1、请写出如下输出值，并写出把注释调的代码取消注释的值，并解释为什么?
未取消注释:
```js
this.a = 20;

var test = {
    a: 40,
    
    init: ()=> {
        console.log(this.a);
        function go() {
            // this.a = 60

            console.log(this.a);
        }

        go.prototype.a = 50;

        return go;
    }
}

// var p = test.init();
// p();
new(test.init())();
// 20 50
```
解析：

1. 箭头函数没有自己的this，故this指向window，输出20
2. 执行完init返回函数go， 然后实例化再执行，输出this.a，现在自己身上找没有a，然后在上原型链上找 a = 50， 输出50
3. 注意没有new 不会上原型链上去找，但是值可以加上去
4. 找的顺序是 现在自己身上找 没有再到原型链上去找

取消注释:
```js
this.a = 20;

var test = {
    a: 40,
    
    init: ()=> {
        console.log(this.a);
        function go() {
            this.a = 60

            console.log(this.a);
        }

        go.prototype.a = 50;

        return go;
    }
}

var p = test.init();
p();
new(test.init())();
// 20 60 60 60
```
解析：

1. 同上，箭头函数没有自己的this，故指向window，输出20
2. 注意这里p()执行时， `this.a = 60` 其实是将window上的a改为了60


