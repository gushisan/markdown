// var str = '123456765464153513566'

// let a = str.replace(/(\d)(?=(\d{3})+$)/g,'$1,')
// console.log(str.match(/(\d)(?=(\d{3})+$)/g))
// console.log(a)

// var test = "get-element-by-id";

// console.log(test.replace(/-\w/g, ($0) => {
//     return $0.slice(1).toUpperCase()
// }))
// console.log(test.match(/-\w/g))

var str3 = 'getElementById'

console.log(str3.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())
console.log(str3.match(/[a-z][A-Z]/g))


var str4 = 'scq000 scq001'
console.log(str4.replace(/(scq00)(?:0)/, '$1,$2'))