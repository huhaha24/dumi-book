---
title: 构建工具
order: 2
toc: content
---

# 前端构建工具

## 🤔️ 疑问点

- 为什么 esbuild 那么快
- vite 的热更新原理
- roullp 对比 webpack 的优劣

---

## 一、模块化规范

最开始 js 是没有模块化的概念的，都是在 script 标签中，但是这样的话会有以下的问题：

- 全局变量的问题
- 文件间的依赖问题

简单项目还好，对于复杂的项目，特别是需要多人协作的项目，很容易出现问题，所以需要使用模块化进行隔离。

### CommonJs

它主要运行在服务端，该规范指出：一个文件就是一个模块。Node.js 就是它的实践者，它的关键字有：

- `require`
- `module.exports`
- `global`

**特点**

- 只支持同步加载，即加载完了才可以执行后面的操作（因为模块文件放在本地硬盘，所以加载起来比较快，不需要考虑非同步的情况）
- 是值拷贝，即相同模块多次被运行，不会互相影响

### AMD

AMD 通过异步加载模块的规范，由于它非阻塞的特性，很适合在浏览器使用，比较典型的就是`require.js`。

**特点**

- 异步加载模块，好处是不会阻塞，坏处是容易造成回调地狱
- 只有在运行的时候才能确定一些东西，所以是运行时加载

### UMD

UMD 更像是一种兼容性的模块规范，它兼容了`CommonJs`、`AMD`以及非模块化的文件，它的目标是让一个模块能运行在各个环境中。

### ES6 module

它是和`ECMAScript`层面的模块化规范，是未来模块化规范的标准。它和以前的模块化规范都不一样，它是编译时加载的。它的关键字有：

- 导入：`import`
- 导出：`export`、`export default`

> ES6 module 是 2015 年出来的，但是 webpack 是在 ES6 module 之前出来的，所以`webpack`使用的是`CommonJs`模块化规范的，而后面出来的`rollup`以及`vite`都是基于`esm`（ES6 module 的简称）模块化规范。

## 二、CommonJs 和 ESM 的区别

### 1. 加载时机

- `CommonJs`是动态的，在运行时加载，所以它在使用 require 的时候是可以使用动态变量的
- `ESM`是静态的，在编译时加载，不能在`if`中使用`import`

### 2. 值拷贝和动态映射

**`CommonJs`的导出是值拷贝，也就是深拷贝。相当于创建了一个副本，所以改内容不会互相影响。**

```js
// calculator.js
var count = 0;
module.exports = {
  count,
  add: function (a, b) {
    count += 1;
    return a + b;
  },
};

// index.js
var count = require('./calculator.js').count;
var add = require('./calculator.js').add;

console.log(count); // 0（这里的count是对 calculator.js 中 count 值的拷贝）
add(2, 3);
console.log(count); // 0（calculator.js中变量值的改变不会对这里的拷贝值造成影响）

count += 1;
console.log(count); // 1（拷贝的值可以更改）
```

**`ES6 module`的导出是动态映射，更改了值会相互影响，并且导出的模块是只读的。**

```js
// calculator.js
var count = 0;
module.exports = {
  count,
  add: function (a, b) {
    count += 1;
    return a + b;
  },
};

// index.js
var count = require('./calculator.js').count;
var add = require('./calculator.js').add;

console.log(count); // 0（这里的count是对 calculator.js 中 count 值的拷贝）
add(2, 3);
console.log(count); // 0（calculator.js中变量值的改变不会对这里的拷贝值造成影响）

count += 1;
console.log(count); // 1（拷贝的值可以更改）
```

### 3. 循环依赖

[CommonJS 和 ES6 Module 分别如何处理循环依赖的问题？](https://juejin.cn/post/7007968848930422821)

## 三、构建工具

### webpack

一句话描述，通过入口文件，根据模块之间的依赖关系，进行打包的构建工具库。

**详细版**

通过 entry 配置的入口文件，根据文件中的 import 或 require 关键字，找到每个文件依赖的模块，形成依赖关系树。然后去递归这颗依赖树，根据 rules 中配置的 loader，对不同类型的文件进行解析，合并 loader 解析的结果，最后将内容打包到 dist 文件夹。

#### module、chunk、module

- `module`：任务源文件都可以称为模块，比如 js、css、font 等
- `chunk`：webpack 打包过程中产生的内容，它是由一个或多个`module`组成的
- `bundle`：webpack 打包后的产物，它是由一个或多个`chunk`组成的

#### webpack 如何兼容各种模块化规范

**1. 纯 CommonJs**

webpack 自己实现了一套`require`和`module.exports`，让浏览器可以执行源代码。（ps：CommonJs 在浏览器环境下是无法直接执行的）

**2. 纯 ESM**

- webpack 会对代码进行`tree shaking`，最终的产物和`rollup`的打包产物类似，不会有过多的兼容性代码
- webpack 可以在编译阶段，就分析出模块之间的依赖关系

**3. CommonJs 和 ESM 的混合**

- webpack 很强大，他是支持混用的！！
- 你可以 module.exports 导出， import xx from xx 导入
- 也可以 exports { } 导出，require 引入
- 实现的思路和上面的模拟 module.exports 和提供**webpack_require**替代 require 的思路类似，webpack 会去模拟 esm 的 exports 对象 让浏览器支持

#### webpack 动态加载

##### 懒加载

也称为按需加载，在使用的时候才去加载一些模块，这样做的好处是有利于首屏加载，对于首屏用不到的模块，我们可以选择后面用到的时候再加载。

```js
button.addEventListener('click', () => {
  import('./moduleA.js').then(() => {
    // ...
  });
});
```

##### 预获取：prefetch

懒加载比较适用于比较小的文件，如果文件比较大，点击的时候去加载会影响到用户体验，我们可以采用预获取在浏览器空闲的时候提前加载文件。

```js
button.addEventListener('click', () => {
  import(/* webpackPrefetch */ './moduleA.js').then(() => {
    // ...
  });
});
```

##### 预加载：preload

预加载主要是用来加载当前导航下可能需要的资源，是和父 chunk 并行加载的。

```js
button.addEventListener('click', () => {
  import(/* webpackPreload */ './moduleA.js').then(() => {
    // ...
  });
});
```

##### prefetch 和 preload 的区别

- 使用时机
  - prefetch 是**未来某个导航下可能需要用到的资源**
  - preload 是**当前导航下可能需要用到的资源**
- 加载时机
  - prefetch chunk 是浏览器空闲的时候加载
  - preload chunk 具有中等优先级，会在父 chunk 加载的时候，并行加载
- 浏览器的支持程度不同

#### webpack 中的 loader 和 plugin

##### loader

**1. 为什么需要 loader？**

webpack 只支持 js 类型的文件，需要使用 loader 将不同文件类型解析成 webpack 支持的类型。

**2. 常用的 loader**

- css 相关

  - `css-loader`：让 webpack 能解析 css 文件的内容
  - `style-loader`：将 css 样式添加到 html 文件中（被 webpack5 中的`mini-css-extract-plugin`取代）
  - `less-loader`：将 less 文件解析成 css 文件
  - `postcss-loader`：自动给 css 的新特性增加前缀

- 图片相关

  - `url-loader`：可以给图片设置域值，大于多少 k 就给 file-loader 处理
  - `file-loader`：修改图片的地址，通过 url 引入文件（现在都被 asset 代替了）

- js 相关
  - `babel-loader`：将 Es6 等高版本的内容转成 Es5，兼容低版本浏览器

**3. 实现 loader 的思想**

- loader 本质上是一个函数，可以看作是将非 js 模块变为 js 模块的转换器；
- loader 执行是串行的，像一个管道一样，执行顺序是在数组中从后往前执行；
- loader 是链式调用，loader 的开发应该遵循‘单一职责’，每个 loader 只负责自己需要的事情。

```js
// 伪代码思路：
// 1. loader需要使用commonjs模式导出
// 2. 需要使用this上下文，所以不能是箭头函数
// 3. loader输出的必须是js代码

module.exports = function (source) {
  return "console.log('hello webpack!')"; // output
};
```

##### plugin

**1. 为什么需要 plugin？**
plugin 可以理解为 loader 的扩展，它可以帮助我们实现更多自动化的内容，比如：自动将 js 文件注入 html 中(`html-webpack-plugin`)、打包前自动清除 dist 包(在`output`中配置`clean: true`)、将不需要打包的静态资源自动 copy 到目标文件夹(`copy-webpack-plugin`)等等；拥有了 plugin 的 webpack 可以解决大部分的前端工程化的问题。

**2. 常用的 plugin**

- 自动化相关
  - `html-webpack-plugin`：自动将打包好的文件注入到 html 中
  - `clean-webpack-plugin`：自动在打包之前清除 dist 文件夹
  - `copy-webpack-plugin`：将不需要打包的静态资源 copy 到目标文件夹
  - `mini-css-extract-plugin`：代替`style-loader`的功能，自动将打包好的 css 文件注入 html 模板文件中
  - `purgecss-webpack-plugin`：清理无用的 css
- 压缩相关
  - `terser-webpack-plugin`：对 js 代码进行压缩
  - `css-minimizer-webpack-plugin`：对 css 进行压缩
- 分析相关
  - `speed-measure-webpack-plugi`：可以看到每个 loader、plugin 的执行时间
  - `webpack-bundle-analyzer`：可视化 webpack 打包的各文件体积

**3. 开发 plugin 的思路**

- plugin 必须是一个 class 类，或者是一个构造函数，因为在后面的使用过程中，需要通过 new 去创建实例
- plugin 需要暴露一个 apply，是为了 webpack 在初始化的 compliar 能够调用，apply 是用来接收 compliar 的引用；
- webpack 运行的生命周期中，会分发很多事件，plugin 通过监听对应的事件，在对应事件对应的钩子函数中去执行相应的操作

🌰：[在 dist 文件中新增包含打包信息的文件](https://blog.csdn.net/niall_tonshall/article/details/123088688)

#### webpack 构建流程

##### 初始化

- 解析 webpack 参数，合并 shell 和 config 文件中的参数，得到最终的配置；
- 创建 complier 实例，注册插件，准备开始编译工作

##### 编译过程

- 根据 entry 中配置的入口文件，开始解析文件的 AST 语法树，找出依赖，递归下去；
- 递归过程中根据文件类型，采用配置的 loader 进行解析；

##### 输出编译结果

- 将编译完成后组成的 chunk，将 chunk 转换成文件，输出到文件系统中

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71b263000fa94db792cf1e98d67a578a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

#### webpack 热更新和热加载

##### 热加载--liveReload

可以帮助我们自动进行编译和加载页面

##### 热更新--HMR

**使用方式**

- webpack4 中需要通过 HotModuleReplacement 插件实现热更新
- webpack5 中默认支持热更新，或者我们可以显式地在 devServer 中配置 hot 为 true 去开启热更新

**和热加载的区别**

热加载是为了实现模块局部替换，也就是只改变更改的那部分内容，其他内容保持状态不变。

- css 的热更新：style-loader 默认实现了 css 文件的热更新功能
- js 的热更新
  - 可以通过 module.hot.accept 去监听更新（前提是已开始热更新）
  - 也可以通过框架的插件，例如 vue-loader、react-hot-loader 等
- 图片资源热更新：只需要改文件路径即可自动更新

**实现原理**

- 启动时
  - 启动一个 bundle server，该服务将编译好的文件放在内存中
  - webpack 将 HMR runtime 放在编译好的 bundle.js 中传输给 bundle server
  - bundle server 开启一个 HMR server 和 HMR runtime 进行 webscoket 连接
- 更新时
  - HMR server 会给 HMR runtime 发送更新的文件 hash
  - 客户端这边根据新 hash，去请求更新的模块内容，包括两个文件：xxx.hot-update.json 和 xxx.hot-update.js 文件
  - 拿到 js 文件中更新的内容之后，通过 HMR runtime 去进行热更新

![image.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/5/16b26a9cc74f76af~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

名词解释 🧾：

- Webpack Compile：将 JS 源代码编译成 bundle.js
- HMR Server：用来将热更新的文件输出给 HMR Runtime
- Bundle Server：静态资源文件服务器，提供文件访问路径
- HMR Runtime：socket 服务器，会被注入到浏览器，更新文件的变化
- bundle.js：构建输出的文件

> [参考文章：聊聊 Webpack 热更新以及原理](https://www.51cto.com/article/658080.html)（我要投降了，简直太难了，你们自己去看吧！🏳️）

#### tree shaking

#### babel

#### 联邦模式

不同应用之间的模块共享，是 webpack5 中新增的功能，和 qiankun 以及 sigle-spa 不同，它没有基座的概念，使用去中心化的思想，任何应用之间都可以共享模块。

[联邦模式的官方示例](https://stackblitz.com/edit/github-3tna3q?file=app1%2Fsrc%2FApp.js&terminal=start&terminal=)

### vite

开发环境：使用 esbuild
生产环境：使用 rollup

🤔️ 为什么生产环境不使用 esbuild？

答：

1. esbuild 打包出来的内容是 es6 的代码，对于低版本的浏览器兼容不好
2. esbuild 对于代码分割、打包分析等功能支持不是很好

### rollup

使用 ES6 Module，不像 webpack 那样需要用那么多代码对 Commonjs 的代码进行转换，比较干净。

### gulp

更像是一个工具箱，可以加上各种功能

## 参考文章

- [前端模块标准之 CommonJS、ES6 Module、AMD、UMD 介绍](https://juejin.cn/post/6959360215674257415)
- [前端模块标准之 CommonJS 和 ES6 Module 的区别](https://juejin.cn/post/6959360326299025445)
