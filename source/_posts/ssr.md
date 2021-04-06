---
title: ssr
date: 2020-11-25 15:39:29
tags: ['react', '服务端渲染']
categories: 
    - [react]
    - [服务端渲染]
---

# ssr(server side render)

在现在react，vue等框架出现后，前后端分离大部分页面都是spa应用的今天，为什么还需要服务端渲染技术呢？

说到ssr，我们可以追溯到早期访问一个页面时，古老的jsp、php工程师们会根据页面的请求url，服务器直接生成相应的完整静态页面。而前端的工程师只是给这些静态页面添加一些交互效果，web开发浏览器也只负责展现后端给的页面而已。前后端基本分工基本耦合在一起，因为后端的返回的页面内容依赖于模版引擎，而且模版引擎又依赖后端环境以及相关处理的接口和数据，还不如一个人处理，所以当时基本没有单独的前端工程师，盛行的是后端也就是jsp工程师，一个人负责完整的开发。

和ssr对应的是客户端渲染csr(client side render)，而随着前端技术演进，ajax，node.js以及更加强大的渲染框架如react,vue等，前端分离的架构模式也就顺理成章。
前后端分离的架构中，前端初始加载一个简单html文件，他只有简单的html结构，不包含展示内容，真正的页面逻辑都通过react或者vue等框架打包成一个js包，当html遇到这个js再通过ajax去加载相关代码进行页面渲染和相关的交互处理，从而在客户端渲染出页面逻辑。

两相对比，ssr有其优点

1. 相对于服务端渲染而言，客户端渲染有其弊端，因为大部分爬虫只能爬html页面数据，无法爬到加载的js内容，这样的话搜索引擎就无法爬到客户端渲染的内容，不利于seo，而ssr返回的html是完整页面，能够被搜索引擎更好的爬虫分析和索引。
2. 更快的首屏加载速度：客户端渲染返回的是空白html页面，需要下载js然后执行才能显示内容。而且ssr直接返回html显然有更快的渲染体验。

那么我们现在说的ssr是一种倒退的么？现代服务器渲染的一种实现方式也就是通过应用，node.js的出现使得javascript一套代码在前后端能够统一实现，而react提出的虚拟dom的概念，使得在浏览器才有的dom概念转变为虚拟dom的一种js结构，于是可以通过大量可复用代码实现前后端渲染的一致性，用react代码在服务端先执行一次，使得用户的html包含展示内容，再在客户端再次执行代码，执行其中的事件绑定数据添加等交互能力。这不是简单的面向早期web开发的倒退，而是一种回归式的发展。基于不同业务需求的理念。

1. 在服务器上生成渲染内容：加速首屏和seo搜索.
2. 客户端执行js脚本完成对应的页面绑定、用户交互.

## 基于React的ssr实现

我们先完成一个最简单的ssr应用。首先我们需要搭建一个简单的node.js服务器，对其发送请求可以返回一个完整的html页面
我们在src下创建一个components，用于存放服务端和客户端都会用到的同构组件Home.js，在src下创建一个服务端的启动文件。
Home.js

```javascript
    const React = require('react');

    const Home = () => {
        return (
        <div>
            <div>This is Home</div>
        </div>
        )
    }

    module.exports = Home;

```

app.js

```javascript
    const express = require('express');
    const React = require('react');
    const {renderToString} = require('react-dom/server');
    const app = express();
    require('node-jsx').install();

    const Home = require('./components/home');
    const content = renderToString(React.createElement(Home));
    app.use('/', (req, res, next) => {
        res.send(`
        <html>
        <head>
            <title>ssr</title>
        </head>
        <body>
            <div id="root">${content}</div>
        </body>
        </html>
    `)
    })

    app.listen(3001, () => {
        console.log('3001 port is started');
    })

```

基于此，node .\src\app.js，就能开启我们的express框架下搭建起来的简单服务端，基于react的ssr服务端渲染项目就构造好了。可以看到页面被渲染出来，后端返回的完整html。
![ssr page render init](https://cdn.jsdelivr.net/gh/kankanbujian/image_host@main/65b878a914296bf6d38ee7ac595bc2ee-ssr_init-e3a791.png)

注意：

1. 引入node-jsx，可以在node.js下对jsx模块进行支持，可以理解为babel的作用。
2. 同构项目得以实现本质上是因为react提出的虚拟dom，在页面操作时，react实际操作的不是真实dom而是虚拟dom(普通的js对象)。这就使得服务端对"dom"操作成为可能。react-dom有专门为服务端渲染提供的api, 可以参看react-dom/server下内容。本例中使用的ReactDOMServer.renderToString(element)可以将react元素渲染为html，然后返回一个html字符串，由此服务端获取到完整的html页面从而实现服务端渲染。

## 添加事件

现在我们尝试给组件添加事件，发现不会生效

```javascript
    const Home = () => {
        return (
            <div>
                <div>This is Home</div>
                <button onClick={() => {console.log('btn is clicked')}}>按钮</button>
            </div>
        )
    }
```

这是因为这个页面是服务端直接返回的一个 HTML 页面，并没有真正初始化 React 实例。只有在初始化 React 实例后，才能更新组件的 state 和 props，初始化 React 的事件系统，执行虚拟 DOM 的重新渲染机制，让React组件真正工作。因此我们需要在客户端也跑一次。

在根目录下创建client文件下，创建index.js文件作为客户端入口
client/index.js

```javascript
    import React from 'react';
    import ReactDom from 'react-dom';
    import Home from '../component/Home';

    const App = () => {
    return (
        <Home></Home>
    )
    }
    ReactDom.hydrate(<App />, document.getElementById('root'))
```

app.js

```javascript
    // 加载客户端的打包后的js
    app.use(express.static('dist'));

    // 在返回的html页面中加载js，使得客户端再次渲染
    `
    <script src="/index.js"></script>
    `
```

再次运行代码我们可以看到事件已经添加上去了。
![添加事件成功](https://cdn.jsdelivr.net/gh/kankanbujian/image_host@main/635a99af91e73e8ce0a3361c4a65543f-ssr_add_event-3f5e26.png)

### 小结

本文大致将ssr原理基本讲清，也对基于react的同构应用做了一个基本实现，后续还有ssr的路由、样式、注水、脱水，以及现在比较好的ssr框架next.js的使用和解析。欢迎大家指教和讨论，如有问题请大家指出，谢谢。
