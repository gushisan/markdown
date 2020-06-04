class PubSub {
  constructor() {
    this.handleBars = {}; // 保存监听事件
  }
  // 订阅
  subscribe(eventName, handle) {
    try {
      if (!this.handleBars.hasOwnProperty(eventName)) {
        this.handleBars[eventName] = [];
      }
      if (typeof handle == 'function') {
        this.handleBars[eventName].push(handle);
      } else {
        throw new Error(`你需要给${eventName}事件添加回调方法`);
      }
    } catch (error) {
      console.warn(error);
    }
  }
  // 发布
  publish(eventName, ...arg) {
    try {
      if (this.handleBars.hasOwnProperty(eventName)) {
        this.handleBars[eventName].map(item => {
          item.apply(null, arg)
        })
      } else {
        throw new Error(`${eventName}事件未被注册`);
      }
    } catch (error) {
      console.warn(error);
    }
  }
  // 移除订阅
  unSubscribe(eventName, handle) {
    try {
      if (this.handleBars.hasOwnProperty(eventName)) {
        this.handleBars[eventName].map((item, index) => {
          if (item === handle) {
            this.handleBars[eventName].splice(index, 1)
          }
        })
      }
    } catch (error) {
      console.warn(error);
    }
  }
}

// 实例化
const sub = new PubSub();

// 订阅的回调方法
function func1(type) {
  console.log('尼古拉斯赵四:', type);
}
function func2(type) {
  console.log('王凯旋:', type);
}
function func3(type) {
  console.log('职业法师:', type);
}
// 订阅事件
sub.subscribe('微信', func1)
sub.subscribe('微信', func2)
sub.subscribe('QQ', func3)
  
setTimeout(() => {
  // 触发订阅事件
  sub.publish('微信', '公众号推文')
  sub.publish('QQ', '动态更新', '666')
  // 移除订阅的ready事件func1回调
  sub.unSubscribe('微信', func1);
  console.log(sub.handleBars);
}, 1000)