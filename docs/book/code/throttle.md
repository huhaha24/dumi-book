---
title: 防抖和节流
order: 3
toc: content
---

# 防抖和节流

## 防抖

### 概念理解

> 就是指在一段时间内同时触发某个事件，只会执行最后一次。

现实生活中的 🌰：

- 公交车：每上来一个人，司机师傅都需要等 2s 再启动，直到不再上人，才启动；
- 王者：回城被打断的话，需要重新再来，直到不再被打断，才回血成功

### 代码实现

```js
const submit = (value) => {
  console.log('submit: ', value);
};

const debounce = function (fun, delay) {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fun.apply(this, arguments); // 将函数传递的参数放进来
    }, delay);
  };
};

const submitFun = debounce(submit, 1000);

submitFun('form1');
submitFun('form2');
submitFun('form3');

// 结果：1s后输出submit: form3（只会执行最后一次）
```

### 适用场景

- 用户搜索内容的时候，在用户不在输入的时候，才发送请求；
- 手机号和邮箱号检测
- 窗口 resize 时，窗口不再调整时才重新计算

## 节流

### 概念理解

> 就是指在一个时间段内，多次执行同一个事件，只会执行一次。

现实生活中的 🌰：

- 地铁：假设地铁 4 分钟一趟，只有地铁停下来开门了才能上乘客，运行过程中不能上乘客
- 王者：技能的冷却时间还没过的时候，不能使用

### 代码实现

```js
const submit = (value) => {
  console.log('submit: ', value);
};

const throttle = function (fun, delay) {
  let startTime = 0;

  return function () {
    const curTime = new Date().valueOf();
    if (curTime - startTime > delay) {
      fun.apply(this, arguments);
      startTime = curTime; // 将最近一次时间记录下来
    }
  };
};

const submitFun = throttle(submit, 1000);

setTimeout(() => submitFun('form1'), 200);
setTimeout(() => submitFun('form2'), 1200);
submitFun('form3');

// 输出结果：先输出form3，隔1.2s之后再输出form2
```

### 适用场景

- 搜索框的联想功能
- 滚动加载
- 避免表单重复提交

## 使用自定义 hook 实现防抖和节流

### 防抖

[源代码](https://stackblitz.com/edit/react-sgxdhr?file=src%2FApp.js)
