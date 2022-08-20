---
title: 基础内容
order: 1
toc: content
---

# React 学习内容

> 课程笔记 📒
>
> 1. 16.8 之前的函数组件是无状态组件，16.8 引入 react hooks 之后函数组件是有状态组件
> 2. vue 中，data 属性是通过监听 object.defineProperty 处理过的，更改 data 的数据的时候会触发数据的 getter 和 setter，所以 data 中的变量更改时会引起页面的更新；react 中没有这个机制，只有更改 state 中的数据才会触发页面的更新

> 介绍一下 React 是什么？
>
> 1. 讲概念
> 2. 说用途
> 3. 理思路
> 4. 优缺点
>    总结：
>    React 是一个网页 UI 框架，通过组件化的方式解决视图层开发复用的问题，本质是一个组件化框架。
>    React 的核心设计思路是声明式、组件化、通用性；
>    声明式的优势是比较直观，组件化的优势是复用比较方便，通用性是指学习一次，随处编写，比如像 React Native 等；
>    它的缺点是没有提供一揽子方案，在开发大型项目时，需要去社区寻找并且整合方案，造成了一定的学习成本。

## 疑问

- MVC、MVVM 的区别

  - 二者都是设计模式，都是为了处理视图层、数据层以及数据视图之间的通信而诞生的

  - MVC = M（数据层）+ V （视图层）+ C（控制层）

    ![图片](https://pic1.zhimg.com/80/3d2abf5c8d81424c4797201384b456ac_720w.png)

    - Model 和 View 中是观察者模式，当 View 中发生事件处理时，会通过 Controller 改变 Model 再改变 View
    - 性能问题方面，在 MVC 中我们会大量操作 DOM，频繁更新 DOM，会阻塞浏览器渲染，影响用户体验

  - MVVM = M（数据层）+ V （视图层）+ VM（控制层）

    - 和 MVC 的区别就在于，MVVM 使用 ViewModel 替代了 controller，Model 和 View 没有直接的联系
    - ViewModel 从 Model 中获取数据应用到 View 中，View 中发生改变时，也会触发 ViewModel

- react 的虚拟 DOM 是如何实现的，diff 算法做了什么
- 什么是单向数据流
- 函数组件和类组件的区别
  - 思想不同：类组件是面向对象的思想，函数组件是函数式编程
  - 类组件太重了，内部逻辑难以拆分和复用
  - 函数组件会捕获 render 内部的状态，函数组件会每次都重新创建一遍，可以实现状态的同步更新
  - 函数和 react 的理念更贴合，声明式编程

## 重难点

## 一、事件处理中传箭头函数和普通函数的区别

```js
import React, { Component } from 'react';

class APP extends Component {
  a = 1;

  handleClick() {
    console.log(this.a); // 报错：Cannot read properties of undefined (reading 'a')
  }

  render() {
    return (
      <div>
        <input />

        <button
          onClick={() => {
            console.log(this.a); // 1
          }}
        >
          add1
        </button>

        <button onClick={this.handleClick}>add2</button>
      </div>
    );
  }
}

export default APP;
```

### 问题分析 🔍

- 箭头函数的 this 指向是周围环境决定的，传箭头函数的话，可以在箭头函数中获取类组件中的 this

- 普通函数的 this 指向是由调用的对象决定的，而这里的 handleClick 是由 react 的事件系统调用的，**Es6 中规定类中的函数，会默认开启局部的严格模式，也就是说 this 不指向 window，而是 undefind**

### 解决方案 🙋

普通函数通过 bind 去绑定 this，将类组件的 this 手动绑定到函数中

### 补充知识点 🍬

- bind、call、apply 改变 this 指向的区别？
- 手写 bind

```js
const obj1 = {
  name: 'obj1',
  getName() {
    console.log(this.name);
  },
};

const obj2 = {
  name: 'obj2',
  getName() {
    console.log(this.name);
  },
};

obj1.getName(); // obj1
obj1.getName.bind(obj2); // this指向obj2，但是不会自动执行函数，所以不会输出内容
obj1.getName.call(obj2); // 输出obj2，this指向obj2，会自动执行函数，接受参数是一个一个地传
obj1.getName.apply(obj2); // 输出obj2，this指向obj2，会自动执行函数，接受的参数必须是严格的数组
```

## 二、React 中的事件绑定和原生事件绑定的区别 🌟

### 问题分析 🔍

React 并没有将事件绑定到具体的元素身上，而是在 document 身上，通过合成事件实现

**好处**：占用内存小，不用担心去移除事件，完全支持原生事件机制暴露的内容

## 三、React 列表中为什么需要设置 Key 值，并且 key 值为什么不能设置成 index

问题分析 🔍

- 为什么需要 key？

答：当页面中元素发生变化时，虚拟 DOM 会重新计算，根据 key 会比较方便地找出修改的地方，然后将修改的地方通过打补丁的方式同步给真实的 DOM

- 为什么 key 不能设置为 index？

答：如果列表会发生重排、增删的情况下，将 key 设置成 index 会造成同一个元素修改前后 key 值不一样
（只作显示的列表可用 index 作为 key）

```js
/** 结论🍰：
  如果把index当作key的话，333这个元素在修改前后的key值发生了变化，
  虚拟DOM得出的结论是删除了值为333的li元素，实际上是删除了值为222的li标签
*/

// 修改前
<ul>
  <li key="111_0">111</li>
  <li key="222_1">222</li>
  <li key="333_2">333</li>
</ul>

// 修改后
<ul>
  <li key="0">111</li>
  <li key="1">333</li>
</ul>
```

## 四、React 中条件渲染是创建/移除元素还是显示/隐藏元素

答：创建/移除，和 vue 的 v-if 以及 v-show 同理

## 五、React 如何在页面中显示富文本

直白来讲就是在页面中直接解析代码片段，使用之前需确认该代码片段足够安全；

React DOM 在渲染所有输出内容之前，默认会进行转义，所有内容都被转换成了字符串，可以有效地防止[XSS（cross-site-scripting, 跨站脚本）](https://en.wikipedia.org/wiki/Cross-site_scripting)攻击

```js
// 使用dangerouslySetInnerHTML在页面中显示富文本内容
<span
  dangerouslySetInnerHTML={{
    __html: '<b>123456</b>', // 会直接显示加粗的123456，将字符串中的标签解析出来
  }}
></span>
```

## 六、setState 是同步还是异步？

### 问题分析 🔍

setState 在同步事件是异步的，因为每次 state 的改变都会引起重新渲染，为了提高性能，react 会对组件中的 setState 操作进行合并，在事件循环机制中，宏任务执行完了之后才会去执行 setState 操作。[官方解释](https://zh-hans.reactjs.org/docs/faq-state.html)

setState 在异步事件中是同步更新状态。

```js
state = {
  count: 0,
};

add = () => {
  this.setState({ count: this.state.count + 1 });
};

// 同步调用中，setState是异步的，所以最后this.state.count依然1
handleClick1 = () => {
  this.add();
  this.add();
  this.add();
};

// 异步调用中，setState是同步的，最后this.state.count是3
handleClick2 = () => {
  setTimeout(() => {
    this.add();
    this.add();
    this.add();
  }, 0);
};
```

解决方案 🙋

```js
setState(updater, [callback]);

// 第一个参数传对象时，异步更新
setState({ count: 0 });

// 第一个参数传函数时，可以获取到最新的state和props值 => 也是把setState的异步改成同步的方法
setState((state, props) => {
  return { count: state.count + props.step };
});

// 第二个参数是可选的，可以拿到合并更新完的最新结果
setState({ count: 0 }, () => {
  xxxx;
});
```

## 七、state 和 props 的区别和相同点

### 相同点

- 都是 js 对象，都能引起 render 渲染
- 都可以设置默认值

### 不同点

- props 是从父组件传过来的属性，子组件不可以对它进行修改（props 是只读的）
- 只有父组件主动更新 props 才能引起子组件内部的 render 渲染
- state 是组件的内部管理状态，外部无法获取
- 只有通过 setState 更改 state 值才会引起 render 渲染

### 扩展 🏄‍♀️

props 的类属性类型验证（出于性能方面考虑，propTypes 只在开发模式下进行检查）

```js
// 使用组件
<App title="测试" show={false}/>

//写组件
import PropTypes from 'prop-types';

export default class App extends React.component{
  // 写法1：在类的里面定义
  static propTypes = {
    title: PropTypes.string, // 限制title为字符串
    show: PropTypes.bool // 限制show为布尔值
  }

  // 设置默认值
  static defaultProps = {
    show: true
  }
  render() {
    const { title, show } = this.props
    return {show && <div>{title}</div>}
	}
}

// 写法2：在类的外面写
App.propTypes = {
  title: PropTypes.string, // 限制title为字符串
  show: PropTypes.bool // 限制show为布尔值
}
```

PS：函数式组件只能在组件外面写 defaultProps 和 propTypes

## 八、通信

受控组件和非受控组件

广义的说法：通过 React 中的 props 属性完全控制的组件被称为受控组件，否则为非受控组件

在表单元素中，使 React 中的 state 作为唯一数据源，被 React 用 state 控制取值的**表单输入元素**就叫作受控组件

### 父子通信

父传子-->使用 props 传递数据

子传父--> 1. 传递方法；2. 通过 ref 获取子组件

### 非父子通信

- 状态提升（子 1/子 2 --> 父，父 -->子，中间人的模式）
- 发布订阅者模式
- [context 状态树传参](https://zh-hans.reactjs.org/docs/context.html#gatsby-focus-wrapper)（生产者消费者模式）

```js
const { Provider, Customer } = React.createContext()

// 生产者
class Page extends React.component{
  contructor(){
    this.state = {
      defaultValue: 'light'
		}
	}
  render{
    return(
      <Provider value={
        color: this.state.defaultValue,
        setColor: value => this.setState({ defaultValue: value })
      }>
        <Item1/>
        <Item2/>
      </Provider>
    )
  }
}

// 消费者1--改变值的组件
class Item1 extends React.component{
  return(
    <Customer>
      {value => <div onClick={() => value.setColor('dark')}>我来改变值</div>}
    </Provider>
  )
}

// 消费者2--接受值的组件
class Item2 extends React.component{
  return(
    <Customer>
      {value => <div>{value.color}</div>} // color为dark
    </Provider>
  )
}
```

### 扩展问题 🏄‍♀️

➡ 观察者模式：监控一个对象的变化，一旦发生变化，就触发某种操作

🌰：老师观察学生，学生的状态原本是`学习`，一旦发现变为`睡觉`，就让学生去`罚站`

例子分析：

👀 观察者：老师

⛰️ 被观察者：学生

📈 模式：老师发现学生的状态变了，就做出某种响应

👩‍🏫 观察者

- 需要一个身份
- 需要回调函数

👨‍🎓 被观察者

- 属性：自己的状态
- 队列：记录谁在观察自己
- 方法：设置自己的状态，当我发送改变的时候，可以改变自己的状态
- 方法：添加观察者
- 方法：删除观察者

```js
// 观察者构造函数
class Observer {
  constructor(name, fn = () => {}){
    this.name = name
    this.fn = fn
  }
}

// 被观察者构造函数
class Subject {
  constructor (state) {
    this.state = state
    this.observers = [] // 存放观察者
  }

  setState(val) {
    this.setState = val

    // 执行观察者中的回调函数，并将被观察者的数据传给观察者
    this.obervers.forEach(item => {
      item.fn(val)
		})
  }

  // 增加观察者
  addObserver(obs) {
    // 避免重复添加观察者
    if (this.observers.findIndex(obs) < 0) {
      this.observers.push(obs)
    }
  }

  // 删除观察者
  deleteObserver(obs) {
    this.observers = this.observers.filter(item => item !== obs)
	}
}

// 创建观察者
const teacher = new Observer('老师'， state => console.log('因为' + state + '被批评'))
const headermaster = new Observer('校长'， state => console.log('因为' + state + '批评老师'))

// 创建被观察者
const xiaoming = new Subject('学习')

// 先注册观察者，再更改状态
xiaoming.addObserver(teacher)
xiaoming.addObserver(headermaster)
xiaoming.setState('睡觉')

// 输出结果
因为睡觉被批评
因为睡觉批评老师
```

➡ 发布订阅模式：监听某个对象状态的变化，一旦发生变化，通过第三方告知监听者最新状态

比观察者多一个调度中心的概念

现实中的例子 🌰

👨 去书店买书 📖，发现没有，给书店店员 💁 留了个电话，让店员书来了打电话给他

---

👨：观察者

📖 ：被观察者

💁 ：调度中心

```js
// 观察者构造函数
class Observer{
  constructor(){
    this.message = {}
  }

  // 向消息队列中增加事件
  on(type, fn) {
    if (!this.message[type]) {
      this.message[type] = []
		}
    this.message[type].push(fn)
	}

	// 从消息队列中删除事件
	off(type, fn) {
    if (!fn) {
      delete this.message[type]
      return
		}
    if (this.message[type]) {
      this.message[type] = this.message[type].filter(f => f !== fn)
		}
	}

	// 触发消息队列
	tigger(type) {
    if (this.message[type]) {
      this.message[type].map(item => item())
		}
	}
}

// 创建调度中心
const clerk = new Observer()
const callBack1 = name => {
  console.log(name + '到货了！')
}
const callBack2 = name => {
  console.log(name + '只剩5本了！')
}

clerk.on('《活着》', callBack1)
clerk.on('《文城》', callBack1)
clerk.on('《文城》', callBack2)
clerk.off('《文城》', callBack1)
clerk.trigger('《活着》')
clerk.trigger('《文城》')

// 输出结果
《活着》到货了！
《文城》只剩5本了！
```

🌈 区别分析

| 模式     | 观察者   | 发布订阅模式                                                                             |
| -------- | -------- | ---------------------------------------------------------------------------------------- |
| 优点     | 角色明确 | 1. 松耦合，发布者和订阅者无关联，靠调度中心联系<br />2. 灵活性较高，通常应用在异步编程中 |
| 缺点     | 紧耦合   | 当事件类型变多时，会增加维护成本                                                         |
| 使用场景 | 双向绑定 | react 非父子组件通信                                                                     |

## 九、ref

### `React.createRef()`

### `React.forwardRef(props, ref)`

转发 ref，可以直接获取子组件的 DOM 元素

### 扩展问题 🏄‍♀️

**问 1：**通过`React.createRef()`创建 ref 获取子组件的方式为什么不推荐使用？

答：ref 过于暴露，是直接去拿别的

---

**问 2：**不能对函数组件使用 ref，因为函数组件没有实例

答：在函数组件外部包裹 forwardRef，将函数组件转换成能接受 ref 的组件，并且在父组件中使用 useRef 去创建 ref

## 十、插槽

和 vue 中的 slot 类似，原理是使用 this.props.children 去渲染组件里放的内容

### 作用

- 可以用于组件复用
- 减少父子组件通信

```js
// 基本用法
class Com extends React.component {
  render() {
    return <div>{this.props.children}</div>;
  }
}

class CustomerCom extends React.component {
  render() {
    return <Com>我是组件</Com>;
  }
}

// 最终页面显示：我是组件
```

## 十一、生命周期

> 16.2 之后将 diff 算法更新到 Fiber
>
> 16.8 之后出现了 react hooks，函数组件开始有生命周期

**问：为什么 componentWillmount、componentWillUpdate、componentWillReceiveProps 会被废弃？**

**答：**因为将 diff 算法更新到 Fiber 之后，低优先级的任务可能会被打断，也就是说可能会多次执行，而`componentWillmount`就是低优先级的任务，所以一般不建议使用`componentWillmount`，如果要初始化 state 值，推荐在`constructor`中写

### 👴 老生命周期

~~**componentWillmount**~~

初始化，render 之前最后一次修改 state 状态的机会

**render**

只能访问 state 和 props，不允许修改状态和 DOM

**componentDidMount**

DOM 渲染完成后触发，可以修改 DOM，一般用于发送异步请求

~~**componentWillUpdate**~~

state 即将更新的时候调用，和 componentWillmount 一样是低优先级

**componentDidUpdate**

state 更新完成的时候调用

**shouldComponentUpdate**

可以控制 state 更改后是否 render，是 React 中可以**性能优化**的生命周期

```js
shouldComponentUpdate(nextProps, nextState) {
  // 默认值是true，可以通过返回false阻止更新
  if(Josn.strify(this.state) === Josn.strify(nextState)) {
    return false
	}
}

延伸：不能直接修改this.state中的值，因为直接修改了的话，在shouldComponentUpdate中会判断为未修改，会阻止render更新

🍪直接修改this.state，可以改掉state中属性的值，但是不会引发render
```

~~**componentWillReceiveProps**~~：父组件的重新渲染会调用这个回调函数，无论 props 变了没有

这个生命周期可以拿到最新的 props 属性值，是在子组件中使用的，就算父组件传的 props 没有更新，也会使 child 组件生命周期更新

**componentWillUnMount**

组件销毁的时候会调用这个生命周期，可以用来清除事件监听

### 👶 新生命周期

**getDerivedStateFromProps**：derived 是衍生的意思

初始化和 state 更新以及 props 更新都能触发该生命周期，可看作是`componentWillMount`和`componentWillReceiveProps`的结合

适用于第一次更新和后续都会更新的逻辑

```js
// 配合componentDidUpdate使用代替
class Test extends React.component {
  contructor() {
    super();
    this.state = {
      name: '',
    };
  }

  // 因为是静态方法，所以this是undefined
  static getDerivedStatefromProps(nextProps, nextState) {
    /**
    props和state的改变都会触发这个回调函数的执行，但是react内部会将state变化合并处理（每个事件循环机制之后会合并处理），所以对	       性能的影响不大
    */
    return {
      name: nextState.name,
    };
  }

  // 可以拿到最新更新完的状态值
  componentDidUpdate(preProps, preState) {
    // 避免重复执行操作
    if (this.state.name === preState.name) {
      return;
    }
    console.log(this.state.name);
  }
}
```

**getSnapshotBeforeUpdate**：在更新之前获取快照

代替 componentWillUpdate，在 render 之后，componentDidUpdate 之前执行，DOM 渲染之前执行

```js
class Test extends React.component {
  contructor() {
    super();
    this.state = {
      name: 'huhaha',
    };
  }

  componentDidUpdate(preProps, preState, value) {
    // value就是getSnapshotBeforeUpdate返回的值
    console.log(value); // 100
  }

  getSnapshotBeforeUpdate() {
    return 100;
  }
}
```

## 十二、React 的性能优化 🌟

### 手动优化

通过手动控制 shouldComponentUpdate 中返回 true 和 false，去决定是否需要触发 render

### 使用纯组件

PureComponent 通过对 state 和 props 进行浅对比，实现了 shouldComponentUpdate

注意 ⚠️：

- 如果你的 props 和 state 是比较复杂的数据结构，不建议使用 PureComponent，可能需要通过 forceUpdate 去强制组件更新
- PureComponent 中的 shouldComponentUpdate 会跳过所有子组件的 prop 的更新，所以子组件也必须是纯组件

## 十三、React 中的 hooks

### 为什么需要用 hooks？

- 高阶组件为了复用，导致层级太深
- 类组件的生命周期复杂
- 写成 function 组件的无状态组件，后续想添加状态，重构起来比较麻烦

### useState（状态管理）

⚠️：state 的更改会引起整个函数组件的更新，而类组件是只会引起 render 中的内容更新

```js
import { useState } from 'react';
const App = () => {
  const [num, setNum] = useState(1);

  return <div>{num}</div>;
};
```

### useEffect（解决函数的副作用）

1⃣️ 第二个参数中传**空数组**或者**常量**，表示只会在 DOM 挂载完成之后，执行一次，相当于类组件中的 componentDidMount

```js
// 页面渲染完成后发送请求
useEffect(() => {
	// 发送异步请求
	...
}, [])
```

2⃣️ 第二个参数传**依赖的变量**，useEffect 会监听该变量的变化，变量每次变化 useEffect 都会执行

```js
// num每次都会加1
const [num, setNum] = useState(1);
useEffect(() => {
  setNum(num + 1);
}, [num]);
```

3⃣️ 模拟销毁组件前的周期，即 componentWillUnmount

```js
useEffect(() => {
	// 函数体
	...

  return () => {
    ...
  }
}, [])
```

**问：**`useEffect`和`useLayoutEffect`有什么区别？

**答：**简单来说，调用时机不同。

`useLayoutEffect`和`useEffect`功能类似，区别在于前者是在 DOM 更新后调用的，后者是在 DOM 渲染完成后调用的；

一般情况下，官方推荐优先使用`useEffect`，`useLayoutEffect`比较适合用于避免页面抖动，即 DOM 会频繁更新的情况，如果在`useEffect`中操作 DOM 过多的话，会引起页面频繁重绘、重排，所以操作 DOM 建议放在`useLayoutEffect`中

### useCallback（记忆函数）

**问**：记忆指的是什么？

**答**：之前说 state 每次更改都会引起函数组件的更新，按道理 state 的值每次都会变成初始值，但是结果是每次都能拿到前一次操作的结果值，说明 react 内部对 state 进行了缓存，也就是**记忆功能**。

```js
// 对于函数而言，函数组件每次更新，都会被重新定义
const handleClick = useCallback(() => {
  console.log(name)
}, [name])

// 第二个参数的三种情况
- 不传参数：每次都会被重新创建
- 传空数组：不会被重新创建，每次都是拿第一次创建的那个函数
- 传依赖：当依赖发生变化时，才会被重新创建
```

### useMemo（记忆组件）

useMemo 完全可以替换 useCallback，区别在于 useCallback 不执行函数，只是返回函数，

而 useMemo 会执行函数并将函数执行的结果返回，等同于 vue 中计算属性

```js
useCallback(fn, inputs) 等价于 useMemo(() => fn, inputs)

const [num, setNum] = useState(1)
const list = useMemo(() => {
  return num
}, [num])

// 如果第一个参数中的函数没有返回值，useMemo会返回undefind
```

### useRef（保存引用值）

**常规作用**

和 React.createRef 作用相同，通过 ref 获取 DOM 元素或者获取子组件

**保存引用值**

**问：**如何在 react hooks 中保存一个变量？

**答：**由于每次 state 更新都会引起组件的更新，而有些变量不需要引起视图变化，所以我们希望用普通变量存储，而普通变量没有记忆功能，在组件更新的时候会被重新定义，所以需要使用 ref 保存普通变量

```js
import { useRef } from 'react';

const Test = (props) => {
  const nameRef = useRef('测试');
  return <div>{nameRef.current}</div>;
};

// 下次组件更新的时候，nameRef.current的值还是‘测试’
```

### useContext（跨级通信）

需要结合类组件中的 createContext 使用，也是用来实现跨级通信的

```js
const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    // 向下传递数据
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  // 使用数据
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

**useReducer**

当组件状态比较多的时候，逻辑复杂且有很多子组件的情况下，useReducer 比 useState 更适用

**替代 useState**

```js
// 替代useState实现计时器功能
const reducer = (state, action) => {
  switch(action.type) {
    case 'increment':
      return { count: state.count++ }
    case: 'decrement':
      return { count: state.count-- }
    case: 'set':
      return { count: action.payload }
    case: 'reset':
      return init(action.payload)
    default:
      return state
	}
}

const initState = { count: 1 }

const init = (state) => { count: state }

const App = () => {
  const [state, dispatch] = useReducer(reducer, initState, init)
  return (
    <div>
      <button onClick={() => dispatch({ type: 'increment' })}>加</button>
      {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>减</button>
      <button onClick={() => dispatch({ type: 'set', payload: { count: 10 } })}>设置为10</button>
      <button onClick={() => dispatch({ type: 'reset', payload: initState })}>重置</button>
    </div>
  )
}
```

**结合 useContext 使用**

当子组件层级比较深的时候，我们可以通过 context 将 reducer 的 state 和 dispatch 传给子组件，这样子组件之间也可以进行通信

```js
import React, { useContext, useReducer } from 'react'

const reducer = (state, action) => {
  switch(action.type) {
    case 'increment':
      return { count: state.count++ }
    case: 'decrement':
      return { count: state.count-- }
    default:
      return state
	}
}

const initState = { count: 1 }

const GlobalContext = React.createContext()
const App = () => {
  const [state, dispatch] = useReducer(reducer, initState)

  return <GlobalContext value={{ state, dispatch }}>
    <Child1/>
    <Child2/>
  </GlobalContext>
}

// 改变state值
const Child1 = () => {
  const { dispatch } = useContext(GlobalContext)

  return <button onClick={() => dispatch({ type: 'increment' })}>+</button>
}

// 显示state值
const Child2 = () => {
  const { state } = useContext(GlobalContext)

  return <div>{state.count}</div>
}
```

### 自定义 hooks🌟

当我们想在两个函数之间共享逻辑时，我们会把它提取到第三个函数中。

**使用场景**：输入框搜索内容的时候防抖

```js
// 普通的防抖函数
const debounce = (fun, timeout) => {
  let timeId = null;
  return function () {
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      fun.call(this);
    }, timeout);
  };
};

// 自定义hook实现的防抖函数
const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
};
```

## 十三、状态管理

### redux

疑问 🤔️

1. redux 和 react-redux 的区别？
2. redux 中有哪些内容？
3. redux 的流程图怎么画？
4. redux 中的 reducer 和 hook 中的 useReducer 有什么关系？
5. redux 相对其他框架的优缺点
6. redux 如何实现异步操作

### 概念

#### store

#### action

#### reducer

### Dva

### Vuex
