---
title: 调用堆栈
order: 2
toc: content
---

## 执行上下文

执行上下文是 js 代码被解析和执行时所在环境的抽象概念。

### 类型

- **全局执行上下文**：只有一个，在浏览器中全局对象就是`window`，`node`中是`modules`，`this`就是指向这个全局对象。
- **函数上下文**：有无数个，只有函数被调用时才会创建，每次调用函数都会创建一个新的执行上下文。
- **eval 函数执行上下文**：运行在 eval 函数中的代码，很少使用且不建议使用。

### 生命周期

执行上下文的生命周期为：**创建阶段** --> **执行阶段** --> **回收阶段**

#### 🍃 创建阶段

直接看伪代码更直观

```
ExecutionContext = {
  ThisBinding = <this value>,     // 确定this
  LexicalEnvironment = { ... },   // 词法环境
  VariableEnvironment = { ... },  // 变量环境
}
```

1. 确定**this**的值，也称**This Binding**

- **全局执行上下文**：`this`指向全局对象，浏览器中`this`指向`window`，`node`中`this`指向`module`对象
- **函数执行上下文**：`this`值取决于函数的调用方式。具体有：
  - 默认绑定
  - 隐式绑定
  - 显示绑定
  - new 绑定
  - 箭头函数

2. **词法环境**(LexicalEnvironment)组件被创建
   有两个组成部分

- 环境记录：存储变量和函数声明的实际位置
- 对外部环境的引用：可以访问其外部词法环境

分为两种环境

- 全局环境：没有外部环境，其外部环境引用为 null。拥有一个全局对象（如 window）及其关联的原生的构造函数（Object、Array 等）以及用户自定义的属性，`this`指向这个全局对象。
- 函数环境：用户在函数中定义的变量被存储在**环境记录**中，包含了`arguments`对象。对外部环境的引用可以是全局环境，也可以是外部的函数环境。

直接看伪代码会更加直观

```js
GlobalExectionContext = {  // 全局执行上下文
  LexicalEnvironment: {    	  // 词法环境
    EnvironmentRecord: {   		// 环境记录
      Type: "Object",      		   // 全局环境
      // 标识符绑定在这里
      outer: <null>  	   		   // 对外部环境的引用
  }
}

FunctionExectionContext = { // 函数执行上下文
  LexicalEnvironment: {  	  // 词法环境
    EnvironmentRecord: {  		// 环境记录
      Type: "Declarative",  	   // 函数环境
      // 标识符绑定在这里 			  // 对外部环境的引用
      outer: <Global or outer function environment reference>
  }
}
```

3. **变量环境**(VariableEnvironment)被创建
   变量环境也是一个词法环境，因此它拥有词法环境的所有属性。

在 ES6 中，词法 环境和 变量 环境的区别在于前者用于存储**函数声明和变量（ let 和 const ）绑定，而后者仅用于存储变量（ var ）**绑定。

看下面的例子：

```js
let a = 20;
const b = 30;
var c;

function multiply(e, f) {
  var g = 20;
  return e * f * g;
}

c = multiply(20, 30);
```

执行上下文创建过程

```js
// 全局执行上下文
GlobalExectionContext = {

  // 1. 确定this的值，这里是全局对象
  ThisBinding: <Global Object>,

  // 2. 创建词法环境
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 标识符绑定在这里
      // 使用let、const不会设置初始值
      a: < uninitialized >,
      b: < uninitialized >,
      multiply: < func >
    }
    outer: <null>
  },

  // 3. 创建变量环境
  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 标识符绑定在这里
      // 使用var定义变量，会默认设置为undefined
      c: undefined,
    }
    outer: <null>
  }
}

// 函数执行上下文
FunctionExectionContext = {

  ThisBinding: <Global Object>,

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 标识符绑定在这里
      Arguments: {0: 20, 1: 30, length: 2},
    },
    outer: <GlobalLexicalEnvironment> // 外部引用是全局环境
  },

  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 标识符绑定在这里
      g: undefined
    },
    outer: <GlobalLexicalEnvironment>
  }
}
```

#### 🏃‍♀️ 执行阶段

在上下文中运行/解释函数代码，并在代码逐行执行时分配变量值。

- 全局上下文的变量对象初始化是全局对象
- 函数上下文的变量对象初始化只包含 Arguments 对象
- 在进入执行上下文时，会给变量添加**形参**、**函数声明**、**变量声明**等初始的属性值
- 在代码执行阶段，会再次修改变量对象的属性值

💡 注意：在执行阶段，如果 JS 引擎不能在源码中声明的实际位置找到`let`变量的值，它会被赋值为`undefined`。

#### 🚮 回收阶段

执行上下文出栈等待虚拟机回收执行上下文

### 各种提升

#### 一、变量提升

```js
foo; // undefined

var foo = function () {
  console.log('foo1');
};

foo(); // foo1，被赋值

var foo = function () {
  console.log('foo2');
};

foo(); // foo2，被重新赋值
```

#### 二、函数提升

```js
foo(); // foo2

function foo() {
  console.log('foo1');
}

foo(); // foo2

function foo() {
  console.log('foo2');
}

foo(); // foo2
```

这里都输出`foo2`是因为，同一作用域下的同名函数会被覆盖，然后由于执行上下文是先创建词法环境，再执行，所以在执行之前，foo()都是调用的后面的那个函数。

#### 三、声明优先级

```js
foo(); // foo2

var foo = function () {
  console.log('foo1');
};

foo(); // foo1

function foo() {
  console.log('foo2');
}

foo(); // foo1
```

函数的声明优先级是高于变量声明的。
这个例子比较难理解，我们分开来看：

```txt
// 🌟第一遍：只看声明，忽略调用
foo -> undefined
foo -> function

由优先级可知，最终foo = function

// 🌟第二遍：只看调用，忽略声明
第一个foo()，此时foo是后面的function，所以输出foo2
第二个foo()，由于调用之前经历了对foo的赋值，此时foo现在是前面那个函数，所以输出foo1
第三个foo()，foo没有改变，还是之前那个函数，所以依然输出foo1
```

## 执行栈

也叫做调用栈，具备栈先进后出的特点，用于存储代码在执行期间创建的执行上下文。

```js
function a() {
  console.log('before b');
  b();
  console.log('after b');
}

function b() {
  console.log('in b');
}

a();
console.log('in global');

// before b
// in b
// after b
// in global
```

来个动图直观地感受一下 👇：

<div align=center><img width="200" src="../../../static/gif/stack.gif"></div>

### 练习题

请分别画出下面两段代码的调用栈

```js
function a() {
  const name = 'huhu';

  function b() {
    console.log(name);
  }

  return b();
}

a();
```

```js
function a() {
  const name = 'huhu';

  function b() {
    console.log(name);
  }

  return b;
}

a()();
```

答案 👇

```js
// 第一种
ECStack.push(<a> functionContext)
ECStack.push(<b> functionContext)
ECStack.pop
ECStack.pop

// 第二种
ECStack.push(<a> functionContext)
ECStack.pop
ECStack.push(<b> functionContext)
ECStack.pop
```

## 🙋 面试题

### 一、什么是变量提升？

- 变量提升指一个变量在声明之前，可以直接使用
- var 存在变量提升，let、const 没有变量提升
- 在执行上下文的创建阶段，var 声明的变量会被默认赋值为`undefined`，let、const 声明的变量会保持未初始化的状态。

### 二、为什么会出现变量提升？

这是 js 设计的时候的一个缺陷，ES6 的 let、const 出来之后，就不再推荐使用 var 了。

### 三、为什么在 vue 项目中先使用变量，再用 let 声明变量，不会报错？

答：因为 vue 项目中配置了`babel`，会将 ES6 的代码转换成 ES5 的代码再进行编译，也就是`let`、`const`都会被转换成`var`，而`var`存在变量提升，所以最后会输出`undefined`，而不是报错。
