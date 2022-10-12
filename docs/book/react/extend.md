---
title: 生态圈
order: 7
toc: content
---

# react 生态圈

## 关于 react 的疑问

- 每个组件都用 memo 去包裹真的好吗，什么时候用 memo 比较合适
- forwardRef 和 useImperativeHandle 做了什么事情，为什么需要他们
- react 中有哪些 hooks
  - useState
  - useEffect
  - useLayoutEffect
  - useMemo
  - useCallback
  - useReducer
  - useContext
  - useImperativeHanle
  - useRef

## 路由

🤔️ 疑问：

- react-router-dom6 相对之前更新了什么内容？

  - 不再显示加载 react-router-config 进行路由集中管理

- suspense 的原理以及 suspense 的使用

## 状态管理

### redux

🤔️ 疑问：

- redux 和 react-redux 的区别
  - react-redux 是 redux 针对 react 封装的状态管理库
- compose 是干嘛的
  - 用于增强的函数
- createStore 和 configerStore 的区别
  - configerStore 是 createStore 的进一步封装
- 中间件是干嘛的
  - 提供一些功能：比如异步请求
- 为什么需要同时使用 redux 和 react-redux

  - 因为有些功能还需要从 redux 中获取

- 如何使用 useReducer 和 useContext 实现小型的 redux
