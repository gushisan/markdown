# ES5基础巩固
## 预编译
> 预编译发生在函数执行的前一刻
```js
function fn(a) {
  console.log(a)
  var a = 123
  console.log(a)
  function a() {}
  console.log(a)
  var b = function() {}
  console.log(b)
  function d() {}
}

fn(1)
// 运行结果：
// [Function: a]
// 123
// 123
// [Function: b]
```
### 预编译四部曲
1. 创建AO对象
2. 找形参和变量声明，将变量和形参名作为AO属性名，值为undefined
3. 将实参值和形参统一
4. 在函数体里面找函数声明，值赋予函数体
```js
// step1 创建AO对象
AO {}

// step2  变量和形参名作为AO属性名，值为undefined
AO {
  a: undefined,
  b: undefined,
  d: undefined
}

// step3 实参形参统一
AO {
  a: 1,
  b: undefined,
  d: undefined
}

// step4 函数声明提升
AO {
  a: function a() {},
  b: undefined,
  d: function d() {}
}

// step 5 从第一行 逐行执行
```