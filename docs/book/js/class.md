---
title: class
order: 6
toc: content
---

## çé® ð¤ï¸

- å¦ä½ä½¿ç¨ ES5 å»å®ç° ES6 ä¸­çç±»ï¼
- class ç»§æ¿å ES5 ä¸­çç»§æ¿åºå«å¨åªéï¼
- å¦ä½çè§£ react ä¸­çç±»å classï¼
- é¢è¯çæ¶åèç¹å¨åªéï¼

## ä¸ãåºæ¬è¯­æ³

### åºæ¬åæ³

#### æé å½æ°+åååæ³ï¼ES5ï¼

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

#### class åæ³ï¼ES6ï¼

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // å¨ååä¸å®ä¹addæ¹æ³
  add() {
    console.log(this.x + this.y);
  }
}

const p = new Point(1, 2);
p.add(); // 3
```

æä»¬å¯ä»¥çå°ï¼ES5 ä¸­å°å®ä¾å±æ§æ¾å¨æé å½æ°ä¸­ï¼å±äº«æ¹æ³æ¾å¨æé å½æ°çååä¸ï¼ES6 ç`class`è®©å¯¹è±¡åååæ³æ´ç®åï¼`class`åé¨ç`constructor`æ¹æ³å°±æ¯æé å½æ°ï¼`class`çæ¹æ³é½æ¯å®ä¹å¨ååä¸ã

#### ä¸ ES5 çåºå«

1. class åé¨çæ¹æ³æ¯ä¸å¯æä¸¾çï¼è ES5 ä¸­ååä¸çæ¹æ³æ¯å¯æä¸¾çï¼ï¼å¯æä¸¾ï¼ç¨ Object.keys å¯éåå°ï¼
2. class åé¨é»è®¤ä½¿ç¨ä¸¥æ ¼æ¨¡å¼ãï¼ð¡ å»¶ä¼¸ç¥è¯ç¹ï¼[ä¸¥æ ¼æ¨¡å¼]()ï¼

### constructor æ¹æ³

- æ¯ä¸ª`class`æä¸åªè½æä¸ä¸ª`constructor`æ¹æ³ï¼å¦æä¸æ¾ç¤ºå£°æï¼Js å¼æä¼èªå¨ä¸ºå®æ·»å ä¸ä¸ªç©ºç`constructor`ã
- `constructor`æ¹æ³é»è®¤è¿åå®ä¾å¯¹è±¡ï¼å³`this`
- `class`åæ®éå½æ°çåºå«æ¯ï¼å®å¿é¡»ä½¿ç¨`new`å»è°ç¨ï¼å¦åä¼æ¥é

### ç±»çå®ä¾å¯¹è±¡

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

å ES5 ä¸æ ·ï¼ç±»çæ¯ä¸ªå®ä¾å¯¹è±¡é½æä¸ä¸ª**proto**å±æ§ï¼å¹¶ä¸é½æåç±»çååã

æ³¨æï¼ä¸æ¨èä½¿ç¨å®ä¾ç**proto**å±æ§å»æ´æ¹ååï¼è¿æ ·ä¼å½±åå°å¶ä»å®ä¾

### class çç§æåå®¹

#### ç§æå±æ§

ES6 ä¸­ä¸æ¯æç§æå±æ§ï¼æä¸ä¸ªææ¡ä¸­ä¸º class å¢å äºç§æå±æ§ï¼ä½¿ç¨#æ¥è¡¨ç¤ºã

#### ç§ææ¹æ³

class æ¬èº«æ¯ä¸æä¾ç§ææ¹æ³çï¼ä½æ¯æä»¬å¯ä»¥éè¿ä¸äºæ¹æ³å»å®ç°ã

##### æ¹æ³ä¸ï¼ç´æ¥å¨å½åä¸ååºå«

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

å¨æ¹æ³ååé¢å \_è¡¨æå®æ¯åé¨æ¹æ³ï¼ä½æ¯å®éä¸å®è¿æ¯å¨ååä¸ï¼éè¿å®ä¾ä¾ç¶å¯ä»¥è°ç¨ã

##### æ¹æ³äºï¼ç»å call

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

å°`Point`ç`this`éè¿`call`ç»`bar`ï¼è¿æ ·`Point`çå®ä¾å¯ä»¥ç´æ¥è°ç¨`bar`æ¹æ³ï¼ä½æ¯å¤é¨ä¸è½ç´æ¥è°ç¨ã

##### æ¹æ³ä¸ï¼å©ç¨ Symbol çç¹æ§

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

å©ç¨äº`Symbol`éè¿`Object.keys`å`for in`è·åä¸å°çç¹æ§ï¼å®ç°äºç§ææ¹æ³ã

### class ä¸­ this æå

`class`ä¸­`this`é»è®¤æåå®çå®ä¾ãä½æ¯å¦ææç±»ä¸­çæ¹æ³éè¿è§£ææ¿åºæ¥ç´æ¥ç¨ï¼this å°±ä¼æåå®æå¨çç¯å¢ã

### class çéæåå®¹

#### éææ¹æ³

ç±»ç¸å¯¹äºå®ä¾çååï¼å®å®ä¹çæææ¹æ³é½ä¼è¢«å®ä¾ç»§æ¿ã

å¦æå¨æ¹æ³åé¢å ä¸`static`å³é®è¯ï¼è¿ä¸ªæ¹æ³å°±æ¯**éææ¹æ³**ï¼ä¸ä¼è¢«å®ä¾ç»§æ¿ï¼å¹¶ä¸å®åªè½éè¿ç±»è°ç¨ã

```js
class Point {
  static classMethod() {
    console.log('classMethod');
  }
}

const p = new Point();
p.classMethod(); // æ¥éï¼ä¸å­å¨è¿ä¸ªæ¹æ³
```

- ç¶ç±»çéææ¹æ³å¯ä»¥è¢«å­ç±»ç»§æ¿

- å­ç±»ä¹å¯ä»¥éè¿ super è°ç¨ç¶ç±»çéææ¹æ³

#### éæå±æ§

åéææ¹æ³ç±»ä¼¼ï¼éè¿`static`å³é®è¯æ å¿**éæå±æ§**ï¼**éæå±æ§**æ¯`class`æ¬èº«çå±æ§ã

```js
class Person {
  static sexy = 'woman';
}
```

#### å®ä¾å±æ§

ä»¥åæä»¬å°å®ä¾å±æ§åå¨`constructor`ä¸­ï¼ç°å¨åªè¦åå¨ class åé¨ï¼å°±ä¼è¢«è®¤ä¸ºæ¯å®ä¾çå±æ§ã

```js
class Person {
  // ä»¥åçåæ³
  constructor(name) {
    this.name = name;
  }

  // ç°å¨çåæ³
  age = 12;
}
```

### new.target å±æ§

`new.target`æ¯ ES6 æ°å¢çåå®¹ï¼æ¯ç¨æ¥ç¡®å®æé å½æ°æ¯æä¹è°ç¨çï¼å¦æä¸æ¯éè¿`new`è°ç¨ï¼`new.target`ä¼è¿å`undefined`ã

```js
// æé å½æ°ä½¿ç¨ï¼éè¿newè°ç¨æ¶ï¼new.targetæåæé å½æ°
function Person (name) {
  this.name = name
  console.log(new.target === Person)
}

const p = new Person('å¼ ä¸') // true
const p1 = Person.call(p, 'æå') // false

// ç±»ä¸­ä½¿ç¨ï¼éè¿newè°ç¨æ¶ï¼new.targetæåç±»
class PersonClass {
  constructor(name) {
    this.name = name
    console.log(new.target)
    console.log(new.target)x
  }
}

const ppp = new Person('çäº') // PersonClass

// ç»§æ¿
class Woman extends PersonClass {
  constructor(name) {
    super(name)
  }
}

const wp = new Person('å¥³äºº') // Woman
```

ð¡ éè¦æ³¨æçæ¯ï¼å­ç±»ç»§æ¿ç¶ç±»æ¶ï¼`new.target`ä¼æåå­ç±»ã[ç¸å³é¢è¯é¢](#onlyInheritClass)

### class ç¹ç¹

#### class è¡¨è¾¾å¼

class åå½æ°ä¸æ ·ä¹å¯ä»¥ä½¿ç¨è¡¨è¾¾å¼çå½¢å¼åå»ºï¼å¦ä¸ ð

```js
// è¡¨è¾¾å¼å®ä¹ç±»
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};

const instance = new MyClass();
instance.getClassName(); // Me
Me.name; // æ¥éï¼Me is not defined

// ç«å³æ§è¡ç±»
const person = new (class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
})('å¼ ä¸');

person.sayName(); // å¼ ä¸
```

#### ä¸å­å¨åéæå

å¿é¡»åå®ä¹ç±»ï¼æè½ä½¿ç¨ç±»ãè¿æ ·è§å®æ¯ä¸ºäºç»§æ¿çæ¶åä¸æ¥éã

#### name å±æ§

`class`ç`name`å±æ§ç»§æ¿èª ES5 ä¸­çæé å½æ°

```js
class Point {}

Point.name; // Point
```

## äºãç»§æ¿

### extends

class ä½¿ç¨ extends å®ç°ç»§æ¿ï¼å¿é¡»å super æ­éä½¿ç¨ã

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class Woman extends Person {
  constructor(name, age, hairColor) {
    super(name, age); // è°ç¨ç¶ç±»çæé å½æ°
    this.hairColor = hairColor;
  }
}
```

è¿æ ·å°±å®ç°äºä¸ä¸ªæç®åçç»§æ¿ã

### super

#### super ä½ä¸ºå½æ°è°ç¨

```js
class A {}

class B {
  constructor() {
    super(); // è°ç¨ä¸æ¬¡ç¶ç±»æé å½æ°
  }
}
```

`super`ä½ä¸ºå½æ°è°ç¨æ¶ä»£è¡¨**ç¶ç±»çæé å½æ°**ï¼`super()`ç¸å½äº`A.prototype.constructor.call(this)`ï¼è¿éç this æ¯ B çå®ä¾ã

ð æ ¸å¿ï¼**ä¹å°±æ¯å°ç¶ç±»çååæé å½æ°æåå­ç±»çå®ä¾**ã

#### super ä½ä¸ºå¯¹è±¡è°ç¨

##### å¨æ®éæ¹æ³ä¸­è°ç¨

`super`å¨æ®éæ¹æ³ä¸­è°ç¨æ¶ï¼æå**ç¶ç±»çåå**ï¼ä¹å°±æ¯ super å¯ä»¥è®¿é®ç¶ç±»ååä¸çæ¹æ³ï¼ä½æ¯ä¸è½è®¿é®å®ä¾çå±æ§

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

##### å¨éææ¹æ³ä¸­è°ç¨

`super`å¨éææ¹æ³ä¸­è°ç¨æ¶ï¼æå**ç¶ç±»**ã

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

## ð é¢è¯é¢

### <span id="onlyInheritClass">1ãå¦ä½å®ç°ä¸ä¸ªåªè½ç»§æ¿ä¸è½å®ä¾åçç±»ï¼</span>

æè·¯ï¼å©ç¨ç±»è¢«ç»§æ¿çæ¶åï¼`new.target`æåå­ç±»çç¹ç¹å®ç°

```js
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('æ¬ç±»ä¸è½å®ä¾åï¼');
    }
  }
}

new Shape(); // æ¥éï¼æ¬ç±»ä¸è½å®ä¾åï¼
```

### <span id="super">2ãclass çæé å½æ°ä¸­ super ä½ä¸ºå½æ°è°ç¨æ¶ï¼åäºä»ä¹ï¼</span>

æè·¯ï¼å°ç¶ç±»çååæé å½æ°æåå­ç±»

```js
class A {}

class B extends A {
  constructor() {
    super(); // A.prototype.constructor.call(this)
  }
}
```

### 3ãES5 ä¸­çç»§æ¿å ES6 ä¸­çç»§æ¿æä»ä¹åºå«ï¼

- ES5 ä¸­ç»§æ¿çå®è´¨æ¯

  - åå»ºå­ç±»çå®ä¾å¯¹è±¡ this
  - å°ç¶ç±»çæ¹æ³æ·»å å° this ä¸ï¼éè¿`Person.call(this)`

- ES6 ä¸­ç»§æ¿çå®è´¨æ¯
  - åå»ºç¶ç±»çå®ä¾å¯¹è±¡ this
  - è°ç¨`super()`ï¼åç¨å­ç±»çæé å½æ°ä¿®æ¹ this
