---
title: state
order: 3
toc: content
---

疑问 🤔️

- 调用了 setState 之后发生了什么？

# setState 到底是同步还是异步？

**结论：**setState 在钩子函数和合成事件中是异步的，在 DOM 原生事件以及 setTimeout、setInteral 中是同步的。
**原因：**由于 React 的锁机制，导致在批量更新的过程中，setState 的操作会在暂时进入`dirtyComponents`排队，等`isBatchingUpdates`置为 false 之后，再进行更新。

- 在 setTimeput 中能表现为同步，是因为不受 React 的批量更新机制控制了；
- React 在初始化和合成事件调用时都会触发批量更新机制

## 实现批量更新机制
