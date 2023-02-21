---
title: promise
date: 2021-01-04 17:28:03
tags: ['promise', 'js']
categories: 
    - [promise]
    - [js]
---

## Promise
1. then或catch要将后续链式调用方法存储待当前promise状态更改时触发
2. resolve或者reject要做的事也很清楚了，要讲promise内部状态从'pedding' -> 'reject'|'fulfilled', 执行链式回调

```js
    function Promise(excutor) {        
        this._status = 'pendding'
        this._fulfiledCbs = []
        this._rejectCbs = []
        this._value = null
        
        this.resolve = (value) {
            /* 
                1. value和status更改
                2. 执行链
            **/
            this._value = value
            this._status = 'fulfilled'
            this._fulfiledCbs.forEach(_cb => {
                let result  = _cb.onFulfilled.call(this, this.value)
                _cb.resolve(result)
            })
        }
    }
    // 链式调用，then中要返回一个新的promise，为下一个链式做准备
    Promise.prototype.then = function (fn) {
        return new Promise((resolve, reject) => {
            // 有两种情况 1. 当前状态为pendding，则需要存储待执行的链，否则直接执行即可
            if (this._status === 'pedding') {
                // 当前的resolve也要存储进来，因为当前返回一个新的异步promise，则需要在当前promise状态改变时再去调用下一个链
                this._fulfiledCbs.push({
                    onFulfilled: fn,
                    resolve
                })
            } else {
                // 执行
                let result  = fn.call(this, this.value)
                resolve(result)
            }
        })
    }

    new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('321321')
            resolve('first promise')
            console.log('end---')
        }, 100)
        
    }).then(resp => {
        console.log('second start---resp', resp)
        return 'seond promise'
    }).then(resp => {
        console.log('third start---resp', resp)

    })
    
```


## Promise.finally实现
思考思路
1. promise调用，所以挂在到Promise.prototype上
2. 

```js
    
    Promise.prototype.resolve = function () {
        if (!this.cbs.length) {
            this.finally.apply(this, this.value)
        }
    }
    Promise.prototype.reject = function () {
        this.failCbs.forEach(_cbs => cbs.call(this, this.value))
        this.finally.apply(this, this.value)
    }
    Promise.prototype.finally = function (fn) {
        return new Promise((resolve, reject) => {
            if (this.status === 'pedding') {
            
            } else  {
                
            }
            this.finally = fn.bind(this)
        })
        /* 
            1. 所有的
        **/
    }
```


### Promise.all
等待所有promise执行成功，有一个失败就失败
```js
    Promise.all = function (promiseArr) {
        return new Promise((resolve, reject) => {
            const n = promiseArr.length
            let ans = new Array(n), count = 0
            try {
                fpromiseArr.forEach((p, index) => {
                    p.then(resp => {
                        count++
                        ans[index] = resp
                    }).catch(e => {
                        return new Error(e)
                    })
                    if (count === n) resolve(ans)
                })
            } catch (e) {
                reject(e)
            }
        })
        
    }


    Promise.race = function (promiseArr) {
        return new Promise((resolve, reject) => {
            const n = promiseArr.length
            try {
                fpromiseArr.forEach((p, index) => {
                    p.then(resp => {
                        resolve(resp)
                    }, reject)
                }, () => reject)
            } catch (e) {
                reject(e)
            }
        })
        
    }
    
```

### Promise.resolve
1. 当入参不是promise时会讲他包装成一个promise返回
    ```js
        Promise.resolve('foo') 
        //等价
        new Promise(resolve => resolve('foo'))
    ```
2. 当入参是promise时会原样返回
    ```js
        Promise.resolve(new Promise(resolve => resolve('a'))) 
        //等价
        new Promise(resolve => resolve('a'))
    ```

```js

```