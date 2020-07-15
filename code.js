var str = '123456765464153513566'

let a = str.replace(/(\d)(?=(\d{3})+$)/g,'$1,')
console.log(a)
// 分割数字每三个以一个逗号划分
var test = "get-element-by-id";

console.log(test.replace(/-\w/g, ($0) => {
    return $0.slice(1).toUpperCase()
}))

var str3 = 'getElementById'

console.log(str3.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())


var str4 = 'colouuuuur color'

console.log(str4.match(/colou+r/g))