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
Isolate 是 Dart 中的 线程
> 「Isolate」在 Flutter 中并不共享内存。不同「Isolate」之间通过「消息」进行通信。

我们可以利用Isolate来实现多线程
