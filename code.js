function filterParams(obj) { // 剔除对象的空属性
  var _newObj = {};
  for (var key in obj) {
      if (obj.hasOwnProperty(key)) { // 判断对象中是否有这个属性
          if (isEmpty(obj[key])) continue;
          _newObj[key] = typeof obj[key] === 'object' ? (
              obj[key] instanceof Array ? ArrayFilterParams(obj[key]) : filterParams(obj[key])
          ): obj[key];
          
      }
  }
  return _newObj;
}
function ArrayFilterParams(arr) { // 剔除数组中的空值
  var err = [];
  const empty_arr = ['', undefined, null];
  arr.forEach((item, index) => {
      if (isEmpty(item)) return;
      err.push(
          typeof item === 'object' ? (
              item instanceof Array ? ArrayFilterParams(item) :  filterParams(item)
          ) : item
      );
  })
  return err;
}
function isEmpty(obj) { // 为空情况
  const empty_arr = ['', undefined, null];
  return (empty_arr.indexOf(obj) > -1 || obj.toString().trim() === '');
}
let info = {
  name: '111',
  age: null,
  sex: undefined,
  aa: '',
  infoo: [
      1, 23,5434,null,22, {
          nale: '',
          ss: '111'
      }
  ],
  cc: {
      asas: [
          1,2,23,333
      ],
      name: '',
      asss: undefined,
      aaa:null
  }
}
console.log(filterParams(info));
