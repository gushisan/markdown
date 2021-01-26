# ios数字键盘解决方案
场景： 在使用flutter开发的过程中我们发现当你使用数字输入框调起数字键盘时ios默认数字键盘无法关闭，默认没有关闭的方式。

## 原始解决方案
```dart
FocusScope.of(context).requestFocus(FocusNode());
```
给需要关闭键盘的页面最外层加上点击事件，点击空白地方关闭键盘。
后来发现这种方式并不行，因为用户可能根本不知道去点击空白的地方关闭键盘。

## 更加深入的解决方案
去看了闲鱼ios端APP，会在键盘上加一个完成按钮。

### keyboard_actions
[`keyboard_actions`](https://pub.flutter-io.cn/packages/keyboard_actions)是一个flutter 插件 ，刚好可以满足我们的需求，完成自定义的键盘功能

```dart
keyboard_actions: "^3.3.1+1"
```

```dart
static KeyboardActionsConfig keyboardBuildConfig(
      BuildContext context, List<FocusNode> focusNodeList) {
    return KeyboardActionsConfig(
        keyboardSeparatorColor: Colors.white,
        actions: focusNodeList
            .map((e) => KeyboardActionsItem(focusNode: e, toolbarButtons: [
                  //button 1
                  (node) {
                    return GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: () => node.unfocus(),
                      child: Container(
                        padding: EdgeInsets.all(8.0),
                        margin: EdgeInsets.only(right: getWidthPx(12)),
                        child: Text(
                          "完成",
                          style: headline6(context).copyWith(
                              color: blueColor, fontWeight: FontWeight.w600),
                        ),
                      ),
                    );
                  },
                ]))
            .toList());
  }
```
自定义配置

![](https://xcb-assets-dev.oss-cn-shanghai.aliyuncs.com/images/md/IMG_0944.PNG)
调整完毕后的键盘

### FocusNode
在使用的过程中发现，keyboard_actions是使用FocusNode来实现的， 在Flutter中使用FocusNode用来捕捉监听TextField的焦点获取与失去，同时也可通过FocusNode来使用绑定对应的TextField获取焦点与失去焦点,看一下FocusNode上面的常用方法
- `canRequestFocus`: 是否能请求焦点
-  `context`: 焦点"附着"的 widget 的 BuildContext
- `hasFocus`: 是否有焦点
- `unfocus`: 放弃焦点, 如果当前 node 有焦点,并调用这个, 就放弃了焦点, 如果同时有软键盘弹起, 则软键盘收起
- `requestFocus`: 请求焦点, 这个方法调用后, 会把焦点移到当前
