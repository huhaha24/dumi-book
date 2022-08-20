---
title: 事件系统
order: 2
toc: content
---

疑问 🤔️

- 什么是合成事件？
  - 在 react 中，我们绑定的事件不是原生事件，而是由原生事件合成的 react 事件，比如 click 事件合成 onClick 事件；change、blur、input、keydown、keyup 等合成 onChange 事件。
- react 为什么要自定义一个事件系统？
  - 从性能的角度，因为每次绑定事件都会消耗性能，如果能将事件按需绑定，可以优化性能；
  - 为了抹平浏览器的差异，这样用户使用的时候就不需要考虑浏览器的兼容性问题
- 怎么做到和具体元素进行绑定的？
- 原生事件和合成事件的执行顺序
- 原生事件和合成事件有什么区别吗？
  - 它们之间存在某种映射关系
- react 如何触发事件？
- react 如何模拟事件捕获和事件冒泡？
  - 使用数组存储事件，如果是冒泡的话，就从前往后进行遍历；捕获的话，就从后往前遍历
- 我们的事件是绑定在 dom 身上吗？
  - 不是的，react 中会将事件统一绑定在 document 元素上；
  - 从 react17 开始，会绑定在 container 上，这样做是为了兼容微前端，也就是避免多个 react 应用同时运行，导致事件的混乱
- 为什么我们的事件不能绑定在组件身上？
- 为什么不能使用 return false 阻止默认事件
- onClick 是在冒泡阶段绑定的吗？onClickCapture 是在捕获阶段绑定的吗？

# React 事件系统

为了性能的考虑和抹平浏览器的差异性，React 自定义了自己的事件系统，它和原生事件系统的区别在于原生事件系统是将事件绑定在 DOM 元素上，而 React16.x 版本是统一绑定在 document 上；React17 是绑定在自个的根元素上。

## 前言

### 动机

1. 抹平浏览器之间兼容性的差异
2. 可以事件自定义，抓住了事件处理的主动权
3. 抽象跨平台事件机制

### 三个阶段

- 事件合成阶段
- 事件绑定阶段
- 事件触发阶段

## 事件合成阶段

> 这个阶段主要是通过一些方法和对象转换，形成**React 合成事件和原生事件的映射的关系**，以及**合成事件和对应的事件处理插件关系**。

- 在什么时候做的？
  答：在 React 初始化的时候，就会默认生成合成事件
- 做了什么事情？
  答：合成事件和原生事件的映射关系、合成事件及对应的事件处理插件的关系

### 合成事件和原生事件的映射关系

```js
{
    onBlur: ['blur'],
    onClick: ['click'],
    onClickCapture: ['click'],
    onChange: ['blur', 'change', 'click', 'focus', 'input', 'keydown', 'keyup', 'selectionchange'],
    onMouseEnter: ['mouseout', 'mouseover'],
    onMouseLeave: ['mouseout', 'mouseover'],
    ...
}
```

### 合成事件和对应事件处理插件的关系

```js
{
    onBlur: SimpleEventPlugin,
    onClick: SimpleEventPlugin,
    onClickCapture: SimpleEventPlugin,
    onChange: ChangeEventPlugin,
    onChangeCapture: ChangeEventPlugin,
    onMouseEnter: EnterLeaveEventPlugin,
    onMouseLeave: EnterLeaveEventPlugin,
    ...
}
```

### 事件处理插件

每个合成事件都对应着一个事件处理插件，以`SimpleEventPlugin`为例，它包含了`eventTypes`和`extractEvents`两个对象，其中前者主要是定义了和原生事件的关系，后者定义了事件处理函数。

```js
const SimpleEventPlugin = {
  eventTypes:{
    'click':{ /* 处理点击事件  */
      phasedRegistrationNames:{
        bubbled: 'onClick',       // 对应的事件冒泡 - onClick
        captured:'onClickCapture' //对应事件捕获阶段 - onClickCapture
      },
      dependencies: ['click'], //事件依赖
      ...
    },
    'blur':{ /* 处理失去焦点事件 */ },
    ...
  }
  extractEvents: function(topLevelType,targetInst,){
    /* eventTypes 里面的事件对应的统一事件处理函数，接下来会重点讲到 */
  }
}
```

## 事件绑定阶段

- 什么时候做的？
  答：在组件挂载过程中，准确来说是 cpmpleteWork 的时候，给 DOM 元素添加属性的时候，如果发现 DOM 元素上有合成事件，就会按照事件系统逻辑单独处理。

- 做了什么事情？
  答：

1. 根据合成事件找到对应的原生事件，然后判断原生事件的类型，大部分事件按冒泡逻辑处理，少部分按捕获逻辑处理；
2. 调用`addTrappedEventListener`将**事件处理函数**绑定到`document`元素上，这个事件处理函数就是
   `dispatchEvent`；
3. 同一类型的事件只会在 document 上注册一次

## 事件触发阶段

- 什么时候会发生？
  答：用户触发 DOM 元素上绑定的事件时

- 做了什么事情？
  答：

1. 通过`dispatchEvent`事件处理函数，进行批量更新，也就是将`isBatchingEventUpdates`改为`true`；
2. 然后执行事件对应的插件中的`extractEvents`，合成事件源对象；(这个事件源对象就是我们在函数里面拿到的 e，而原生事件的 e 需要使用 e.nativeEvent 去获取)
3. react 会从这个事件源开始，向上遍历类型为 HostComponent 的元素对应的 fiber，判断它的 props 中是否包含当前的事件类型，如果存在，存储到`dispatchListeners`中，最终会形成一个事件执行队列；（其中，冒泡事件是使用 unshift 加到队列的最前面，捕获事件是使用 push 加到最后面）
4. react 通过这个事件队列模拟原生事件的 捕获 --> 目标 --> 冒泡，正序遍历就是冒泡阶段，倒序遍历就是捕获阶段；
5. 最后通过`runEventsInBatch`执行事件队列。

### 源码部分

```js
// 第三步的部分源码
while (instance !== null) {
  const { stateNode, tag } = instance;
  if (tag === HostComponent && stateNode !== null) {
    /* DOM 元素 */
    const currentTarget = stateNode;
    if (captured !== null) {
      /* 事件捕获 */
      /* 在事件捕获阶段,真正的事件处理函数 */
      const captureListener = getListener(instance, captured);
      if (captureListener != null) {
        /* 对应发生在事件捕获阶段的处理函数，逻辑是将执行函数unshift添加到队列的最前面 */
        dispatchListeners.unshift(captureListener);
        dispatchInstances.unshift(instance);
        dispatchCurrentTargets.unshift(currentTarget);
      }
    }
    if (bubbled !== null) {
      /* 事件冒泡 */
      /* 事件冒泡阶段，真正的事件处理函数，逻辑是将执行函数push到执行队列的最后面 */
      const bubbleListener = getListener(instance, bubbled);
      if (bubbleListener != null) {
        dispatchListeners.push(bubbleListener);
        dispatchInstances.push(instance);
        dispatchCurrentTargets.push(currentTarget);
      }
    }
  }
  instance = instance.return;
}
```

### 例子讲解

```js
handerClick = () => console.log(1)
handerClick1 = () => console.log(2)
handerClick2 = () => console.log(3)
handerClick3 = () => console.log(4)
render(){
  return <div onClick={ this.handerClick2} onClickCapture={this.handerClick3}>
    <button onClick={this.handerClick} onClickCapture={this.handerClick1} className="button">点击</button>
  </div>
}
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/514a83eb13df4dd58ec0ebc1dca1873d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

解析：首先我们会遍历`button`的 fiber，发现上面有`onClick`、`onClickCapture`这两个合成事件，根据在 etractEvents 中冒泡事件放队列的从后面开始放，捕获事件从前面开始放。所以这里的`handerClick`应该是放在队列的最后，而`handerClick1`放在最前，现在队列就是`[handerClick1, handerClick]`。然后会去找`div`对应的 fiber，重复前面的步骤，最后队列变成了`[handerClick3, handerClick1, handerClick, handerClick2]`。

所以最终的输出结果是：4、2、1、3

## React17 的事件机制

- 所有合成事件不再挂载在`document`上，而是挂载在各个项目的`root`上，这样有利于微前端架构；
- 不再使用事件池，修复了在 setTimeout 中访问事件源找不到的情况

```js
// React16.x版本会有这个问题，可以通过e.persist()解决
handerClick = (e) => {
  console.log(e.target); // button
  setTimeout(() => {
    console.log(e.target); // null
  }, 0);
};
```

## 🙋 面试题

### React 合成事件能使用 return false 阻止默认行为吗？

答：不可以，需要使用 e.preventDefault()来阻止。

### React 合成事件和原生事件的执行顺序

答：在捕获阶段，合成事件先于原生事件；在冒泡阶段，原生事件先于合成事件。

#### 问题分析

[代码地址](https://stackblitz.com/edit/react-njlohx?file=src%2FApp.js)

```js
import React, { useEffect, useRef } from 'react';
import './style.css';

export default function App() {
  const childRef = useRef(null);
  const fatherRef = useRef(null);

  useEffect(() => {
    childRef.current.addEventListener('click', () => {
      console.log('原生事件：子元素 冒泡');
    });

    fatherRef.current.addEventListener('click', () => {
      console.log('原生事件：父元素 冒泡');
    });

    childRef.current.addEventListener(
      'click',
      () => {
        console.log('原生事件：子元素 捕获');
      },
      true,
    );

    fatherRef.current.addEventListener(
      'click',
      () => {
        console.log('原生事件：父元素 捕获');
      },
      true,
    );

    // document
    document.addEventListener('click', () => console.log('Document事件：冒泡'));
    document.addEventListener(
      'click',
      () => console.log('Document事件：捕获'),
      true,
    );
  }, []);

  const handleChildClick = (e) => {
    console.log('合成事件：子元素 冒泡');
  };

  const handleChildCaptureClick = () => {
    console.log('合成事件：子元素 冒泡');
  };

  const handleFatherClick = () => {
    console.log('合成事件：父元素 冒泡');
  };

  const handleFatherCaptureClick = () => {
    console.log('合成事件：父元素 捕获');
  };

  return (
    <div
      ref={fatherRef}
      onClick={handleFatherClick}
      onClickCapture={handleFatherCaptureClick}
    >
      <button
        ref={childRef}
        onClick={handleChildClick}
        onClickCapture={handleChildCaptureClick}
      >
        按钮
      </button>
    </div>
  );
}
```

![image.png](https://s4.aconvert.com/convert/p3r68-cdx67/a3jw3-4ugiz.png)

- 在 React17 中，所有事件都委托在 root 对象上，事件被触发后会先冒泡到 root 上，再执行 react 合成事件；
- 捕获是先注册先执行，合成事件先于原生事件，冒泡是先注册后执行，原生事件先于合成事件；

### 阻止冒泡的方式有几种？

答：三种，分别如下：

1. 阻止合成事件之间的冒泡：e.stopPropagation()
2. 阻止合成事件和最外层 document 上的冒泡：e.nativeEvent.stopImmediatePropagation()
3. 阻止合成事件与非合成事件之间（除了 document）的冒泡：需要用 e.target 判断

## 参考文章

- [「react 进阶」一文吃透 react 事件系统原理](https://juejin.cn/post/6955636911214067720)
- [React 事件机制 – 合成事件](https://www.jianshu.com/p/a68219093f88)
- [60 行代码实现 React 事件系统](https://juejin.cn/post/7058444361888956446)
