---
title: redux
date: 2020-12-11 23:28:50
tags: [手写系列, redux]

categories: 
    - [手写系列] 
    - [redux]
---

# Redux

redux是一个单独的库，它提供了一个状态管理容器，负责管理应用的数据流。

说到状态管理我们先提一下React, 说到React我们都知道它是单向数据流。什么是单向数据流？

1. 数据的传递方式是单向的：在React中数据的流动方向只能从父组件流入子组件中。
2. 更新是单向的：组件只能被动接受数据源的更新来对自己进行更新渲染，而无法通过改变组件自身的值去改变数据源的值。所以React中组件的更新只能通过数据源的变化使用新值去触发重新渲染组件而已。

```react
class View extends React.Component {
    constructor(props) {
        super(props);
    }

    return <input>{props.text}</input>
}
```

input组件能通过数据源更新进行视图的更新，但是input组件本身value的变化并不能引起数据源的更改

那么当有一些组件，需要相同的数据来进行更新，并且很多行为都会触发这个数据的改变时，就需要有一个状态管理容器来管理数据源。

## Redux核心

> redux由以下主要有以下几个重要部分： store, reducer, dispatch
store作为状态管理容器存在，通过react触发事件也就是dispatch到store中，然后store接收到相应的行为对自身状态进行更新，再传递给相应的组件上引起view的更新。

> reducer作为store中处理相应的行为更新state的逻辑层存在。
reducer接收两个参数，第一个参数是接收到的dispatch传递过来的action。第二个参数是当前store中的状态state。然后通过action来更新state的值。

> 为什么叫做reducer，这跟js中数组的一个reduce有关系。
arr.reduce((cur, next) => return f(cur, next));
数组的reduce函数可以接受一个参数，其中cur是当前状态, 最终根据next也就是下一个会改变状态的值来生成一个新的状态。这也就是reducer的意义。每个reducer都是一个纯函数，根据新的action来处理返回一个新的状态state。

>dispatch就是用来触发reducer更新state的一个事件。
而subscribe则可以订阅state的更新，一旦更新完成就会触发subscibe的回调。
那么很显然，我们立马根据逻辑就能写出相关的代码了

```javascript
    function  createStore(reducers, initialState) {
        
        let state = initialState || {}; // 状态树
        let cbs = []; // 当state更新后，subscribe订阅的回调

        function  dispatch(action) {
            state = reducers( state, reducer);
            subscribe(state);
        }

        function subscribe(fn) {
            cbs.push(fn);
        }

        function getState() {
            return state;
        }
    }
```

redux的核心代码量可以说是短小精悍，但是不影响其经典。它的中间件就是之一。

可以看出，上面这些简单的代码和逻辑就已经足够view订阅state的更新，用户操作通过dispatch去触发reducer的state的更新，当state更新后，view视图订阅的回调可以引起view的重新渲染，形成一个flow。
然而不同业务和不同开发可能需要在状态更改前后做一下特别的逻辑，这时候就有中间件的出马了。

简单的来讲redux保证自己核心的状态管理逻辑，其他如果你想要增加功能可以使用中间件去定制，其实就是个装饰模式。

```javascript
    function  createStore(reducers, initialState, enhancer) {
        ...
        if (enhancer) {
            return enhancer(createStore)(reducers, initialState);
        }
        ...
    }
```

这就是中间件，简单的说返回一个功能更强大的createStore。从enhancer的命名我们就能看出redux的态度了。其核心支持就是applyMiddleware。

那么我们来思考一下，中间件返回了一个更强大的createStore

```javascript
    const oneEnhancer = createStore => (reducers, initialState) => {
        const { getState, dispatch, subsribe} = createStore(reducers, initialState);
        // 接下来我们就可以使用不同的模块去增强我们的功能了, 实际上中间件只会对dispatch进行加持，因为在dispach触发前后进行增强就能满足所有的需求了
        return {
            getState: enhanceFn(getState),
            dispatch: enhanceFn(dispatch),
            subsribe: enhanceFn(subsribe),
        }
    }
```

那么applyMiddleware的逻辑就简单，接收不同的中间件来对createStore进行加持，返回一个enhancer的createStore

```js
    const applyMiddleware = (...middleware) => 
        createStore => (reducers, initialState) => {
            const store = createStore(reducers, initialState);
            // 接下来我们就可以使用不同的模块去增强我们的功能了

            const realDispatch = compose(middleware)(store.dispatch);
            return {
                ...store,
                realDispatch
            }
        }
```