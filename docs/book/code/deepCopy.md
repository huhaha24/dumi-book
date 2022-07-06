---
title: 深拷贝
order: 1
toc: content
---

# 深拷贝

## 一、简单实现

其实深拷贝就是浅拷贝加上递归，在实现 Object.assign 的时候，我们发现它只复制了一层，在有子对象的情况下，就不管用了。我们在浅拷贝的时候，判断一下属性值，属性值为对象的话，就再进行一次拷贝，依次递归下去，直到没有子对象为止。这样就实现了深拷贝。

```js
// 实现浅拷贝
function cloneShallow(source) {
  const target = {};
  for (let key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      // 判断是不是对象自身拥有的属性
      target[key] = source[key];
    }
  }

  return target;
}
```

上面 👆 实现了一个简单的浅拷贝，在赋值操作之前，我们判断一下属性值是否为对象，如果为对象的话，就进行递归操作。

```js
// 实现深拷贝
function cloneDeep(source) {
  const target = {};
  for (let key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      // 判断source[key]的值是否为对象
      if (typeof source[key] === 'object') {
        traget[key] = cloneDeep(source[key]); // 再进行一次浅拷贝
      } else {
        target[key] = source[key];
      }
    }
  }
}
```

一个简单的深拷贝完成了，但是还有很多问题：

1. 没有对传入的参数进行校验
2. 对于属性是否为对象的判断不够严谨，因为 typeof null === 'object'
3. 没有兼容数组的拷贝

## 二、边界问题处理

### 处理入参

当目标参数传入的是`null`时，我们应该返回`null`，而不是`{}`；而`typeof null === 'object'`，所以我们在判断是否为对象时，应该排除掉`null`，即将对象的判断改为下面这种：

```js
function isObj(value) {
  return typeof value === 'object' && value != null;
}
```

所以之前的深拷贝改成这样：

```js
function isObj(value) {
  return typeof value === 'object' && value != null;
}

function cloneDeep(source) {
  if (!isObj(source)) return source;

  const target = {};
  for (let key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      // 判断source[key]的值是否为对象
      if (isObj(source[key])) {
        traget[key] = cloneDeep(source[key]); // 再进行一次浅拷贝
      } else {
        target[key] = source[key];
      }
    }
  }
}
```

🙋 问：这里为什么不直接使用`Object.prototype.toString.call(obj) === '[object Object]'`去判断是否为对象？

📄 答：因为还要考虑其他引用类型的拷贝，如果只判断对象本身的话，其他引用类型就不会被深拷贝了，比如 Array、Date 等。因为`typeof new Array() === 'object'`，使用 typeof 刚好能兼容到数组的拷贝。

### 循环引用

我们知道使用`JSON.prase`的一大问题就是，对于循环引用的情况，会报错；我们可以使用一个哈希表去存储已经被拷贝过的对象，当发现这个对象已经在哈希表中，就直接取出该值返回。

#### 使用 ES6 的 weakMap 实现

```js
function cloneDeep(source, hash = new weakMap()) {
  if (!isObj(source)) return source;
  if (hash.has(source)) return hash.get(source); // 如果哈希表中有该对象，则直接返回

  const target = Array.isArray(source) ? [] : {};
  hash.set(source, target); // 存放对象

  for (let key in source) {
    if (Object.prototype.toString.call(source, key)) {
      if (isObj(source[key])) {
        target[key] = cloneDeep(source[key], hash); // 传入最新的哈希表
      } else {
        target[key] = source[key];
      }
    }
  }
}
```

（💡 延伸知识点：[weakMap、Map、Object 的关系及区别]()）

#### 使用 ES5 中的数组实现

```js
// 其实就是使用数组来模拟hash表，数组的结构应该是这样的：
/**
 * list = [{
 *   source: { name: 1 },
 *   target: {}
 * }]
 */
//

// 判断元素是否已在数组中
function find(arr, item) {
  if (!arr.length) return null;
  return arr.find((item) => item.source === item);
}

function cloneDeep(source, list = []) {
  if (!isObj(source)) return source;
  if (find(list, source)) return find(list, source).target; // 如果数组中有该对象，则直接返回

  const target = Array.isArray(source) ? [] : {};

  // 存放对象
  list.push({
    source: source,
    target: target,
  });

  for (let key in source) {
    if (Object.prototype.toString.call(source, key)) {
      if (isObj(source[key])) {
        target[key] = cloneDeep(source[key], list); // 传入最新的数组
      } else {
        target[key] = source[key];
      }
    }
  }
}
```

### 拷贝 Symbol

### 破解递归爆栈

## 三、参考文章

- [木易杨](https://muyiy.cn/blog/4/4.3.html)
- [深拷贝的终极探索](https://segmentfault.com/a/1190000016672263)
