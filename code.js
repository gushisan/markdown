// 策略
const strategies = {
  checkName: (name) => {
    if (name === 'jix') {
      return true
    }
    return false
  },
  checkPhone: (phone) => {
    if (typeof phone === 'number') {
      return true
    }
    return false
  }
}

let Validator = function() {
  this.checkQueue = [] // 校验队列

  // 添加策略
  this.add = (val, method) => { // val需要校验的值 method校验方法
    this.checkQueue.push(()=> strategies[method](val))
  }

  // 校验
  this.check = () => {
    for(let i = 0; i < this.checkQueue.length; i++) {
      let data = this.checkQueue[i]()
      if(!data) {
        return false
      }
    }
    return true
  }
}

let user1 = () => {
  const validator = new Validator()
  const data = {
    name: 'jix',
    phone: 666
  }

  validator.add(data.name, 'checkName')
  validator.add(data.phone, 'checkPhone')
  const result = validator.check()
  return result
}
console.log(user1())