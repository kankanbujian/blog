---
title: react new feature
date: 2021-01-04 17:28:03
tags: ['react', '新特性']
categories: 
    - [react]
    - [新特性]
---

# 引言
react18到来，带来了一个本质上的变更，并发渲染从本来的一种渲染策略模式变更成了人可以介入处理的并发方法。同时带来了一套新的ssr架构以及自动批处理，下面我们来走进

## automic batching
首先来聊聊批处理

```js
    react18 before

    after

    flushSync

    start

```
## 微任务如何批处理？











### unstable_batchedUpdates

### flushSync

### startTransition

