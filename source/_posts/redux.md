---
title: redux
date: 2020-12-11 23:28:50
tags:
---

# Redux

redux是一个单独的库，它提供了一个状态管理容器，负责管理应用的数据流。

说到状态管理我们先提一下React, 说到React我们都知道它是单向数据流。什么是单向数据流？

1. 数据的传递方式是单向的：在React中数据的流动方向只能从父组件流入子组件中。
2. 更新是单向的：组件只能被动接受数据源的更新来对自己进行更新渲染，而无法通过改变组件自身的值去改变数据源的值。所以React中组件的更新只能通过数据源的变化使用新值去触发重新渲染组件而已。

``` react
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

redux由以下主要有以下几个重要部分： store, reducer, dispatch
store作为状态管理容器存在，通过react触发事件也就是dispatch到store中，然后store接收到相应的行为对自身状态进行更新，再传递给相应的组件上引起view的更新
reducer作为store中处理相应的行为更新state的逻辑层存在。
reducer接收两个参数，第一个参数是接收到的dispatch传递过来的action。第二个参数是当前store中的状态state。然后通过action来更新state的值。

```
    function  createStore(reducers, initialState, enhance) {
        let state = initialState || {};
        let cbs = [];
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