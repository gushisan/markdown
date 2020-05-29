let x = 1
let obj = {
  valueOf: () => {
    return {}
  },
  toString: () => {
    return {}
  }
}
console.log(obj == 0, x)