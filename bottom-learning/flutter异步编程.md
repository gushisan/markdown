# 事件循环、Isolate
开始前我们需要明白 `Dart 是单线程的并且 Flutter 依赖于 Dart`

如果你知道[js 中的event loop](https://github.com/gushisan/markdown/blob/master/bottom-learning/event-loop.md) 将很好理解dart的整个异步过程

先看一段代码
```dart
import 'dart:async';

Future eventLoop() async{
  print('A');

  Future((){
    print('F');
    scheduleMicrotask((){print('H');});
    Future((){
      print('M');
    }).then((_){
        print('N');
    });
  }).then((_){
      print('G');
  });

  Future((){
      print('I');
  }).then((_){
      print('J');
  });

  scheduleMicrotask(text1);
  scheduleMicrotask((){print('D');});

  print('B');
}

void text1() {
  print('C');
  scheduleMicrotask((){print('E');});
  Future((){
      print('K');
  }).then((_){
      print('L');
  });
}
```
你只到输出结果吗

> 正确的输出顺序是: A B C D E F G H I J K L M N


## eventLoop
### 1、MicroTask 队列
微任务队列，一般使用`scheduleMicroTask`方法向队列中添加

这是大多数时候你不必使用的东西。比如，在整个 Flutter 源代码中 scheduleMicroTask() 方法仅被引用了 7 次， 所以最好优先考虑使用 Event 队列
### 2、Event 队列
 `I/O、手势、绘图、计时器、流、futures等等`异步操作都将进入event队列

 尽量使用事件队列可以使微任务队列更短，降低事件队列卡死的可能性

## 代码执行顺序
首先我们知道dart是单线程的，所以dart的代码执行顺序是：
1. 同步代码依次执行
2. 碰到异步代码先进对应的队列中，然后继续执行下面的代码
3. 当同步代码执行完毕，先去看MicroTask 队列中的任务，将MicroTask队列中的任务依次执行完毕
4. MicroTask中的任务执行完毕后，再去看Event 队列中的任务，event队列出一个任务 然后执行 ， 然后回到第三步 循环  直到所有队列都清空

## Isolate
Isolate 是 Dart 中的 线程， Flutter的代码都是默认跑在root isolate上的
> 「Isolate」在 Flutter 中并不共享内存。不同「Isolate」之间通过「消息」进行通信。

```dart
import 'dart:async';
import 'dart:io';
import 'dart:isolate';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

//一个普普通通的Flutter应用的入口
//main函数这里有async关键字，是因为创建的isolate是异步的
void main() async{
  runApp(MyApp());
  
  //asyncFibonacci函数里会创建一个isolate，并返回运行结果
  print(await asyncFibonacci(20));
}

//这里以计算斐波那契数列为例，返回的值是Future，因为是异步的
Future<dynamic> asyncFibonacci(int n) async{
  //首先创建一个ReceivePort，为什么要创建这个？
  //因为创建isolate所需的参数，必须要有SendPort，SendPort需要ReceivePort来创建
  final response = new ReceivePort();
  //开始创建isolate,Isolate.spawn函数是isolate.dart里的代码,_isolate是我们自己实现的函数
  //_isolate是创建isolate必须要的参数。
  await Isolate.spawn(_isolate,response.sendPort);
  //获取sendPort来发送数据
  final sendPort = await response.first as SendPort;
  //接收消息的ReceivePort
  final answer = new ReceivePort();
  //发送数据
  sendPort.send([n,answer.sendPort]);
  //获得数据并返回
  return answer.first;
}

//创建isolate必须要的参数
void _isolate(SendPort initialReplyTo){
  final port = new ReceivePort();
  //绑定
  initialReplyTo.send(port.sendPort);
  //监听
  port.listen((message){
    //获取数据并解析
    final data = message[0] as int;
    final send = message[1] as SendPort;
    //返回结果
    send.send(syncFibonacci(data));
  });
}

int syncFibonacci(int n){
  return n < 2 ? n : syncFibonacci(n-2) + syncFibonacci(n-1);
}
```
因为Root isolate会负责渲染，还有UI交互，如果我们有一个很耗时的操作呢？前面知道isolate里是一个event loop（事件循环），如果一个很耗时的task一直在运行，那么后面的UI操作都被阻塞了，所以如果我们有耗时的操作，就应该放在isolate里！
# Stream（流）
什么是流？
![](https://user-gold-cdn.xitu.io/2018/10/1/1662d3f569b48736?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
- 这个大机器就是StreamController，它是创建流的方式之一。
- StreamController有一个入口，叫做sink
- sink可以使用add方法放东西进来，放进去以后就不再关心了。
- 当有东西从sink进来以后，我们的机器就开始工作
- StreamController有一个出口，叫做stream
- 机器处理完毕后就会把产品从出口丢出来，但是我们并不知道什么时候会出来，所以我们需要使用listen方法一直监听这个出口
- 而且当多个物品被放进来了之后，它不会打乱顺序，而是先入先出

## 使用Stream
```dart
StreamController controller = StreamController();

//监听这个流的出口，当有data流出时，打印这个data
StreamSubscription subscription =
controller.stream.listen((data)=>print("$data"));

controller.sink.add(123);

// 输出： 123
```
你需要将一个方法交给stream的listen函数，这个方法入参(data)是我们的StreamController处理完毕后产生的结果，我们监听出口，并获得了这个结果(data)。这里可以使用lambda表达式，也可以是其他任何函数

## transform
如果你需要更多的控制转换，那么请使用transform()方法。他需要配合StreamTransformer进行使用。
```dart
StreamController<int> controller = StreamController<int>();

final transformer = StreamTransformer<int,String>.fromHandlers(
    handleData:(value, sink){
  	if(value==100){
      sink.add("你猜对了");
    }
	else{ sink.addError('还没猜中，再试一次吧');
    }
  });
  
  controller.stream
            .transform(transformer)
            .listen(
                (data) => print(data),
                onError:(err) => print(err));
    
    controller.sink.add(23);
    //controller.sink.add(100);

    // 输出： 还没猜中，再试一次吧
```
StreamTransformer<S,T>是我们stream的检查员，他负责接收stream通过的信息，然后进行处理返回一条新的流。
- S代表之前的流的输入类型，我们这里是输入一个数字，所以是int。
- T代表转化后流的输入类型，我们这里add进去的是一串字符串，所以是String。
- handleData接收一个value并创建一条新的流并暴露sink，我们可以在这里对流进行转化

## Stream的种类
- "Single-subscription" streams 单订阅流
- "broadcast" streams 多订阅流

## 单订阅流
```dart
StreamController controller = StreamController();

controller.stream.listen((data)=> print(data));
controller.stream.listen((data)=> print(data));

controller.sink.add(123);

// 输出: Bad state: Stream has already been listened to. 单订阅流不能有多个收听者。
```
单个订阅流在流的整个生命周期内仅允许有一个listener

## 多订阅流
```dart
StreamController controller = StreamController();
//将单订阅流转化为广播流
Stream stream = controller.stream.asBroadcastStream();

stream.listen((data)=> print(data));
stream.listen((data)=> print(data));

controller.sink.add(123);

// 输出： 123 123
```
广播流允许任意数量的收听者，且无论是否有收听者，他都能产生事件。所以中途进来的收听者将不会收到之前的消息。