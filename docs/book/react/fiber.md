---
title: Fiber树
order: 3
toc: content
---

疑问 🤔️

- react 为什么需要 fiber 树？
  - 因为之前的更新是同步的，如果渲染占用时间太长的话，会导致页面渲染的阻塞，影响用户体验。而 fiber 实现了异步更新，采用轮转的机制，主动交出控制权，在浏览器有空闲的时候去执行渲染工作，是可恢复可中断的。
- fiber 树解决了什么问题？
  - 解决了渲染过程不能中断的问题
- fiber 的工作机制是怎样的？
  - 通过调用浏览器的 requestIdleCallback，和浏览器合作进行渲染。
- 关于 fiber 树的面试题有哪些？

# Fiber 树

## 参考文章

- [这可能是最通俗的 React Fiber(时间分片) 打开方式](https://juejin.cn/post/6844903975112671239)
