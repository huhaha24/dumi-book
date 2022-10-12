---
title: state
order: 3
toc: content
---

# state 相关知识

## 调用 setState 会发生什么？

会发生以下步骤：

1. 调用`setState`
2. 计算过期时间`expirationTime`（主要是为了防止高优先级的任务一直执行，导致 update 操作没有执行，到了 expirationTime 规定的时间后，会强制执行 update）
3. 更新调度，调和 fiber 树
4. 合并 state，执行 render（类组件中是执行 render 函数，函数组件是将函数组件执行一遍）
5. 替换更新 DOM 树
6. 执行回调函数（当然，在函数组件中 useState 没有回调）

![setState后发生的事情](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d5e25a4ed464547bdd0e7c3a44d0ccc~tplv-k3u1fbpfcp-watermark.awebp)

**简单来讲：**render 阶段调用 render 函数 --> commit 阶段真实 DOM 更新 --> 执行 callback 回调函数

## 如何限制 state 更新视图

### 类组件中

1. `purComponent`会对 state 和 props 进行浅比较，如果没有发生更新，组件就不更新；
2. 在`shouldComponentUpdate`中可以通过判断前后 state 变化来决定组件是否需要更新，需要的话返回`true`，否则返回`false`

## state 到底是同步还是异步？

### 结论

准确来说，state 在批量更新机制中表现为异步，在跳出批量更新机制控制的时候是同步的。

### 触发时机

- react 在初始化的时候
- 合成事件调用的时候

### 图解

#### 在批量更新机制中

```js
class MyClass extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    count: 0,
  };

  handleClick = () => {
    // 第一遍
    this.setState({ count: this.state.count + 1 }, () => {
      console.log('callback1', this.state.count);
    });
    console.log(this.state.count);

    // 第二遍
    this.setState({ count: this.state.count + 1 }, () => {
      console.log('callback2', this.state.count);
    });
    console.log(this.state.count);

    // 第三遍
    this.setState({ count: this.state.count + 1 }, () => {
      console.log('callback3', this.state.count);
    });
    console.log(this.state.count);
  };

  render() {
    return (
      <>
        {this.state.count}
        <button onClick={() => handleClick}>点击</button>
      </>
    );
  }
}
```

**输出结果：**
0, 0, 0, callback1 1 ,callback2 1 ,callback3 1

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/478aef991b4146c898095b83fe3dc0e7~tplv-k3u1fbpfcp-watermark.awebp)

#### 使用 setTimeout 等异步操作

```js
class MyClass extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    count: 0,
  };

  handleClick = () => {
    setTimeout(() => {
      // 第一遍
      this.setState({ count: this.state.count + 1 }, () => {
        console.log('callback1', this.state.count);
      });
      console.log(this.state.count);

      // 第二遍
      this.setState({ count: this.state.count + 1 }, () => {
        console.log('callback2', this.state.count);
      });
      console.log(this.state.count);

      // 第三遍
      this.setState({ count: this.state.count + 1 }, () => {
        console.log('callback3', this.state.count);
      });
      console.log(this.state.count);
    });
  };

  render() {
    return (
      <>
        {this.state.count}
        <button onClick={() => handleClick}>点击</button>
      </>
    );
  }
}
```

**输出结果：**
callback1 1 , 1, callback2 2 , 2,callback3 3 , 3

![image](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48e730fc687c4ce087e5c0eab2832273~tplv-k3u1fbpfcp-watermark.awebp)

**补充说明**

根据事件循环机制，`setTimeout`是宏任务，会在下一轮事件循环中执行，所以在`setTimeout`中的内容执行之前，批量更新的标识已经变为`false`，react 更新机制会对 state 进行立即更新，所以表现为同步的。

## setState 和 useState 的区别

### 相同点

都会引起 react 的重新渲染，底层都是调用`scheduleUpdateOnFiber`方法，在事件驱动的情况下都有批量更新机制。

### 不同点

- useState 没有回调函数，在函数内部无法拿到最新的值，除非通过 useEffect 将该 state 作为依赖，才可以获取到最新修改的值；
- useState 会进行浅比较，相同的话，就不会进行更新；而 setState 只要被调用，就会引起更新；
- useState 底层更新更倾向于重新赋值，而 setState 更倾向于合并。

## 参考文章

- [基础篇-玄学 state](https://www.qingp.net/read?id=621f31aa7072bd554ceb41ac)
