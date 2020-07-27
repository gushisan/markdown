# vue路由守卫
> 通俗的说，路由守卫就是路由跳转过程中的一些钩子函数。从一个路由跳转到另一个路由中间有很多时间点都存在钩子函数，这些钩子函数能让你操作一些事，这就是路由守卫。

## 开始之前先举个例子
我们在某些网站进行在线的办公软件操作，当你点击关闭页面的时候会跳出弹窗，问你是否确定关闭
![](https://user-gold-cdn.xitu.io/2020/7/18/1735ff1f9cdeca5c?w=462&h=146&f=png&s=3462)

其实这个实现起来并不难，使用组件内的路由守卫就能实现
```typescript
import { Component, Vue } from 'vue-property-decorator'
Component.registerHooks([
  'beforeRouteLeave'
])
// 注意若是ts，需要加上这一句, 否则不生效 



  beforeRouteLeave (to, from, next) {
    const answer = window.confirm('确认关闭?')
    if (answer) {
      next()
    } else {
      next(false)
    }
  }
```