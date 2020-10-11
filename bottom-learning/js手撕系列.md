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

## 类数组转化为数组
类数组是具有length属性，但不具有数组原型上的方法。常见的类数组有arguments、DOM操作方法返回的结果。

### 方法1：Array.from
`Array.from()` 方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。
```js
Array.from(document.querySelectorAll('div'))
```

### 方法2：Array.prototype.slice.call()
```js
Array.prototype.slice.call(document.querySelectorAll('div'))
```

### 方法3：...运算符
```js
[...document.querySelectorAll('div')]
```

### 方法4：利用concat
```js
Array.prototype.concat.apply([], document.querySelectorAll('div'));
```
