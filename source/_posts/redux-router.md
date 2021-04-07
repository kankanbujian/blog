---
title: redux-router
date: 2021-03-06 17:23:12
tags: [手写系列, redux-router] 
categories: 
    - [手写系列] 
    - [redux-router]
---


# redux-router

今天我们完成一个react的路由系统，顾名思义，它是一个react官方维护的，也是唯一一个可选的路由库，本质上就是通过管理url路径来对页面的react组件进行更新渲染。

## 思路

主要用到的思想其实是一个全局的路由管理，从react组件的最外层到最里层都能获取到唯一的网页url、history、hash等属性，通过监听页面的url变化来引起全局的属性的更新，从而从外到内的组件根据url的变化进行路由的选择及更新。
下面写一下伪代码：

```react
    <Outer hash="#a">
        <Inner1 path="#a" hash="#a"/> // 内部逻辑如果hash === #a则渲染否则return null;
        <Inner2 path='#b' hash="#a">  //内部逻辑同上 
    <Outer hash="#a">****
```

则当hash==='#a'时回渲染Inner1
这时监听到url变化，hash变为了#b

```react
    <Outer hash="#b">
        <Inner1 path="#a" hash='#b'/> // 内部逻辑如果hash === #a则渲染否则return null;
        <Inner2 path='#b' hash='#b'>  //内部逻辑同上 
    <Outer hash="#a">
```

因此我们需要干两件事

1. 维护一个属性，当该属性变化时，所有需要的组件，不管嵌套多深都能拿到。
2. 监听url的变化，当url变化时候维护的属性进行刷新，从而使得使用该属性的组件进行更新渲染。

看到1想到的是什么呢，自然而然是react的Context，通过Conext.Provider以及Context.Consumer我们可以在最外层到嵌套的最深子组件都能拿到我们想要的属性。

所以我们可以定义一个ReactRouterContext，该上下文维护的值则是路由所需要的history,hash等信息。

对于第二点来说，我们如何监听url的变化呢，要自己写也可以，总体思想是利用window的location的属性以及监听window.onhashchange方法,这个比较简单，大家可以自己实现以下。也有现成的history库，我们可以直接使用其提供的listen去监听url的变化。

具体代码参考我的代码库，请点击[传送门](https://github.com/kankanbujian/handwriting-series/tree/redux-router-handwriting
)
