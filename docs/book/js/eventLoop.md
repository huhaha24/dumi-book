---
title: 事件循环机制
order: 8
toc: content
---

# 事件循环机制

## 储备知识

[浏览器的进程和线程](/book/js/browser)

## 浏览器事件循环机制(Event Loop)

一句话概括事件循环机制，是一种**单线程的非阻塞方案**。

从前文可知，js 引擎是单线程，也就是说如果没有事件循环机制，遇到比较耗时的任务的时候，js 会阻塞住，那么这样的后果就是直接影响到了页面的渲染（在浏览器环境中）。

### 几个概念

#### event loop

是用来协调事件、用户交互、脚本、渲染、网络的一种浏览器内部机制。

#### 任务

是由 event loop 交给 js 引擎执行的一段代码

#### 宏任务

在 event loop 开始一次循环的时候，会去检查任务队列，所有在这里去检查的任务队列，其任务为宏任务。

宏任务标志着一次循环的开始，一次循环中只会同时执行一个宏任务，多个宏任务一定是在多次循环中执行的。

宏任务包含：

- script 代码
- setTimeout、setInternal
- setImmediate：回调中放想要立即执行的异步任务，比 setTimeout 的优先级高，实现 setTimeout(fn, 0)的功能
- I/O
- UI 渲染
- postMessage
- MessageChannel：允许我们在不同的浏览器上下文中进行通信，一篇不错的文章 👉[浅谈 MessageChannel](https://zhuanlan.zhihu.com/p/432726048)

#### 微任务

每个宏任务对应一个微任务队列，一次循环中，宏任务执行完后，会去执行微任务队列，直至清空微任务队列为止。

微任务包含：

- promise.then
- async/await
- process.nextTick
- MutationObserver：观察 DOM 的变化

<!-- ### 一张图
![image.jpg](https://s2.51cto.com/images/blog/202205/06101407_6274846f63d3e30463.jpg) -->

### 做个题目

```js
Promise.resolve().then(() => {
  console.log('promise1');
  setTimeout(() => {
    console.log('setTimeout1');
  }, 0);
});
setTimeout(() => {
  console.log('setTimeout2');
  Promise.resolve().then(() => {
    console.log('promise2');
  });
}, 0);

// promise1
// setTimeout2
// promise2
// setTimeout1
```

**题目解析**：

1. 第一轮事件循环，入口是当前所在的宏任务，也就是 script 代码；执行代码，发现有一个微任务 promise1，一个宏任务 setTimeout2，将微任务和宏任务注册到 event Table 中，当到了时间再把回调放入各自的任务队列中。宏任务执行完后，执行微任务，输出`promise1`；发现后面又有一个宏任务 setTimeout1，再进入宏任务队列。

2. 第二轮事件循环，进入的是 setTimeout2 的宏任务，输出`setTimeout2`，发现微任务，进入微任务队列。宏任务执行完后，输出`promise2`。

3. 第 3 轮循环，进入 setTimeout1 的宏任务，输出`setTimeout1`。

> 这个例子有点绕，但是我们只需要记住 3 点：
>
> 1. 浏览器的事件循环是有一个宏任务队列+多个微任务队列组成的；
> 2. 每次事件循环只会执行一个宏任务，每个宏任务都会有一个对应的微任务队列；
> 3. 宏任务执行完后，再去把微任务清空。

## 相关问题

### 问题一：`console.log`是宏任务吗？

答：其实这道题的重点在于**为什么`script`代码属于宏任务**，因为`<script>`是一个入口，可以理解为是一个大的宏任务。每次先执行的是同步代码，然后收集里面的宏任务和微任务。所以结论是，`console.log`不是宏任务，因为它根本不算是一个任务，只是一句同步代码而已。

### 问题二：为什么要区分宏任务和微任务？

答：如果不加区分的话，后入队的任务，永远都是在最后执行。这种设计是为了给紧急任务一个插队的机会，否则新入队的任务永远被放在队尾。区分了微任务和宏任务后，本轮循环中的微任务实际上就是在插队，这样微任务中所做的状态修改，在下一轮事件循环中也能得到同步。

### 问题三：setTimeout 的执行时间一定是第二个参数传入的时间吗？

答：不一定，如果主线程执行时消耗时间过长，setTimeout 的回调就会推迟执行。

## 参考文章

- [面试技巧系列：事件循环机制](https://juejin.cn/post/6932263539839074311)
- [阿里一面：熟悉事件循环？那谈谈为什么会分为宏任务和微任务](https://blog.csdn.net/frontend_nian/article/details/123547482)
