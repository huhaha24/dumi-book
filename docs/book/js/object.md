---
title: 对象
order: 3
toc: content
---

## 一、对象的属性

### 属性的特性

- [[Configurable]]：是否可配置，默认值为 true
- [[Enumerable]]：是否可以通过 for in 进行访问，默认为 true（💡 延伸知识点：[for in 与 for of 的区别]()）
- [[Writable]]：是否可被修改，默认为 true
- [[Value]]：该属性的属性值，默认为 undefined

要修改属性的默认值，需要使用`Object.defineProperty()`方法（💡 延伸知识点：[vue2 中如何使用 defineProperty 实现双向绑定，vue3 中为什么改成使用 proxy]()）

如果使用`Object.defineProperty()`对属性特性进行修改后，再次执行错误的操作的话，非严格模式会忽略，但严格模式会报错（💡 延伸知识点：[js 的严格模式和非严格模式]()）

## 二、创建对象的方式

### 1.直接创建

😊 优点：快速、简单

😢 缺点：需要多个类似对象时，工作量大，重复内容多

```js
// 使用字面量创建
const person1 = {
  name: 'person1',
  age: 12,
};

// 使用原生Object构造函数创建
const person2 = new Object();
person2.name = 'person2';
person2.age = 14;
```

### 2.工厂模式

😊 优点：可以量产，不需要一个一个地创建

😢 缺点：无法识别该对象的类型

```js
// 可以看作是一个小小的封装
const person = function (name, age) {
  const o = new Object();
  o.name = name;
  o.age = age;

  return o;
};
```

### 3.构造函数

😊 优点：量产，可以识别对象的类型

😢 缺点：构造函数内部方法会重复创建，浪费内存

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const p1 = new Person('p1', 12);
const p2 = new Person('p2', 13);
```

#### 构造函数的特点

（💡 延伸知识点：[new 一个对象的过程发生了什么](#newObject)）

1. 构造函数本身就是函数，像 Object、Array 都是原生的构造函数
2. 我们的构造函数可以理解为自定义的构造函数，拥有我们自定义的属性和方法
3. 构造函数要求首字母大写
4. 构造函数和普通函数的唯一区别就是调用方式不同，使用`new`调用的都可以作为构造函数

👇 以下代码说明了**第 4 点**，普通函数和构造函数的区别仅仅在于调用方式不同

```js
function Person(name, age) {
  this.name = name;
  (this.age = age),
    (this.getName = () => {
      console.log(name);
    });
}

// 使用new进行调用
const p1 = new Person('p1', 12);
const p2 = new Person('p2', 13);

// 直接当普通函数调用，这样的话会直接将this挂载到window上
Person('p1', 12);
window.getName(); // p1

// 使用call，apply来改变作用域
const object = new Object();
Person.call(object, 'p2', 13);
object.getName(); // p2
```

### 4.原型模式

😊 优点：将共享的内容存放在原型中，实例访问的是同一个内容，节省了内存

😢 缺点：当共享属性值是引用类型时，一个实例改了属性值，会造成其他实例的该属性值都发生变化

```js
function Person() {}

Person.prototype.name = 'huhu';
Person.prototype.age = 18;
Person.prototype.getName = function () {
  console.log('My name is ', this.name);
};

const person1 = new Person();
const person2 = new Person();

console.log(person1.getName === person2.getName); // true
```

### 4.原型模式+构造函数模式

😊 优点：支持外界传值，既节省了内存，也避免了不同实例之间因为修改数据互相影响

😢 缺点：需要将构造函数和原型分开写，没有封装到一起，使用不方便

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.list = [1, 2];
}

Person.prototype = {
  constructor: Person,
  sayName: function () {
    console.log('My name is ', this.name);
  },
};

const person1 = new Person('person1', 18);
const person2 = new Person('person2', 23);
person1.list.push(3);

console.log(person2.list); // [1, 2]
console.log(person1.list === person2.list); // false
```

每个通过`Person`创建的实例，都有属于自己的 name、age、list 等属性，对于引用数据类型，例如 list，不同实例引用不同的数组，所以不会互相影响。

### 5.动态原型模式（完美模式）

😊 优点：将构造函数和原型写在一起，创建实例的时候更方便

```js
function Person(name, age) {
  this.name = name
  this.age = age
  this.list = [1, 2]

  if (typeof this.sayName !== 'function') {
    Person.prototype.sayName = function {
      console.log('My name is ', this.name)
    }
  }
}

const person = new Person('huhu', 20)
```

这种方式更像是对原型进行扩展，不能使用字面量重写原型，这样会切断实例和原来的原型的联系

> 使用动态原型模式时，不能使用对象字面量重写原型。前面已经解释过了，如果在已经创建了实例的情况下重写原型，那么就会切断现有实例与新原型之间的联系。 --来自红宝书

这句话，乍一看，很难理解，但是结合[new 一个实例发生了什么](#newObject)，就好理解了。
由于实例的`__proto__`的赋值在`Person`修改之前，所以改变 Person 的原型不会改变实例的原型，就会失去联系

## 💻 面试题

### <span id="newObject">new 一个对象的过程发生了什么</span>

总共四步：

1. 创建一个新的对象
2. 将构造函数中的 this 指向新创建的对象（this 就是作用域，用来管你可以访问哪些内容的）
3. 执行构造函数中的代码（将属性添加给新对象）
4. 返回新对象

用代码描述：

```js
const person = new Person();
// 1. 创建一个对象
const obj = {};

// 2. 将构造函数中的内容添加到新对象中
obj.__proto__ = Person.prototype;

// 3. 将this指向新对象
Person.call(obj);

// 4. 返回新对象
return obj;
```
