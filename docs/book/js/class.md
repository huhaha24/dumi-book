---
title: class
order: 6
toc: content
---

## 疑问 🤔️

- 如何使用 ES5 去实现 ES6 中的类？
- class 继承和 ES5 中的继承区别在哪里？
- 如何理解 react 中的类和 class？
- 面试的时候考点在哪里？

## 一、基本语法

### 基本写法

#### 构造函数+原型写法（ES5）

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.add = function () {
  console.log(this.x + this.y);
};

const p = new Point(1, 2);
p.add(); // 3
```

#### class 写法（ES6）

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // 在原型上定义add方法
  add() {
    console.log(this.x + this.y);
  }
}

const p = new Point(1, 2);
p.add(); // 3
```

我们可以看到，ES5 中将实例属性放在构造函数中，共享方法放在构造函数的原型上；ES6 的`class`让对象原型写法更简单，`class`内部的`constructor`方法就是构造函数，`class`的方法都是定义在原型上。

#### 与 ES5 的区别

1. class 内部的方法是不可枚举的，而 ES5 中原型上的方法是可枚举的；（可枚举：用 Object.keys 可遍历到）
2. class 内部默认使用严格模式。（💡 延伸知识点：[严格模式]()）

### constructor 方法

- 每个`class`有且只能有一个`constructor`方法，如果不显示声明，Js 引擎会自动为它添加一个空的`constructor`。
- `constructor`方法默认返回实例对象，即`this`
- `class`和普通函数的区别是，它必须使用`new`去调用，否则会报错

### 类的实例对象

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add() {
    console.log(this.x + this.y);
  }
}

const p1 = new Point(1, 2);
const p2 = new Point(3, 4);

console.log(p1.__proto__ === p2.__proto__); // true
console.log(p1.__proto__ === Point.prototype); // true
```

和 ES5 一样，类的每个实例对象都有一个**proto**属性，并且都指向类的原型。

注意：不推荐使用实例的**proto**属性去更改原型，这样会影响到其他实例

### class 的私有内容

#### 私有属性

ES6 中不支持私有属性，有一个提案中为 class 增加了私有属性，使用#来表示。

#### 私有方法

class 本身是不提供私有方法的，但是我们可以通过一些方法去实现。

##### 方法一：直接在命名上做区别

```js
class Point {
  add() {
    this._bar();
  }

  _bar() {
    console.log('add');
  }
}
```

在方法名前面加\_表明它是内部方法，但是实际上它还是在原型上，通过实例依然可以调用。

##### 方法二：结合 call

```js
class Point {
  add(num) {
    bar.call(this, num);
  }
}

function bar(num) {
  this.num = num;
}
```

将`Point`的`this`通过`call`给`bar`，这样`Point`的实例可以直接调用`bar`方法，但是外部不能直接调用。

##### 方法三：利用 Symbol 的特性

```js
const bar = Symbol('bar');
const num = Symbol('num');

class Point {
  add(n) {
    this[bar](n);
  }

  [bar](n) {
    this[num] = n;
  }
}
```

利用了`Symbol`通过`Object.keys`和`for in`获取不到的特性，实现了私有方法。

### class 中 this 指向

`class`中`this`默认指向它的实例。但是如果把类中的方法通过解构拿出来直接用，this 就会指向它所在的环境。

### class 的静态内容

#### 静态方法

类相对于实例的原型，它定义的所有方法都会被实例继承。

如果在方法前面加上`static`关键词，这个方法就是**静态方法**，不会被实例继承，并且它只能通过类调用。

```js
class Point {
  static classMethod() {
    console.log('classMethod');
  }
}

const p = new Point();
p.classMethod(); // 报错：不存在这个方法
```

- 父类的静态方法可以被子类继承

- 子类也可以通过 super 调用父类的静态方法

#### 静态属性

和静态方法类似，通过`static`关键词标志**静态属性**，**静态属性**是`class`本身的属性。

```js
class Person {
  static sexy = 'woman';
}
```

#### 实例属性

以前我们将实例属性写在`constructor`中，现在只要写在 class 内部，就会被认为是实例的属性。

```js
class Person {
  // 以前的写法
  constructor(name) {
    this.name = name;
  }

  // 现在的写法
  age = 12;
}
```

### new.target 属性

`new.target`是 ES6 新增的内容，是用来确定构造函数是怎么调用的，如果不是通过`new`调用，`new.target`会返回`undefined`。

```js
// 构造函数使用，通过new调用时，new.target指向构造函数
function Person (name) {
  this.name = name
  console.log(new.target === Person)
}

const p = new Person('张三') // true
const p1 = Person.call(p, '李四') // false

// 类中使用，通过new调用时，new.target指向类
class PersonClass {
  constructor(name) {
    this.name = name
    console.log(new.target)
    console.log(new.target)x
  }
}

const ppp = new Person('王五') // PersonClass

// 继承
class Woman extends PersonClass {
  constructor(name) {
    super(name)
  }
}

const wp = new Person('女人') // Woman
```

💡 需要注意的是：子类继承父类时，`new.target`会指向子类。[相关面试题](#onlyInheritClass)

### class 特点

#### class 表达式

class 和函数一样也可以使用表达式的形式创建，如下 👇

```js
// 表达式定义类
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};

const instance = new MyClass();
instance.getClassName(); // Me
Me.name; // 报错：Me is not defined

// 立即执行类
const person = new (class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
})('张三');

person.sayName(); // 张三
```

#### 不存在变量提升

必须先定义类，才能使用类。这样规定是为了继承的时候不报错。

#### name 属性

`class`的`name`属性继承自 ES5 中的构造函数

```js
class Point {}

Point.name; // Point
```

## 二、继承

### extends

class 使用 extends 实现继承，必须和 super 搭配使用。

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class Woman extends Person {
  constructor(name, age, hairColor) {
    super(name, age); // 调用父类的构造函数
    this.hairColor = hairColor;
  }
}
```

这样就实现了一个最简单的继承。

### super

#### super 作为函数调用

```js
class A {}

class B {
  constructor() {
    super(); // 调用一次父类构造函数
  }
}
```

`super`作为函数调用时代表**父类的构造函数**，`super()`相当于`A.prototype.constructor.call(this)`，这里的 this 是 B 的实例。

🔑 核心：**也就是将父类的原型构造函数指向子类的实例**。

#### super 作为对象调用

##### 在普通方法中调用

`super`在普通方法中调用时，指向**父类的原型**，也就是 super 可以访问父类原型上的方法，但是不能访问实例的属性

```js
class Person {
  fun() {
    return 2;
  }
}

class Man {
  constructor() {
    super();
    console.log(super.fun()); // 2
  }
}
```

##### 在静态方法中调用

`super`在静态方法中调用时，指向**父类**。

```js
class Person {
  static fun() {
    return 2;
  }

  fun() {
    return 3;
  }
}

class Man {
  static getFun() {
    console.log(super.fun()); // 2
  }

  getFun() {
    console.log(super.fun()); // 3
  }
}
```

## 🙋 面试题

### <span id="onlyInheritClass">1、如何实现一个只能继承不能实例化的类？</span>

思路：利用类被继承的时候，`new.target`指向子类的特点实现

```js
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化！');
    }
  }
}

new Shape(); // 报错：本类不能实例化！
```

### <span id="super">2、class 的构造函数中 super 作为函数调用时，做了什么？</span>

思路：将父类的原型构造函数指向子类

```js
class A {}

class B extends A {
  constructor() {
    super(); // A.prototype.constructor.call(this)
  }
}
```

### 3、ES5 中的继承和 ES6 中的继承有什么区别？

- ES5 中继承的实质是

  - 创建子类的实例对象 this
  - 将父类的方法添加到 this 上，通过`Person.call(this)`

- ES6 中继承的实质是
  - 创建父类的实例对象 this
  - 调用`super()`，再用子类的构造函数修改 this
