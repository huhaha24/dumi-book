---
title: 手写bind
order: 2
toc: content
---

# 手写 call、apply、bind

## 一、实现 call 和 apply

### 使用场景

#### 合并数组

```js
const a1 = [1, 2, 3];
const a2 = [4, 5];

Array.prototype.push.apply(a1, a2); // 相当于a1.push(...a2)
console.log(a1); // [1, 2, 3, 4, 5]
```

#### 检测数据类型

```js
const a = [1];
Object.prototype.toString.call(a); // [object Array]
```

#### 获取数组中的最值

```js
const a = [1, 23, -9, 78];

Math.max.apply(Math, a); // 78
Math.min.apply(Math, a); // -9
```

#### 将类数组对象转为数组

```js
var domNodes = document.getElementsByTagName('*');
domNodes.unshift('h1');
// TypeError: domNodes.unshift is not a function

var domNodeArrays = Array.prototype.slice.call(domNodes);
domNodeArrays.unshift('h1'); // 505 不同环境下数据不同
// (505) ["h1", html.gr__hujiang_com, head, meta, ...]
```

（💡 延伸知识点：[什么是类数组对象？](/daily/2022/07-05)）

#### 实现构造函数的继承

```js
function SuperFun() {
  this.color = ['red', 'black'];
}

function SubFunction() {
  SuperFun.call(this);
}

const s1 = new SubFunction();
s1.color.push('yellow');

const s2 = new SubFunction();

console.log(s1); // ['red', 'black', 'yellow']
console.log(s2); // ['red', 'black']
```

### 特点

- this 参数传入`undefined`、`null`时，this 会默认指向 window（严格模式下指向 undefined）
- 函数是可以有返回值的
- this 参数传入基本数据类型时，会调用 Object()自动转换

### 实现思路

使用了`call`之后，`foo`中的`this`指向`person`，最后输出的是`person`的`name`属性值

```js
const person = {
  name: 'huhu',
};

function foo() {
  console.log(this.name);
}

foo.call(person); // huhu
```

#### 第一步：实现无参数版 call

```js
Function.prototype.call2(context) {
  context.fun = this
  context.fun()

  delete context.fun
}

// test
foo.call2(person) // huhu
```

#### 第二步：实现传参(ES3)

```js
Function.prototype.call2(context) {
  context.fun = this

  const arr = []
  // 从第二个开始取是因为，第一个参数是this
  for(let i = 1; i < arguments.length; i++) {
    arr.push(`arguments[${i}]`)
  }

  eval(`context.fun(${arr})`)

  delete context.fun
}
```

#### 第二步：实现传参(ES6)

```js
Function.prototype.call2(context, ...arguments) {
  context.fun = this
  context.fun(...arguments)

  delete context.fun
}
```

#### 第三步：处理边界情况(ES3 版本)

```js
Function.prototype.call2(context) {
  // 第一个参数传null或undefined时，this默认指向window；
  // 第一个参数传基本数据类型时，默认转换成Object类型
  context = context ? Object(context) : window
  context.fun = this

  const arr = []
  for(let i = 1; i < arguments.length; i++) {
    arr.push(`arguments[${i}]`)
  }

  const result = eval(`context.fun(${arr})`)

  delete context.fun

  return result
}
```

## 二、实现 bind

### 使用场景

#### 保存 this

```js
// 本例在浏览器环境下
const name = 'window';

function Person(name) {
  (this.name = name),
    (this.getName = function () {
      setTimeout(function () {
        console.log(`Hello，${this.name}`);
      });
    });
}

const p = new Person('huhu');
p.getName(); // Hello，window
```

通过上面的例子我们可以看到，`this`丢失了，也就是`this`并不是指向构造函数的实例的。由于`setTimeout`函数是全局环境调用的，所以此时`this`会被默认绑定到全局环境，在浏览器环境下也就是`window`。

##### 方法一：在外部作用域保存住 this

```js
// 本例在浏览器环境下
const name = 'window';

function Person(name) {
  (this.name = name),
    (this.getName = function () {
      const that = this; // 保存住this
      setTimeout(function () {
        console.log(`Hello，${that.name}`);
      });
    });
}

const p = new Person('huhu');
p.getName(); // Hello，huhu
```

##### 方法二：使用 bind 进行强绑定

```js
// 本例在浏览器环境下
const name = 'window';

function Person(name) {
  (this.name = name),
    (this.getName = function () {
      setTimeout(
        function () {
          console.log(`Hello，${this.name}`);
        }.bind(this),
      ); // 使用bind进行强绑定
    });
}

const p = new Person('huhu');
p.getName(); // Hello，huhu
```

💡 注意：这里不能使用`call`或`apply`，因为`setTimeout`第一个参数必须为函数，只有`bind`才会返回函数，`call`、`apply`会直接执行函数。

##### 方法三：使用箭头函数

```js
// 本例在浏览器环境下
const name = 'window';

function Person(name) {
  (this.name = name),
    (this.getName = function () {
      setTimeout(() => {
        // 使用箭头函数代替普通函数
        console.log(`Hello，${this.name}`);
      });
    });
}

const p = new Person('huhu');
p.getName(); // Hello，huhu
```

#### 封装类型检测函数

```js
const getType = Function.prototype.call.bind(Object.prototype.toString);

getType([1, 2, 3]); // [object Array]
getType('123'); // [object String]
getType(123); // [object Number]
getType(Object(123)); // [object Number]
```

先通过`Function.prototype.call`确定 this，然后将`Object.prototype.toString`传入`bind`中，返回一个函数。

💡 注意：这里有个前提是`Object.prototype`上的`toString`方法没有被覆盖，`getType`方法才起作用。

#### 柯里化

```js
function add(a, b) {
  return function () {
    return a + b;
  };
}

const addOne = add(1);
addOne(1); // 2

add(1, 2); // 3
```

### 特点

- 可以绑定`this`
- 会返回一个函数
- 可以传入参数
- 利用了柯里化

### 实现思路

#### 第一步：实现绑定 this 和返回函数

```js
Function.prototype.myBind = function (context) {
  const that = this; // 这里是为了保存this，以免this丢失
  return function () {
    // 实现返回函数
    return that.apply(context); // 实现绑定this
  };
};
```

使用箭头函数貌似更直观 👇

```js
Function.prototype.myBind1 = function (context) {
  return () => {
    // 实现返回函数，使用箭头函数防止this丢失
    return this.apply(context); // 实现绑定this
  };
};
```

浅测一下 💃

```js
var value = 2;
var foo = {
  value: 1,
};

function bar() {
  return this.value;
}

var bindFoo = bar.myBind(foo);
var bindFoo1 = bar.myBind1(foo);

console.log(bindFoo()); // 1
console.log(bindFoo1()); // 1
```

#### 第二步：实现传入参数

参数分为两部分，一部分是**调用 bind 方法传入的参数**，一部分是**调用 bind 返回的函数传入的参数**；我们需要将两部分参数进行合并。

> 💡 注意：从第二步开始我们就不能使用箭头函数了，因为箭头函数没有自身的 arguments，箭头函数内部访问的是外部函数 arguments，所以为了避免获取不到 bind 返回函数的参数，我们这里还是使用保存 this 的方法。

```js
Function.prototype.myBind = function (context) {
  const that = this;

  // 处理myBind方法传入参数，第一个参数是this，所以我们应该只获取后面的参数
  const args = Array.prototype.slice.call(arguments, 1);

  return function () {
    // 实现返回函数

    // 这里的arguments是当前匿名函数的参数
    const moreArgs = Array.prototype.slice.call(arguments); // 将arguments处理成普通数组
    return that.apply(context, args.concat(moreArgs)); // 实现绑定this
  };
};
```

浅测一下 💃

```js
var value = 2;

var foo = {
  value: 1,
};

function bar(name, age) {
  return {
    value: this.value,
    name: name,
    age: age,
  };
}

var bindFoo = bar.myBind(foo, 'huhu');
bindFoo(20); // { value: 1, name: 'huhu', age: 20 }
```

#### 第三步：实现 bind 返回的函数作为构造函数

> 一个绑定函数也能称为构造函数，使用 new 创建对象。

我们先看原生 bind 的表现：

```js
const value = 'window';
const foo = {
  value: 1,
};
function person(name, age) {
  this.habit = 'study';
  console.log(this.value);
  console.log(name);
  console.log(age);
}

person.prototype.friend = 'haha';

const bindP = person.bind(foo, 'huhu');

const p = new bindP(18);
// undefined
// huhu
// 18

console.log(p.friend); // haha
console.log(p.habit); // study
```

上面`this.value`输出为`undefined`的原因是，`new`操作符创建了一个新对象，并将`this`指向了这个新对象，而新对象上没有`value`。

我们的实现重点：通过返回原型的方式，实现通过 new 创建实例继承原型上的属性和方法。

```js
Function.prototype.myBind = function (context) {
  const that = this;

  // 处理myBind方法传入参数，第一个参数是this，所以我们应该只获取后面的参数
  const args = Array.prototype.slice.call(arguments, 1);

  const cFun = function () {
    // 这里的arguments是当前匿名函数的参数
    const moreArgs = Array.prototype.slice.call(arguments); // 将arguments处理成普通数组
    const target = this instanceof cFun ? this : context; // 说明1
    return that.apply(target, args.concat(moreArgs)); // 实现绑定this
  };

  cFun.prototype = Object.create(this.prototype); // 说明2
  return cFun;
};
```

（从例子来看，构造函数指`person`，实例指`p`）

**说明 1**：

- 作为构造函数时，`this instanceof cFun`返回的是`true`（this 指向 cFun 的实例），这里的`that`保存的是构造函数的上下文，将构造函数的`this`指向实例，可以使实例获取构造函数的内容；即例子中的`habit`属性。

- 作为普通函数，`this`指向`window`，此时`this instanceof cFun`返回的是`false`，将构造函数的`this`指向`context`

**说明 2**：
这里的`this`指向的是构造函数，不是实例。修改返回函数的`prototype`为构造函数的`prototype`，实例就可以继承构造函数的原型中的值；即上例中获取到原型上的`friend`属性。

😫 这里真的特别特别绕，得好好消化才行！

#### 第四步：当调用 bind 的不是函数时，应该抛出异常

所以完整版应该是 👇

```js
Function.prototype.myBind = function (context) {
  // 增加判断
  if (typeof this !== 'function') {
    throw new Error(
      'Function.prototype.bind - what is trying to be bound is not callable',
    );
  }

  const that = this;

  // 处理myBind方法传入参数，第一个参数是this，所以我们应该只获取后面的参数
  const args = Array.prototype.slice.call(arguments, 1);

  const cFun = function () {
    // 这里的arguments是当前匿名函数的参数
    const moreArgs = Array.prototype.slice.call(arguments); // 将arguments处理成普通数组
    const target = this instanceof cFun ? this : context; // 说明1
    return that.apply(target, args.concat(moreArgs)); // 实现绑定this
  };

  cFun.prototype = Object.create(this.prototype); // 说明2
  return cFun;
};
```

## 三、总结

### 实现难点

**call、apply 的实现难点**：

- 将函数的 arguments 转换成普通数组

**bind 的实现难点**：

- 保存 this 指向
- 实现柯里化，将参数进行合并
- 实现原型继承

### call、apply、bind 的区别

- call 和 apply 直接执行了函数，而 bind 是返回一个绑定了上下文的函数，方便进行柯里化
- bind 返回的绑定函数还可以作为构造函数，使用 new 关键字创建对象
