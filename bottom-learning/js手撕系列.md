# js手撕系列
## 1.数组扁平化
数组扁平化是指将一个多维数组变为一个一维数组
```js
const arr = [1, [2, [3, [4, 5]]], 6];
// => [1, 2, 3, 4, 5, 6]
```

### 方法1：使用flat()
```js
const res1 = arr.flat(Infinity);
// [1, 2, 3, 4, 5, 6]
```
flat() 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

使用 Infinity 作为深度，展开任意深度的嵌套数组

本质上就是是归纳（reduce） 与 合并（concat）的操作

### 方法2：使用正则
```js
const res2 = JSON.stringify(arr).replace(/\[|\]/g, '').split(',');
// ["1", "2", "3", "4", "5", "6"]
// 这么写不够严谨， 可以看到原数组中是number，转完以后是string

// 优化版本
const res3 = JSON.parse('[' + JSON.stringify(arr).replace(/\[|\]/g, '') + ']');
// [1, 2, 3, 4, 5, 6]
```

### 方法3：使用reduce
```js
const flatten = arr => {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
  }, [])
}
const res4 = flatten(arr);
```

### 方法4：函数递归
```js
const res5 = [];
const fn = arr => {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      fn(arr[i]);
    } else {
      res5.push(arr[i]);
    }
  }
}
fn(arr);
```

方法3和方法4思路相似，遍历判断递归

## 2.数组去重
```js
const arr = [1, 1, '1', 17, true, true, false, false, 'true', 'a', {}, {}];
// => [1, '1', 17, true, false, 'true', 'a', {}, {}]
```

### 方法1：set
利用set特性 实现去重
```js
const res1 = Array.from(new Set(arr));
```

### 方法2：循环判断
```js
const unique2 = arr => {
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    if (res.indexOf(arr[i]) === -1) res.push(arr[i]);
  }
  return res;
}
```

### 方法3：filter
```js
const unique3 = arr => {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index;
  });
}
```
### 方法4：Map
```js
const unique4 = arr => {
  const map = new Map();
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    if (!map.has(arr[i])) {
      map.set(arr[i], true)
      res.push(arr[i]);
    }
  }
  return res;
}
```

## 3.类数组转化为数组
类数组是具有length属性，但不具有数组原型上的方法。常见的类数组有arguments、DOM操作方法返回的结果。

### 方法1：Array.from
`Array.from()` 方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。
```js
Array.from(document.querySelectorAll('div'))
```

### 方法2：Array.prototype.slice.call()
`Array.prototype.slice.call()`能将具有length属性的对象转成数组

类数组不是真的数组，没有数组上的方法，直接调用slice会报错

调用原型上的slice方法会将类数组转为数组，在进行截取操作
```js
Array.prototype.slice.call(document.querySelectorAll('div'))
```

### 方法3：...运算符
es6 ...运算符可直接展开
```js
[...document.querySelectorAll('div')]
```

### 方法4：利用concat
```js
Array.prototype.concat.apply([], document.querySelectorAll('div'));
```

## 4.Array.prototype.filter()
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/804ee51d522746c3b219548d038413c2~tplv-k3u1fbpfcp-zoom-1.image)
```js
Array.prototype.filter = function(callback, thisArg) {
  if (this == undefined) {
    throw new TypeError('this is null or not undefined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError(callback + 'is not a function');
  }
  const res = [];
  // 让O成为回调函数的对象传递（强制转换对象）
  const O = Object(this);
  // >>>0 保证len为number，且为正整数
  const len = O.length >>> 0;
  for (let i = 0; i < len; i++) {
    // 检查i是否在O的属性（会检查原型链）
    if (i in O) {
      // 回调函数调用传参
      if (callback.call(thisArg, O[i], i, O)) {
        res.push(O[i]);
      }
    }
  }
  return res;
}
```

## 5.Array.prototype.map()
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b099cf3e06bc4421abac4dc460a13c17~tplv-k3u1fbpfcp-zoom-1.image)
```js
Array.prototype.map = function(callback, thisArg) {
  if (this == undefined) {
    throw new TypeError('this is null or not defined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  const res = [];
  // 同理
  const O = Object(this);
  const len = O.length >>> 0;
  for (let i = 0; i < len; i++) {
    if (i in O) {
      // 调用回调函数并传入新数组
      res[i] = callback.call(thisArg, O[i], i, this);
    }
  }
  return res;
}
```

## 6.Array.prototype.forEach()
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c3819fb0c404ae5a8f4cddc4e80731e~tplv-k3u1fbpfcp-zoom-1.image)
```js
Array.prototype.forEach = function(callback, thisArg) {
  if (this == null) {
    throw new TypeError('this is null or not defined');
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + ' is not a function');
  }
  const O = Object(this);
  const len = O.length >>> 0;
  let k = 0;
  while (k < len) {
    if (k in O) {
      callback.call(thisArg, O[k], k, O);
    }
    k++;
  }
}
```
## 7.Array.prototype.reduce()
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e51625eb9e2d47799ff39c5956139af7~tplv-k3u1fbpfcp-zoom-1.image)
```js
Array.prototype.reduce = function(callback, initialValue) {
  if (this == undefined) {
    throw new TypeError('this is null or not defined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError(callbackfn + ' is not a function');
  }
  const O = Object(this);
  const len = this.length >>> 0;
  let accumulator = initialValue;
  let k = 0;
  // 如果第二个参数为undefined的情况下
  // 则数组的第一个有效值作为累加器的初始值
  if (accumulator === undefined) {
    while (k < len && !(k in O)) {
      k++;
    }
    // 如果超出数组界限还没有找到累加器的初始值，则TypeError
    if (k >= len) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    accumulator = O[k++];
  }
  while (k < len) {
    if (k in O) {
      accumulator = callback.call(undefined, accumulator, O[k], k, O);
    }
    k++;
  }
  return accumulator;
}
```
## 8.Function.prototype.apply()
```js
/// 第一个参数是绑定的this，默认为window，第二个参数是数组或类数组
Function.prototype.apply = function(context = window, args) {
  if (typeof this !== 'function') {
    throw new TypeError('Type Error');
  }
  const fn = Symbol('fn');
  context[fn] = this;

  const res = context[fn](...args);
  delete context[fn];
  return res;
}
```

## 9.Function.prototype.call
```js
// 和call唯一不同的是，call()方法接受的是一个参数列表
Function.prototype.call = function(context = window, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('Type Error');
  }
  const fn = Symbol('fn');
  context[fn] = this;

  const res = context[fn](...args);
  delete context[fn];
  return res;
}
```

## 10.Function.prototype.bind
```js
Function.prototype.bind = function(context, ...args) {
  if (typeof this !== 'function') {
    throw new Error("Type Error");
  }
  // 保存this的值
  var self = this;

  return function F() {
    // 考虑new的情况
    if(this instanceof F) {
      return new self(...args, ...arguments)
    }
    return self.apply(context, [...args, ...arguments])
  }
}
```

## 11.debounce（防抖）
触发高频时间后n秒内函数只会执行一次,如果n秒内高频时间再次触发,则重新计算时间。
```js
const debounce = (fn, time) => {
  let timeout = null;
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, time);
  }
};
```
防抖常应用于用户进行搜索输入节约请求资源，window触发resize事件时进行防抖只触发一次

## 12.throttle（节流）
```js
const throttle = (fn, time) => {
  let flag = true;
  return function() {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, arguments);
      flag = true;
    }, time);
  }
}
```
高频时间触发,但n秒内只会执行一次,所以节流会稀释函数的执行频率。

## 13.函数柯里化
```js
function add() {
  const _args = [...arguments];
  function fn() {
    _args.push(...arguments);
    return fn;
  }
  fn.toString = function() {
    return _args.reduce((sum, cur) => sum + cur);
  }
  return fn;
}
```
经典面试题：实现add(1)(2)(3)(4)=10; 、 add(1)(1,2,3)(2)=9;

## 14.模拟new操作
```js
function newOperator(ctor, ...args) {
  if (typeof ctor !== 'function') {
    throw new TypeError('Type Error');
  }
  const obj = Object.create(ctor.prototype);
  const res = ctor.apply(obj, args);

  const isObject = typeof res === 'object' && res !== null;
  const isFunction = typeof res === 'function';
  return isObject || isFunction ? res : obj;
}
```
- 以ctor.prototype为原型创建一个对象
- 执行构造函数并将this绑定到新创建的对象上
- 判断构造函数执行返回的结果是否是引用数据类型，若是则返回构造函数执行的结果，否则返回创建的对象

## 15.instanceof
instanceof运算符用于检测构造函数的prototype属性是否出现在某个实例对象的原型链上。


```js
const myInstanceof = (left, right) => {
  // 基本数据类型都返回false
  if (typeof left !== 'object' || left === null) return false;
  let proto = Object.getPrototypeOf(left);
  while (true) {
    if (proto === null) return false;
    if (proto === right.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}
```

## 16.原型继承
这里只写寄生组合继承了，中间还有几个演变过来的继承但都有一些缺陷
```js
function Parent() {
  this.name = 'parent';
}
function Child() {
  Parent.call(this);
  this.type = 'children';
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

## 17. Object.is
Object.is解决的主要是这两个问题：
```js
+0 === -0  // true
NaN === NaN // false
```

```js
const is= (x, y) => {
  if (x === y) {
    // +0和-0应该不相等
    return x !== 0 || y !== 0 || 1/x === 1/y;
  } else {
    return x !== x && y !== y;
  }
}
```

## 18. Object.assign
Object.assign()方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象（请注意这个操作是浅拷贝）
```js
Object.defineProperty(Object, 'assign', {
  value: function(target, ...args) {
    if (target == null) {
      return new TypeError('Cannot convert undefined or null to object');
    }
    
    // 目标对象需要统一是引用数据类型，若不是会自动转换
    const to = Object(target);

    for (let i = 0; i < args.length; i++) {
      // 每一个源对象
      const nextSource = args[i];
      if (nextSource !== null) {
        // 使用for...in和hasOwnProperty双重判断，确保只拿到本身的属性、方法（不包含继承的）
        for (const nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  },
  // 不可枚举
  enumerable: false,
  writable: true,
  configurable: true,
})
```

## 19.深拷贝
递归的完整版本（考虑到了Symbol属性）：

```js
const cloneDeep1 = (target, hash = new WeakMap()) => {
  // 对于传入参数处理
  if (typeof target !== 'object' || target === null) {
    return target;
  }
  // 哈希表中存在直接返回
  if (hash.has(target)) return hash.get(target);

  const cloneTarget = Array.isArray(target) ? [] : {};
  hash.set(target, cloneTarget);

  // 针对Symbol属性
  const symKeys = Object.getOwnPropertySymbols(target);
  if (symKeys.length) {
    symKeys.forEach(symKey => {
      if (typeof target[symKey] === 'object' && target[symKey] !== null) {
        cloneTarget[symKey] = cloneDeep1(target[symKey]);
      } else {
        cloneTarget[symKey] = target[symKey];
      }
    })
  }

  for (const i in target) {
    if (Object.prototype.hasOwnProperty.call(target, i)) {
      cloneTarget[i] =
        typeof target[i] === 'object' && target[i] !== null
        ? cloneDeep1(target[i], hash)
        : target[i];
    }
  }
  return cloneTarget;
}
```