---
title: 数据类型
order: 1
toc: content
---

# 数据类型

## 一、基本数据类型

- String
- Number
- Boolean
- Null
- Undefined
- Symbol

（💡 延伸知识点：[null 和 undefined 的区别和关系]()）

## 二、引用数据类型

- 基本引用类型：`Object`、`Function`、`Array`、`Date`、`RegExp`、`Error`
- 基本包装类型：`Boolean`、`Number`、`String`
- 单体内置对象：`Global`、`Math`

💡 注意：基本包装类型是为了便于操作基本数据类型，创建的一个对象，操作基本数据类型的代码一经执行，就会被销毁。
同时它们都是`object`的实例，所以继承了`object`上的属性和方法，例如`toString`，以下等式成立：

```js
new Number(123).toString() === '123'; // true
```

## 三、类型判断

### typeof

```js
typeof 'huhu'; // string
typeof 123; // number
typeof true; // boolean
typeof null; // object
typeof undefined; // undefined
typeof Symbol(); // symbol
typeof new Function(); // fuction
typeof new Array(); // object
typeof new Date(); // object
typeof new Error(); // object
typeof new RegExp(); // object
```

> **`null`使用`typeof`检测出来后返回的是`object`**，原因是第一版 js 设计中，不同的对象在底层都表示为二进制，而 js 会把二进制前 3 位都为 0 的判定为`object`，`null`的二进制全都是 0，所以使用`typeof`检测的时候会返回`Object`。 --《你不知道的 javascript》

#### 🔍 总结

对于基本数据类型，使用`typeof`可以返回相应的类型（`null`除外），对于引用类型，`typeof`都会返回`object`（除了`Fuction`能正确返回`fuction`）。

### instanceof

```js
function A() {}

const a = new A();
console.log(a instanceof A); // true
console.log(a instanceof Object); // true

const s = new String('huhu');
console.log(s instanceof String); // true
console.log(String instanceof Object); // true
```

#### 🔍 总结

`instanceof`是通过原型来判断的，只能判断`A`是否为`B`的实例。当然，`B`继承自`Object`，`A instanceof Object === true`也是成立的。

### constructor

```js
function A() {}

const a = new A();

// 改变之前
console.log(A.prototype.constructor); // [Function: A]

// 手动改变原型，此时原型的constructor指向Object
A.prototype = {};

// 改变之后
console.log(A.prototype.constructor); // [Function: Object]

const a1 = new A();

console.log(a.constructor === A); // true
console.log(a1.constructor === A); // false
```

#### 🔍 总结

`null`和`undefined`没有`constructor`，而且在实现继承的时候，`constructor`可能会被重写，所以使用`constructor`进行判断是不太准确的。

### toString()

```js
Object.prototype.toString.call(1); // [object Number]
Object.prototype.toString.call('1'); // [object String]
Object.prototype.toString.call(null); // [object Null]
Object.prototype.toString.call(undefined); // [object Undefined]
```

每个对象都有一个`toString()`方法，当要将对象表示为文本值或以预期字符串的方式引用对象时，会自动调用该方法。默认情况下，从`Object`派生的每个对象都会继承`toString()`方法。如果此方法未在自定义对象中被覆盖，则`toString()`返回`[Object type]`，其中`type`是对象类型。

## 四、存储方式

（💡 延伸知识点：[深拷贝和浅拷贝]()）

**基本数据类型**：保存在**栈**中，因为这些类型在内存中分别占有固定的大小空间，通过**按值访问**。

**引用数据类型**：保存在**堆**中，因为这些类型的值大小是不固定的，但内存地址是固定的，所以会将它们的引用放在栈中，值放在堆中。查询引用类型变量时，会先从**栈读取内存地址**，然后再通过地址找到**堆中的值**，这个过程叫**按引用访问**。

<div align=center><img src="http://resource.muyiy.cn/image/2019-07-24-060214.png"></div>

## 🙋 面试题

### 1、深浅拷贝

#### 什么是浅拷贝？

```js
const source1 = 12;
const source2 = { name: 'huhu' };

let t1 = source1;
const t2 = source1;

const t3 = source2;
const t4 = source2;

t1 = 15;
console.log(t2); // 12

t3.name = 't3';
console.log(t3); // { name: 't3' }
console.log(source2); // { name: 't3' }
```

简单来讲，浅拷贝就是只复制了一层，拷贝第一层的基本数据类型值，以及第一层的引用类型地址。由于引用类型复制的是地址，所以`t3`和`t4`都是指向`source2`在堆中的地址，所以改了`name`之后，`t4`和`source`的`name`值都会改变。

#### 浅拷贝的场景

##### Object.assign

```js
const a = {
  name: 'huhu',
  book: {
    title: 'js',
    price: 23,
  },
};

const b = Object.assign({}, a);
a.name = 'a';
a.book.price = 45;

console.log(b); // { name: 'huhu', book: { title: 'js', price: 45 } }
```

`Object.assign`是将所有可枚举属性的值从一个或多个源对象复制到目标对象，同时返回目标对象。[原理](https://muyiy.cn/blog/4/4.2.html)

##### 扩展符

```js
const a = {
  name: 'huhu',
  book: {
    title: 'js',
    price: 23,
  },
};

const b = { ...a };
a.name = 'a';
a.book.price = 45;

console.log(b); // { name: 'huhu', book: { title: 'js', price: 45 } }
```

从上面的例子可以看到，其实`Object.assign`和扩展符都不是深拷贝，虽然它们比直接赋值多拷贝一层，但是当有子对象的时候，它们只能复制表面的一层，改变子对象的属性值还是会相互影响。

#### 什么是深拷贝？

**深拷贝**：顾名思义，就是深层次拷贝，简单来讲就是拷贝前后的两个对象相互不影响。深拷贝相比于浅拷贝速度较慢并且花销较大。

#### 深拷贝的场景

##### 使用 JSON.prase(JSON.stringify(object))

```js
const a = {
  name: 'huhu',
  book: {
    title: 'js',
    price: 23,
    author: undefined, // undefined
    id: Symbol('js'), // Symbol
    copyright: () => {}, // 函数
  },
};

const b = JSON.parse(JSON.stringify(a));
b.book.title = 'JS';

console.log(a);
/** a的值
 * {
    name: 'huhu',
    book: {
      title: 'js',
      price: 23,
      author: undefined,
      id: Symbol(js),
      copyright: [Function: copyright]
    }
  }
 */
console.log(b); // { name: 'huhu', book: { title: 'JS', price: 23 } }
```

这种方式能实现深拷贝，但是有些问题：

- undefined 会被忽略
- Symbol 会被忽略
- 函数会被忽略
- 不能序列化函数
- 不能解决循环引用的对象
- 不能正确处理`new Date()`（解决方法：转换成时间戳）
- 不能正确处理正则

#### 手动实现深拷贝

去这里 👉[手撕深拷贝](/book/code/deep-copy)

### 2、精度问题

### 3、null 和 undefined 的区别
