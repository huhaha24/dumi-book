---
title: 浏览器
order: 9
toc: content
---

# 浏览器相关知识

## 一、浏览器进程、线程

### 浏览器的多进程

**浏览器多进程的分类**

- 浏览器进程：主进程，负责协调，只有一个
  - 负责浏览器的界面界面显示，与用户交互，网址栏输入、前进、后退等
  - 负责管理各个页面，创建和销毁进程
  - 将页面内容(位图)写入到浏览器内存中，最后将图像显示在屏幕上
  - 文件存储等功能
- 🌟 渲染进程：默认一个 Tab 页就是一个渲染进程，主要作用是页面渲染、脚本执行、事件处理等
- GPU 进程：用于 3D 绘制等，将开启了 3D 绘制的元素的渲染由 CPU 转向 GPU，也就是开启 GPU 加速。最多一个
- 网络进程：主要负责页面的网络资源加载，之前是作为一个模块运行在浏览器进程里面，现在独立开来，成为一个单独的进程
- 插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建
- 音频进程：浏览器音频管理

**浏览器多进程的好处**

1. 避免单个页面的崩溃影响整个浏览器
2. 避免第三方插件的崩溃影响整个浏览器
3. 多进程充分利用了多核的优势

### 浏览器的渲染进程

渲染进程中包含多个线程，如下图，其中**GUI 渲染线程和 js 引擎线程是互斥的**，当 js 引擎执行时，GUI 线程会被挂起，GUI 更新会被放入一个队列中，当 js 引擎线程空闲时立即执行。

- GUI 渲染线程
- js 引擎线程
- 事件触发线程
- 定时触发线程
- 异步请求线程（I/O 线程）

> GUI 渲染进程和 js 引擎线程是互斥的原因是，js 是可以操纵 DOM 的，如果修改 DOM 元素的同时引起了页面的渲染，GUI 线程前后得到的数据可能不一致，这样会造成一些不可控的问题。

## 二、浏览器存储

![image.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/1/169d6872b64e96a9~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

### cookie

#### 1、cookie 的来源

由于 http 请求是无状态的，客户端请求服务器的时候，服务器不知道来源自哪个客户端，所以这个时候需要 cookie 来维护客户端和服务端之间的联系。cookie 本身不是用来存储的，而是用来维持状态的。

#### 2、cookie 的应用场景

服务端通过 cookie 来识别客户端的身份，通常 cookie 会经过加密，以`name-value`的形式在浏览器中存在，典型的应用场景：

- 记住密码
- 购物车数据

#### 3、cookie 的原理

![image.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/21/1699f22b7029ca14~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 4、cookie 的问题

- cookie 不够大，每个`value`值大概是 4k
- 由于 cookie 是携带在请求中的，所以在同域名下的所有请求都会携带 cookie，对于那些不需要验证的静态资源，也会带着 cookie 请求，这样会造成资源浪费
- 在 http 中，cookie 是以明文的形式存在的，存在一定的安全问题（后端设置了 httpOnly 的话，前端无法通过 js 获取 cookie 内容）

### localStroge

#### 1、特点

- 存储时间长，除非手动清理，否则一直存在
- 存储空间大，有 5M 左右
- 仅在客户端存在，不与服务端进行通信

#### 2、使用场景

- 优化首屏性能，可以将一些不变的信息直接存储在本地
- 存储图片的 dataUrl

### sessionStroge

#### 1、特点

- 保存在浏览器的一次会话中，浏览器窗口关闭，就会被清除
- 同一域名下的两个页面，不在同一个浏览器窗口打开，内容就不会共享（localStrage 和 cookie 都是同源下共享信息的）
- 存储大小在 5M 左右
- 不与服务端进行通信，仅存在于客户端

#### 2、使用场景

- 存储本次会话中用户的浏览器记录
- 存储上次访问的网址

### indexDB

**特点**

- 键值对存储
- 异步
- 支持事务
- 同源限制
- 存储空间很大，一般不少于 250M，甚至没有上限
- 支持二进制信息存储

## 三、浏览器缓存

![image.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/28/163a4d01fdd197b6~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

### 强缓存和协商缓存

**强缓存**：是指直接从缓存中拿资源，不询问服务器。

- 判断方式：http/1.0 中是通过 Expires 字段给出过期时间（具体时间），但是由于服务器和浏览器的时间可能不一致，容易出现问题，并且 Expires 的扩展性比较差，所以 http/1.1 采用了 Cache-control 加 max-age 的方式指定还能缓存的多久；
- 状态码：200

**协商缓存**：是指在加载资源前，询问服务器该资源是否更新，更新了重新请求，未更新则从本地缓存中获取。

- 判断方式：服务端会返回一个 Etag 字段，里面存放一个特殊的 hash 值，浏览器发送请求时，在 if-none-match 字段中携带上该 hash 值，如果没发生更改，服务端会返回 304；（以前用的 Last-Modified，是秒级别的，也就是说在 1 秒之内的更新也许不能被及时发现，对于频繁更新的情况不适用）
- 状态码：304

### 优先级

由上面的流程图可以看到，**强缓存的优先级是高于协商缓存的**，先查找有没有强缓存的标志，没有的话，再去获取协商缓存的内容。

💡**额外的知识点**：浏览器的缓存默认是放在内存中`(from memory cache)`，而长期不更新的资源会被缓存在磁盘中`(from disk cache)`，内存中的缓存会因为进程的结束或者浏览器被关闭而清空，磁盘中的缓存被长期保留下去。

## 四、http 请求

### http 和 https 之间的区别

一句话，https 在 http 的上层加了一个 SSL 证书，对传输的内容进行加密，以此来保证请求的安全。

**大致的结构**

![image.png](https://img-blog.csdnimg.cn/img_convert/f321560df040f5ee92c871b40a41a88c.png)

**具体区别**

1. 默认端口号不同：http 协议的默认端口号是 80，而 https 的默认端口号是 443
2. 安全性：http 采用的是明文传输，安全性不高；https 会将所有内容进行加密，安全性比较高；

**加密方式**

- 对称加密

- 非对称加密

- 混合加密

### http 版本迭代

这里主要关注 http/1.0 --> http/1.1 --> http/2 的变化，分析 http 优化的过程。

#### 从 http/1.0 到 http/1.1 的改变

- 持久化连接
  - 在 http/1.0 中，每发送一个请求，就会经历一次 TCP 连接，一次 TCP 关闭的过程；
  - 到了 http/1.1，增加了`connection：keep-alive`属性，来保持 TCP 的`持久化连接`，也就是说在同一个 TCP 连接过程中，可以发送多个请求，如果将`connection`属性改成 false 或将 TCP 的空闲时间超过了规定时间，TCP 连接就会被关闭。

#### 从 http/1.1 到 http/2 的改变

- 管道化

  - 在 http/1.1 之前，请求只能串行地发送，下一次请求只能在上一次请求得到响应才能发出
  - http/1.1 中通过管道化，实现了请求的并行发送，即不需要等待上一个请求得到响应再发送下一个请求，但是为了保证响应正确，要求服务器顺序响应；问题是，如果第一个请求的响应发生了阻塞，会造成后面请求的响应也被阻塞（也叫做队头阻塞）。

- 多路复用

  - 为了避免连接头阻塞，http/2 使用了帧和流的概念。将每个请求分为多帧，每一帧上携带着归属请求的标识，多帧组成一个流，一个流就是一个请求；
  - 这样的好处就是，请求和响应都不需要按顺序，服务端可以通过接收到的帧判断属于哪个请求，然后再作出响应。

- 头部压缩：使用`HPACK`算法进行压缩，采用**传索引**的方式，来减少传输的内容
- 服务器主动推送：服务端可以主动推送信息

> 🤔️http2 真的彻底解决了队头阻塞的问题吗？<br/>
> 答：并没有，只能说它解决了 http 请求队头阻塞的问题，tcp 的队头阻塞问题还是没解决。http2 中的请求都是在同一个 tcp 连接中发送的，而 tcp 的传输过程是把数据拆分成一个个按照顺序排列的数据包，这些数据包通过网络传输到接收方，接收方再按照顺序进行组合。如果在这个过程中，有一个数据包在传输的过程中阻塞住了，就会阻塞住其他请求，也就是 tcp 队头阻塞。

### http 状态码

#### 2xx 成功

- 200：请求成功，如果是强缓存的情况，也会返回 200
- 204：请求被成功处理，但是响应的实体没有内容
- 206：客户端只想请求某一部分内容

#### 3xx 重定向

- 301：永久重定向，后续访问的内容都在新 url 上
- 302：暂时重定向，本次访问的内容在新 url 上，下一次不一定
- 304：客户端发送了附带条件的请求，比如协商缓存的 if-none-match 字段

#### 4xx 客户端错误

- 400：客户端请求的语法有问题
- 401：未进行身份验证
- 403：请求的内容被服务端禁止访问
- 404：客户端访问的内容找不到
- 405：请求方法被服务端禁止

#### 5xx 服务端错误

- 500：服务端程序发生错误
- 502：代理从上游接收到的请求是无效的
- 503：服务器停机或者过载了

### http 方法

- GET：通常用来获取资源
- POST：新增数据
- PUT：修改数据
- DELETE：删除某些资源
- OPTIONS：询问支持哪些方法
- CONNECT：建立连接隧道，用于代理服务器
- HEAD：获取资源的首部信息
- TRACE：追踪请求到响应的传输路径

**GET 方法和 POST 方法的区别**

- 从缓存的角度，get 请求会被主动缓存下来，而 post 请求默认不会
- 从参数的角度，get 请求是将参数放在 url 后面，而 post 请求是将参数放在请求体中，更安全
- 从幂等性的角度，get 请求时幂等的，而 post 不是（发送多次 get 请求，都不会影响到服务端的数据，而 post 请求会）
- 从 TCP 的角度，get 请求会把请求一次性发过去，而 post 请求会从分为两个 tcp 包，先发 head 部分，再发送主体

### http 报文

- 报文由首部、空行、主体三部分组成
- 请求报文和响应报文的结构不同，其中最大的区别在于首部

![image.png](https://img-blog.csdnimg.cn/img_convert/02cff927bfa1ccd08ca20a6025fcba55.png)

#### http 请求报文

![image.png](https://img-blog.csdnimg.cn/img_convert/a7159f2ae44e4da3b4ec622952cabafe.png)

- 请求行：包含用于请求的方法，请求 URI 和 HTTP 版本
- 请求首部字段：请求报文里特有的字段（后文会提到）
- 通用首部字段：请求报文和响应报文都会用到的首部
- 实体首部字段：针对请求报文的实体部分使用的首部
- 其他：可能包含 HTTP 的 RFC 里未定义的首部（如 Cookie 等）

#### http 响应报文

![image.png](https://img-blog.csdnimg.cn/img_convert/550f29fe9f9992cf899a1346e9547898.png)

- 状态行：包含表明响应结果的状态码，原因短语和 HTTP 版本
- 响应首部字段：响应报文里特有的字段（后文会提到）
- 通用首部字段：请求报文和响应报文都会用到的首部
- 实体首部字段：针对响应报文的实体部分使用的首部
- 其他：可能包含 HTTP 的 RFC 里未定义的首部（如 Set-Cookie 等）

### http、TCP、UDP 之间的关系

#### http、tcp、ip 的关系

一张图表明它们的关系，在 TCP/IP 网络模型中，http 在应用层，tcp 在传输层，ip 在网络层。
![image.png](https://img-blog.csdnimg.cn/20210719211300672.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80Mzk4NDE1Nw==,size_16,color_FFFFFF,t_70#pic_center)

- tcp 是`全双工`：客户端在给服务端发送消息的同时，服务端也可以给客户端发送消息
- http 是`半双工`：客户端可以给服务端发送消息，服务端也可以给客户端发送消息，但是它们不能同时发送

#### tcp 的三次握手和四次挥手

> 几个概念
>
> - `SYN`：表示同步建立连接
> - `ACK`：表示已收到信息
> - `FIN`：表示结束，告知对方，我这边已经结束了
> - `seq`：序列号

##### 三次握手

初始阶段：客户端和服务端在建立连接之前，都是`CLOSED`状态

1. TCP 服务器进程先创建传输控制块 TCB，时刻准备接受客户进程的连接请求，此时服务器就进入了`LISTEN`（监听）状态
2. 客户端发起连接，给服务端发送一个请求报文，内容大致是`SYN = 1, seq = x`，然后客户端进入`SYNC-SENT`状态；
3. 服务端接收到报文，进入`SYNC-RECEIVED`状态，然后给客户端发送一个内容大致为`SYN = 1, ACK = 1, ack = x + 1, seq = y`的报文；
4. 客户端收到报文后，还要向服务端发送一个内容大致为`ACK = 1, seq = x + 1, ack = y + 1`，然后状态变为`ESTABLISHED`；
5. 服务端收到报文后，状态也变为`ESTABLISHED`，此时表明已建立连接，可以传输数据了。

<!-- ![image.png](https://img-blog.csdnimg.cn/114bd9b53c554319ae0db15b57b472b8.gif#pic_center) -->

![image.png](https://imgconvert.csdnimg.cn/aHR0cDovL2ltZy5ibG9nLmNzZG4ubmV0LzIwMTcwNjA1MTEwNDA1NjY2?x-oss-process=image/format,png)

**简化版**（重要的是关注客户端和服务端的状态变化）

- 客户端和服务端的初始状态都是`CLOSED`
- TCP 创建 TCB 控制块后，服务端状态变为`LISTEN`
- 客户端发送第一条报文后，状态变为`SYNC-SENT`
- 服务端收到第一条报文后，状态变为`SYNC-RECEIVED`
- 客户端发送第二条报文后，状态变为`ESTABLISHED`
- 服务端收到第二条报文后，状态变为`ESTABLISHED`

**口语版**

- 客户端-->服务端：我想和你连接，你能收到吗
- 服务端-->客户端：我能收到，我们可以连接，你能收到吗，
- 客户端-->服务端：我收到了，我们开始连接吧

**🤔️ 为什么是三次握手不是二次握手？**

答：因为客户端和服务端都需要保证对方能接收到信息。

1. 防止重复连接：客户端给服务端发送消息，却没收到服务端的响应（可能是网不好），客户端可能会再次发送连接请求，这样会导致重复连接；
2. 同步初始化序列号，这是 tcp 可靠性的保障

##### 四次挥手

![image.png](https://imgconvert.csdnimg.cn/aHR0cDovL2ltZy5ibG9nLmNzZG4ubmV0LzIwMTcwNjA2MDg0ODUxMjcy?x-oss-process=image/format,png)

**口语版**

- 客户端-->服务端：我想请求断开连接
- 服务端-->客户端：好的，我看看我还有没有数据没发完
- 服务端-->客户端：好了，我的数据都发完了，可以断开了
- 客户端-->服务端：好的，那我断开了

## 五、跨域

### 为什么有跨域的存在？

#### 浏览器的同源策略

简单来讲，就是浏览器规定不同域名下的客户端脚本不能读写对方的资源。同源策略是浏览器的一个安全策略，它能帮助阻隔恶意攻击，减少可能被攻击的媒介。

### 怎样算跨域？

不同源的脚本相互访问，这个过程就叫**跨域**。

![image.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/13/1717441c9498fb98~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

只有当**协议、域名、端口号**三者都一致的时候才算是同源，比如下面的例子：

| 源 1                  | 源 2                       | 是否同源       |
| --------------------- | -------------------------- | -------------- |
| https://www.baidu.com | https://www.baidu.com/news | 🙆（同源）     |
| https://www.baidu.com | http://www.baidu.com       | 🙅（协议不同） |
| http://localhost:3000 | http://localhost:3001      | 🙅（端口不同） |
| https://www.baidu.com | https://www.baidu1.com     | 🙅（域名不同） |

### 如何解决跨域？

#### 1. 代理

**特点**：只能在开发环境使用

通过代理实现跨域应该是我们开发中使用最多的方式了，比如，在 React 和 Vue 项目中都会配置`webpack`，而`webpack`的`devServer`就是通过`http-proxy-middleware`插件实现跨域，原理是通过开启一个反向代理服务器；
基本原理如下图：
<img src="https://img-blog.csdnimg.cn/20210203163604475.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjcxOTY1Ng==,size_16,color_FFFFFF,t_70">

**正向代理**：

- 为客户端服务，主要是为了隐藏客户端的身份
- 使用场景：翻墙

![image.png](http://hungryturbo.gitee.io/webcanteen/images/%20forwardproxy.jpg)

**反向代理**：

- 为服务端服务，主要是为了隐藏服务端
- 使用场景：nginx 的反向代理，实现跨域；`http-proxy-middlewer`插件实现跨域

![image.png](http://hungryturbo.gitee.io/webcanteen/images/reverseproxy.jpg)

#### 2. CORS

**特点**：需要客户端和服务端合作

##### 简单请求

当请求同时满足以下条件时，浏览器会认为它是一个简单请求：

1. 请求方法属于下面的一种：

   - `get`
   - `post`
   - `head`

2. 请求头仅包含安全的字段，常见的安全字段如下：

   - `Accept`
   - `Accept-Language`
   - `Content-Language`
   - `Content-Type`
   - `DPR`
   - `Downlink`
   - `Save-Data`
   - `Viewport-Width`
   - `Width`

3. 请求头如果包含 Content-Type，仅限下面的值之一：

   - `text/plain`
   - `multipart/form-data`
   - `application/x-www-form-urlencoded`

如果以上三个条件同时满足，浏览器判定为简单请求。当发送简单请求时，会发生以下事情：

1. **请求头中会自动添加`Origin`字段**
   这个字段是为了告诉服务端，是那个源地址在跨域请求。

2. **服务端响应头中增加`Access-Control-Allow-Origin`**
   如果服务端允许全部域名访问，则将`Access-Control-Allow-Origin`设置为\*；当然也可以设置成具体的源，只允许这个源进行跨域请求。

其他更详细的内容指路 👉[前端面试必会网络之跨域问题解决](https://juejin.cn/post/7094162429310926855)

#### 3. Jsonp

**原理**：利用`<script>`等不受同源策略限制的标签，将回调函数通过 url 传递给服务端，然后服务端将数据放在回调函数中传给客户端。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0206925bfde4e939756c32ae800c777~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

**缺点**：只支持 GET 请求；传递的数据量太大的话，会超过 GET 请求的限制；安全性不高。

## 参考文章

- [浏览器中的进程和线程](https://zhuanlan.zhihu.com/p/489823633)
- [深入了解浏览器存储--从 cookie 到 WebStorage、IndexedDB](https://juejin.cn/post/6844903812092674061)
- [五千来多字，就为了聊聊 HTTP 报文，请求响应头，cookie 以及 HTTPS 加密方式](https://blog.csdn.net/weixin_42659261/article/details/113145579)
- [「查缺补漏」巩固你的 HTTP 知识体系](https://juejin.cn/post/6857287743966281736)
- [【基础】HTTP、TCP/IP 协议的原理及应用](https://juejin.cn/post/6844903938232156167)
- [两张动图-彻底明白 TCP 的三次握手与四次挥手](https://blog.csdn.net/qzcsu/article/details/72861891)
