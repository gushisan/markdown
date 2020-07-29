# vue项目迁移中遇到的坑
> 背景： 因业务需要，将原来的老后台管理系统迁移到新的框架下，由于之前的后台比较混乱，将权限，菜单，代码等重构。迁移前`vue2.5.x + jquery + js + elment-ui`，迁移后 `vue2.6.x + ts + element-ui` 

# 问题代码示例
```html
<template>
  <div class="app-container">
  {{ userName }}
  <!-- "userName" is not defined -->
  </div>
</template>
```
```typescript
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class MerchantDetail extends Vue {
  private userName: string = '张三'
  private roleForm: any = {
    merchantId: '',
    roleName: null,
    initPermId: [],
    operator: Cookies.get('totalRole')
  }

  mounted() {
    console.log(this.userName)  // undefined
    console.log(this.roleForm)  // undefined
  }
}
```
上面的代码中可以看出，data中已经定义了数据，但是节点上获取不到，生命周期中也获取不到。发现问题出现在哪了吗？



# 改正后代码
```html
<template>
  <div class="app-container">
  {{ userName }}
  </div>
</template>
```
```typescript
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class MerchantDetail extends Vue {
  private userName: string = '张三'
  private roleForm: any = {
    merchantId: '',
    roleName: null,
    initPermId: [],
    operator: ''
  }

  mounted() {
    this.roleForm.operator = Cookies.get('totalRole')
    console.log(this.userName)
    console.log(this.roleForm)
  }
}
```