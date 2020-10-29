# flutter环信sdk接入流程
> 基于flutter 接入环信IM sdk，主要实现功能1v1聊天，语音消息、视频、语音电话、视频会议等，[环信sdk官网](https://www.easemob.com//?utm_source=baidu-ppwx)


## sdk的接入

### clone sdk到本地
地址[环信sdk](https://github.com/easemob/im_flutter_sdk)

### sdk引入
用本地的方式将sdk引入你的项目，在flutter项目中的pubspec.yaml 里面的 dependencies: 下添加：
```yaml
im_flutter_sdk:
path : /本地路径/im_flutter_sdk
```
例如：
```yaml
dependencies:
  flutter:
    sdk: flutter
  im_flutter_sdk:
    path: /Users/fengxiao/documents/demo/im_flutter_sdk
```
然后 Package get 一下

### 初始化功能（ios）
1、在clone下来的sdk文件中拿到 /example/ios/Runner/ ,拿到Calls文件（环信原生iOS音视频相关UI文件），加到自己iOS项目中，这样可以自己在修改Calls中的原生iOS音视频相关UI文件，不会因为更新im_flutter_sdk，导致自己修改的UI部分也被更新。注意：不能直接复制需要使用xcode，勾选1、2、4项


2、在ios/Runner目录下的`Runner-Bridging-Header.h`文件中引入以下文件：
```h
#import "EMCallPlugin.h"
```

3、在ios/Runner目录下的`AppDelegate.swift`文件中注册plugin
```swift
EMCallPlugin.register(with: self.registrar(forPlugin: "EMCallPlugin") as! FlutterPluginRegistrar)
```

4、在ios/Runner目录下的Info.plist 添加权限
```plist
<key>NSCameraUsageDescription</key>
<string>需要使用您的相机</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>需要使用您的位置信息</string>
<key>NSMicrophoneUsageDescription</key>
<string>需要使用您的麦克风</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>需要使用您的相册</string>
<key>NSContactsUsageDescription</key>
<string>需要访问您的通讯录</string>
```

5、在你的项目中的`main.dart`文件初始化的时候，加上sdk的初始化
```dart
// 引入sdk
import 'package:im_flutter_sdk/im_flutter_sdk.dart';

// 初始化
EMOptions options = new EMOptions(appKey: "你申请的key");
EMClient.getInstance().init(options);

// 开启debug模式
EMClient.getInstance().setDebugMode(true);

// 添加链接状态监听的接口
EMClient.getInstance().addConnectionListener(this);

// 初始化1v1音视频通话
EMClient.getInstance().callManager().registerCallSharedManager();

// 初始化多人音视频通话
EMClient.getInstance().conferenceManager().registerConferenceSharedManager();
```

## 登录注册功能接入
> 注意：任何使用到sdk的地方都要引入：`import 'package:im_flutter_sdk/im_flutter_sdk.dart';`
### 登录功能
```dart
// 查询当前是否登录
bool isLoggedInBefore = await EMClient.getInstance().isLoggedInBefore();

// 登录
EMClient.getInstance().login(
  username,
  password,
  onSuccess: (username) {
    // 登录成功
  },
  onError: (code, desc) {
    // 登录失败
    switch(code) {
      case 2: {
        // 网络未连接!
      }
      break;

      case 202: {
        // 密码错误
      }
      break;

      case 204: {
       // 用户ID不存在
      }
      break;

      case 300: {
        // 无法连接服务器
      }
      break;

      default: {
        // desc 其他错误
      }
      break;
    }
  });
```
### 注册
```dart
EMClient.getInstance().createAccount(username, password,
  onSuccess: (){
    // 注册成功
  },
  onError: (code, desc){
    // 注册失败
    switch(code) {
      case 101: {
        // 用户ID不合法
      }
      break;

      case 102: {
        // 用户密码不合法
      }
      break;

      case 203: {
        // 用户ID已存在
      }
      break;

      case 300: {
        // 无法连接服务器
      }
      break;

      default: {
        // desc 其他错误
      }
      break;
    }
  }
);
```
### 退出登录
```dart
EMClient.getInstance().logout(
  false, // true 解除推送绑定 ： false 不解除绑定
  onSuccess: (){
    // 成功
  },
  onError: (code, desc) {
    // 失败
  },
);
```

### 获取当前登录用户的信息
```dart
userName = await EMClient.getInstance().getCurrentUser();
```

## 多人会议功能接入
```dart
// 创建并加入会议
EMClient.getInstance().conferenceManager().createAndJoinConference(
  EMConferenceType.EMConferenceTypeCommunication, // 会议类型
  '123', // 会议密码
  false, // 是否开启服务端录制
  false, // 录制时是否合并数据流
  onSuccess:(EMConference conf) {
    // 创建会议成功
  }, 
  onError: (code, desc){
    // 创建会议失败
  });
```

## 好友功能接入
```dart
// 从服务器获取所有的好友
EMClient.getInstance().contactManager().getAllContactsFromServer(
    onSuccess: (contacts){
      // 成功
    },
    onError: (code, desc){
      // 失败
    }
);

// 添加好友
EMClient.getInstance().contactManager().addContact(username, null ,
  onSuccess: () {
    // 成功
  },
  onError: (code, desc){
    // 失败
  });

// 同意好友请求
EMClient.getInstance().contactManager().acceptInvitation(userName,
  onSuccess: (){
    // 成功
  },
  onError: (code, desc){
    // 失败
  });

// 拒绝加好友请求
EMClient.getInstance().contactManager().declineInvitation(userName,
  onSuccess: (){
    // 成功
  },
  onError: (code, desc){
    // 失败
  });

// 删除联系人
EMClient.getInstance().contactManager().deleteContact(
  userName,
  false, // true 保留会话和消息  false 不保留
  onSuccess: (){
    // 成功
  },
  onError: (code, desc){
    // 失败
  });
```

## 消息相关功能接入
### 相关接口
```dart
// 页面初始化加入
// 添加消息监听
EMClient.getInstance().chatManager().addMessageListener(this);
// 添加链接状态监听的接口
EMClient.getInstance().addConnectionListener(this);

// 页面销毁时调用
// 移除消息监听
EMClient.getInstance().chatManager().removeMessageListener(this);
// 移除链接状态监听的接口
EMClient.getInstance().removeConnectionListener(this);

// 获取所有会话
Map map = await EMClient.getInstance().chatManager().getAllConversations();

// 删除与[userName] 的对话
bool result = await EMClient.getInstance().chatManager().deleteConversation(
  username,
  true // 设置为true，则还会删除消息
);
```
### 消息监听（实时更新消息）
1. 继承`EMConnectionListener`类
2. 重写`onMessageReceived`方法
3. 当有人发消息给当前用户就会触发`onMessageReceived`事件
```dart
  /// 消息监听
  void onMessageReceived(List<EMMessage> messages){
    
  }
```

## 1v1聊天相关功能接入
### 语音、视频通话
```dart
// 发起实时会话（语音、视频）
EMClient.getInstance().callManager().startCall(
  EMCallType.Video, // 通话类型 video,voice
  toChatUsername, // 被呼叫的用户（不能与自己通话）
  true, // 是否开启服务端录制
  true, // 录制时是否合并数据流
  "1323", // 通话扩展信息，会传给被呼叫方
  onSuccess:() {
    // 成功
  } ,
  onError:(code, desc){
    // 失败
  });
```

### 发送图片、文本、语音消息
```dart
// 1.图片消息
// 创建一个图片消息
EMMessage imageMessage = EMMessage.createImageSendMessage(
  imgPath, // 图片路径
  true, // 是否发送原图
  toChatUsername // 接收方id
);

// 发送消息
EMClient.getInstance().chatManager().sendMessage(
  imageMessage, // 前面创建的消息对象
  onSuccess:(){
    // 发送成功
  }
);

// 2.文本消息
// 创建文本消息
EMMessage message = EMMessage.createTxtSendMessage(
  text, // 发送内容
  toChatUsername // 接收方id
);
// 消息体
EMTextMessageBody body = EMTextMessageBody(text);
message.body = body;
// 发送消息统一调用上面的sendMessage

// 3.语音消息
EMMessage message = EMMessage.createVoiceSendMessage(
  path, // 本地语音路径
  length, // 语音长度（秒）
  toChatUsername // 接受人id
); 
// 发送消息统一调用上面的sendMessage

```
### 获取消息
> 消息监听同上，继承`EMConnectionListener`类，重写`onMessageReceived`方法
```dart
// 获取与[id]聊天的消息
conversation = await EMClient.getInstance().chatManager().getConversation(
  id, // 目标id
  0, // 聊天类型 0单聊
  true // createIfNotExists 如果不存在则创建?
);

// 所有消息设置为已读
conversation.markAllMessagesAsRead();

// 根据传入的参数从db加载startMsgId之前(存储顺序)指定数量的message
msgListFromDB = await conversation.loadMoreMsgFromDB(
  '', // startMsgId
  20 // pageSize
);

// 得到的msgListFromDB为当前最新的消息列表
```