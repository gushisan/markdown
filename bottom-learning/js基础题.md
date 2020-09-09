# js基础题
## 题目1、请写出如下输出值，并写出把注释调的代码取消注释的值，并解释为什么?
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

## 题目2、请写出如下点击li的输出值，并用三种办法正确输出li里的数字
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



