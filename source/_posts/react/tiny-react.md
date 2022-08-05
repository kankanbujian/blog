---
title: react new feature
date: 2021-01-04 17:28:03
tags: ['tiny-react', 'react原理']
categories: 
    - [react]
---

# 背景
目标很明确， 要写一个缩水的react。
#### 为什么要重复造轮子？
* react源码的边界处理、对象层级、优化、状态处理、逻辑等太过复杂，将主要的逻辑抽离出来，给一些对源码感兴趣的人有一个大致整体的了解，然后可以再去深入每个环节看具体源码如何处理的
* 把一件事情尤其是源码说清楚不是一件易事，希望将react框架的逻辑和架构大致能聊明白

总之，我们开始吧

---

## 先从jsx开始

```js
    const jsx =  <div style="color: red" id='test'><h1>我是一个jsx</h1></div>
    ReactDom.render(jsx, document.getElementById('root'));
```
首先简单说一下jsx，jsx是一个react提供的语法糖，你当然可以不使用，因为本质上jsx需要对应的编译器将代码专程对应的js代码，这样对应运行的浏览器环境才能解析。一般我们使用babel去处理js的编译问题，可点击下方传送门跳转
#### [jsx-babel在线编译地址](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=MYewdgzgLgBAVhAHjAvDAPAEwJYDcB86AFgIz6CIRoPRmgAHKBUcgougPSmFM4EBQASgKYCGwKABEQAWwB0AJ15hMvKQAoGAGhiYQwAK5jZUCQHNeUAKIAbXrrBQAQgE8AkpkUByKSBBQXASm8BuIA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=react&prettier=false&targets=&version=7.18.10&externalPlugins=&assumptions=%7B%7D)
```js
    const jsx = /*#__PURE__*/React.createElement(
        "div", 
        {
            style: "color: red",
            id: "test"
        },
        /*#__PURE__*/React.createElement("h1", null, "\u6211\u662F\u4E00\u4E2Ajsx")
    );
    ReactDom.render(jsx, document.getElementById('root'));
```
本质上jsx会被编译器转换成React.createElement函数，从而返回一个reactElement对象，该对象描绘了jsx中我们所希望界面所展示的样子，我们知道，网页所展示的本质上根据dom元素也就是文档对象模型结构所解析出来的内容。因此对应的reactElement对象我们也称为虚拟dom。

### createElement以及ReactDom.render
那么我们先做好当前的两件事
1. 实现createElement函数
2. 实现ReactDom.render，将返回的虚拟dom，挂载到我们希望的dom元素上并进行渲染。

```js
    // react/index.js
    const jsx = /*#__PURE__*/React.createElement(
        "div", 
        {
            style: "color: red",
            id: "test"
        },
        /*#__PURE__*/React.createElement("h1", null, "\u6211\u662F\u4E00\u4E2Ajsx")
    );
    //从编译后的代码我们可以推导createElement
    function createElement(type, config, ...children ) {
        // 返回我们的虚拟dom对象
        let props = {} 
        // 这里简单做处理，正常来说会有默认预设的props对我们的虚拟dom对象做一些设置，将这些过滤
        for (let key in config) {
            if (props[key] !== undefined) {
                props[key] = config[key]
            }
        }
        // 我们可以看到，children如何是html标签那么会创建为ReactElement对象，否则的会直接是一个字符串文本，为了对后面ReactDom.render能够根据类型去挂载创建不同的dom实体，我们需要做特殊处理
        children.map(_child => {
            if (typeof _child !== 'object') {
                return {
                    $$type: 'REACT_ELEMENT_TYPE',
                    type: TEXT_ELEMENT,
                    props: {
                        children: []
                    }
                }
            }
            return _child
        })
        props.children = children.length ? children : []
        return {
            type,
            $$type: 'REACT_ELEMENT_FLAG'//reactelement的标识
            props
        }
    }
```

```js
    ReactDom.render(jsx, document.getElementById('root'));
    // 看到用法其实就是将我们的虚拟dom也就是vdom挂载到真正的dom上去
    // react/react-dom.js
    function render(vdom, container) {
        const {type, props} = vdom
        let dom = null
        if (type === TEXT_ELEMENT) {
            dom = document.createTextNode('')
        } else if (typeof type === 'string') {
            dom  = document.createElement(type)
        }
        props.children.forEach(_child => {
            render(_child, dom)
        })
        Object.keys(props).filter(_key => _key !== 'children').forEach(_key => {
            dom[_key] = props[_key]
        })
        container.appendChild(dom)
    }
```
---

这样一个简单的vdom创建以及渲染就写完了，那么如何使用我们自己的框架应用到程序呢，方法有很多，比如alias， 这里推荐使用的注释的方式
```js
    import TinyReact from './react/index.js'
    // @jsx Tiny.createElement
    const jsx =  <div style="color: red" id='test'><h1>我是一个jsx</h1></div>
    // 
```

仍然使用上文的在线解析，[点此跳转](#jsx-babel在线编译地址)，babel会将其解析如下
```js

    import TinyReact from './react/index.js'
    // @jsx Tiny.createElement
    const jsx = Tiny.createElement("div", {
    style: "color: red",
    id: "test"
    }, Tiny.createElement("h1", null, "\u6211\u662F\u4E00\u4E2Ajsx"));
```
这样大家就可以使用我们自己写的简易react运行起来了！

---
### concurrent
我们思考一下现在的问题当前的渲染存在什么问题
```
    function render(vdom, container) {
        const {type, props} = vdom
        let dom = null
        if (type === TEXT_ELEMENT) {
            dom = document.createTextNode('')
        } else if (typeof type === 'string') {
            dom  = document.createElement(type)
        }
        **props.children.forEach(_child => {
            render(_child, dom)
        })**
        ...
    }
```