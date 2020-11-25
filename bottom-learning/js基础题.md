# js基础题
## 1、请写出如下输出值，并写出把注释调的代码取消注释的值，并解释为什么?
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

1. 先执行init，this指向window，输出20
2. 执行完init返回函数go， 然后实例化再执行，输出this.a，先在自己身上找没有a，然后在上原型链上找 a = 50， 输出50
3. 注意没有new 不会上原型链上去找，但是值可以加上去
4. 找的顺序是 先在自己身上找 没有再到原型链上去找

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

1. 执行init，同上，输出20
2. p()执行， `this.a = 60` ，这里的this还是指向window，所以window.a = 60，这里输出60
3. 这里再去执行init，输出this.a ，去window上找，输出60
4. 此时实例化过后的go，本身的属性上a=60，`__proto__` 上a=50，优先找自身上的属性，故输出60

## 上面涉及到this指向的问题，这里总结一下
### 首先看普通函数的this
```js
function f1() {
    console.log(this);
}

var obj={
    x:10,
    fn: f1
}

f1(); // window
obj.fn(); // {x: 10, fn: ƒ}
new f1() // f1 {}
f1.call(obj) // {x: 10, fn: ƒ}
f1.apply(obj) // {x: 10, fn: ƒ}
f1.bind(obj)() // {x: 10, fn: ƒ}
```
从以上代码不难看出
1. 普通函数this指向调用此函数的对象
2. 如果函数用作构造函数，那么this指向构造函数创建的对象实例
3. 可以通过call、apply、bind来改变this指向


### 再来看看箭头函数
```js
var f1 = () => {
    console.log(this);
}

var obj={
    x:10,
    fn: f1
}

f1(); // window
obj.fn(); // Window
f1.call(obj) // Window
f1.apply(obj) // Window
f1.bind(obj)() // Window
```
结论：

1. 箭头函数本身没有this，但是在它声明时可以捕获别人的this供自己使用
2. 箭头函数中的this是在它声明时捕获它所处作用域中的this
3. this一旦被捕获，以后将不再变化，即时是用call、apply、bind这样的方法也改变不了
4. 注意这里相比上面普通函数少了一个实例化，是因为箭头函数无法被实例化

## 2、请写出如下点击li的输出值，并用三种办法正确输出li里的数字
```html
<ul>
 <li>1</li>
 <li>2</li>
 <li>3</li>
 <li>4</li>
 <li>5</li>
 <li>6</li>
 </ul>

 <script type="text/javascript">
	var list_li = document.getElementsByTagName("li");
	for (var i = 0; i < list_li.length; i++) {
		list_li[i].onclick = function() {
			console.log(i);
		}
	}
 </script>
 <!-- 不管点击哪个都是输出6 -->
```

### 解法1，使用this
因为function的this指向当前调用它的对象，所以this就是当前的dom
```js
var list_li = document.getElementsByTagName("li");
for (var i = 0; i < list_li.length; i++) {
	list_li[i].onclick = function() {
		console.log(this.innerHTML);
	}
}
```
### 解法2，使用let
因为let存在块级作用域
```js
var list_li = document.getElementsByTagName("li");
for (let i = 0; i < list_li.length; i++) {
	list_li[i].onclick = function() {
		console.log(i + 1);
	}
}
```

### 解法3，使用立即执行函数
立即执行函数有自己的作用域，并且执行后会销毁
```js
var list_li = document.getElementsByTagName("li");
for (var i = 0; i < list_li.length; i++) {
	(function(i) {
		list_li[i].onclick = function() {
			console.log(i + 1);
		}
	})(i)
}
```

## 3、写出输出值，并解释为什么
代码段1
```js
function test(m) {
	m = {
		v: 5
	}
}
var m = {
	k: 30
};

test(m);
alert(m.v);
// undefined
```
代码段2
```js
function test(m) {
	m.xxx = {
		v: 5
	}
}
var m = {
	k: 30
};

test(m);
console.log(m)
// {k: 30, xxx: {…}}
```
解析：

先说代码段1，这里`test(m)`将对象m传入函数test本质上是引用传递，内部执行的`m = { v: 5 }`将内部的m进行了重写，此时内部m和外部m不再有关联。
```js
// 例如
var a = {
    qq: 25
};
var b = a;

b = {
    x: 11
};

console.log(a); // {qq: 25}
console.log(b); // {xx: 11}
```

代码段2，`test(m)`是引用传递，故本质上内部m和外部m指向的是同一个地址，其中一个改变另一个也会跟着改变

##  4、请写出输出值，并解释为什么。
```js
function yd() {
    console.log(1);
}

(function () {
    if (false) {
        function yd() {
            console.log(2);
        }
    }

    yd();
})();

// yd is not a function
```
立即执行函数内部，yd函数声明被提升，但是函数体未被提升出来，这里立即执行函数内部yd为undefined

函数体在if中无法被提升，且if内的内容在执行时也未执行，故输出`yd is not a function`

## 5、 请用一句话算出0-100之间学生的学生等级，如90-100为一等生、80-90为二等生，以此类推。

```js
10 - parseInt(分数/10);
```

## 6、请用一句话遍历变量a。禁止使用for, 已知var a = "abc";
```js
var a = "abc";
// 请用一句话遍历变量a，禁止使用for。

// 解法一:
console.log(...new Set(a));

// 解法二:
console.log(Array.from(a));

// 解法三:
console.log(Array.prototype.slice.call(a));
```

## 7、写出如下代码执行结果，并解释为什么

```js
var length = 10; 
function fn() { 
	console.log(this.length); 
} 
var yd = { 
	length: 5, 
	method: function(fn) { 
		fn(); 
		arguments[0](); 
	} 
}; 
yd.method(fn, 1);
// undefined 2
// this指向问题
```

## 8.输出值是什么，为什么
```js
console.log(a);
console.log(typeof yideng(a));

var flag = true;

if (!flag) {
  var a = 1;
}

if (flag) {
  function yideng(a) {
    yideng = a;
    console.log("yideng1");
  }
} else {
  function yideng(a) {
    yideng = a;
    console.log("yideng2");
  }
}
// undefined
// yideng is not a function
// 预编译 if里面函数声明无法提升
```

## 9.请写出如下输出值，并完成附加题的作答
```js
function fn(){
  console.log(this.length);
}

var yideng = {
  length:5,
  method:function() {
    "use strict";
    fn();
    arguments[0]()
  }
}
const result = yideng.method.bind(null);
result(fn,1);
// 0 2
// this指向问题 this软绑硬绑 严格模式

```
```js
// 软绑硬绑解释

// 软绑
function fn(){
  console.log(this.length);
}

const res = fn.bind(null)
res();
// 0 this 指向window

// 硬绑
function fn(){
  console.log(this.length);
}

const res = fn.bind({})
res();
// undefined this 指向{}
```
也就是说this绑定null不生效

附加题
```js
function yideng(a,b,c){
  console.log(this.length); 
  console.log(this.callee.length); 
}

function fn(d){
  arguments[0](10,20,30,40,50);
}

fn(yideng,10,20,30);
// 4 1
// this指向问题 this指向fn的arguments，arguments.callee指向当前arguments指向的函数，this.callee => fn , length就是形参的个数
```

10.请问变量a会被GC回收么，为什么呢？
```js
function test(){
  var a = "yideng";
  return function(){
    eval("");
  }
}
test()();
```