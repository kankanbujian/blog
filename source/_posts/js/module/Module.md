---
title: Module
date: 2019-07-15 18:56:33
tags:
---

## 今生今世
古老的前端由于前后端不分离，承载的东西较少，基本只有简单静态页面渲染以及部分简单的js脚本就能处理的事件。所以在很长一段时间，js作为一个单纯的脚本语言没有模块语法，不是什么问题。

但随着ajax技术的广泛使用，前端渲染框架vue、react、angular等框架如雨后春笋冒出，前端生态演进，前后端分离。由此前端承载了越来越多的内容，数据模型、视图模型的处理、业务数据/业务逻辑的处理、bff层中间件的开发等，使得模块化的需求与日俱增。

因此js社区提出了CommonJs、AMD、UMD等规范，CommonJs主要用于服务端，NodeJs的模块就是遵从CommonJs来实现的，AMD主要用于浏览器环境。最后在ES6提出了js的模块化方案，我们成为ES Module。

因此不同项目、不同依赖可能用的模块输出方案、打包方案都不一样，所以对于不同的模块化方案、特性、以及如何兼容等等我们都应该有所了解，下面我们分别深入了解并对比，

---

### CommonJS

NodeJs的模块化就是采用的CommonJs规范，因此我们直接从NodeJs的模块化着手了解CommonJs。在NodeJs中每个文件就是一个模块，每个文件默认有一个module对象，module上有exports属性，每个文件的exports就是其最终暴露给外部的对象。
```js
    // commonJs.js
    // 给模块添加val属性
    exports.val = 1
    // 覆盖当前文件要暴露的对象
    module.exports = {
        val: 2
    }
    // index.js
    const obj = require('./commonJs.js')
    console.log('obj---', obj) // {val: 2}
```

CommonJs规范有以下一种特性：
1. 同步加载
2. 只要引用都会将整个模块全部加载进来
3. 引用是值引用
4. 循环引用为了避免无限循环，只要已经加载过的模块，不会重新加载，并且只会引用到当前模块完全执行完，已经构造过的exports


针对上述我们主要分析一下代码

```js
    // a.js
    const b = require('./b')

    console.log('a---start')

    console.log('a---b', b)

    exports.a = 1

    // b.js

    const {a} = require('./a.js')
    console.log('b-----a = ', a)
    let b = 1
    module.exports = {
        b
    }
    // index.js
    const a = require('./a.js')
```

```js
    (
        ()=>{
            var o={
                681:(o,r,t)=>{
                    const s=t(218);
                    console.log("a---start"),console.log("a---b",s),r.a=1
                },
                218:(o,r,t)=>{
                    const{a:s}=t(681);
                    console.log("b-----a = ",s),o.exports={b:1}
                }
            },r={};
            !function t(s){
                var e=r[s];
                if(void 0!==e)return e.exports;
                var a=r[s]={exports:{}};
                return o[s](a,a.exports,t),a.exports
            }
        (681)
        }
    )();
```
我们分析一下，打包后到源码：

1. 生成了一个缓存了所有模块代码的缓存o，以及一个用于存储当前已加载的模块缓存对象r
```js
     var o={
        681:(o,r,t)=>{
            const s=t(218);
            console.log("a---start"),console.log("a---b",s),r.a=1
        },
        218:(o,r,t)=>{
            const{a:s}=t(681);
            console.log("b-----a = ",s),o.exports={b:1}
        }
    },r={};
```
2. 构造了一个require函数，入参数为加载的模块在所有加载模块缓存的key，
```js
    // t相当于require，s为require的模块所对应的缓存的key
    function t(s){ 
        // 首先查看已加载的缓存r中是否已存在当前模块，如e存在则表示已加载，直接返回当前加载完的模块（无论是否完全加载完成）
        var e=r[s];
        if(void 0!==e)return e.exports;
        // 只要加载了的代码，一旦加载不管是否完成，就会存入已加载模块的缓存中，下次再被调用就会直接使用r[s]当前的exports
        var a=r[s]={exports:{}};
        // 去所有加载了的缓存模块代码中获取到对应执行模块并存入到已加载模块缓存中。执行对应模块代码并且将r传入将对应文件的模块复制给他
        return o[s](a,a.exports,t),a.exports
    }

```
3. 加载当前模块681
```js
    
    t(681) 
    // ===>
    function t(681){  // function require(681)
        // 首先查看已加载的缓存r中是否已存在当前模块，如e存在则表示已加载，直接返回当前加载完的模块（无论是否完全加载完成）
        var e=r[s];  // r = {} => e = r[681] = undefined
        if(void 0!==e)return e.exports; // go on
        var a=r[s]={exports:{}}; // a = r[681] = {exports:{}} 

        return o[s](a,a.exports,t),a.exports
        // 
        var o = {681:(o,r,t)=>{
            const s=t(218);
            console.log("a---start"),console.log("a---b",s),r.a=1
        }}

        return o[s](a,a.exports,t),a.exports 
        =>
        // var a=r[s]={exports:{}}
        (o,r,t) => {// (a,a.exports, require)=>{
            // 执行模块代码
            const s=t(218);
            console.log("a---start"),console.log("a---b",s),
            
            r.a=1 // r[618] = {exports: {a = 1}}
        }
    }
```
首先我们声明一个已加载过的模块缓存为loadedCached
1. 由源码分析中require的实现我们可以看出，每次都require只要开始加载就会存到loadedCached中，每次只要该缓存中有对应要加载的模块对应的key则直接返回模块，这就避免了无限循环。
2. 但是由于上述原因，若loadedCached[key]对应模块若没加载完，但是只要loadedCached[key]不为空，就会直接返回loadedCached[key].exports，所以可能会出现问题。
3. 若模块未被加载，则会创建一个空的{exports: {}} 赋予loadedCached[key]，并且会将
loadedCached[key]以及loadedCached[key].exports传入要加载的模块代码中
```js
    (loadedCached[key], loadedCached[key].exports, require) => {
        export.a = 1 => loadedCached[key].exports.a = 1
        module.exports = {} => loadedCached[key].exports = {}
    }
```
因此可以看出：
1. 每个代码只会被加载一次，其后每次返回的都是loadedCached[key].exports。
2. require是一个同步执行的js代码块。
3. 循环引用不会引起无限循环，当时只能加载到loadedCached[key].exports

--- 

## AMD
由于CommonJs是同步的，所以对于浏览器的话不太友好，因为同步加载的话会阻塞住线程，让用户交互科顿，所以就有了AMD规范-Asynchronous Module Definition
从名字上就大致了解特性：
1. 异步加载
2. 使用defind语法进行module的声明定义

### AMD的使用

如果要用AMD需要引入按照AMD规范实现的第三方库，比如require.js,去官网下载对应的脚本，放到本地，然后通过
```js
    <script src='public/require.js'>
```
即可引入
#### 如何声明暴露module
在对应的module文件中通过deine定义模块要暴露的module对象
```js
    define(function (){
　　　　var add = function (x,y){

　　　　　　return x+y;

　　　　};
　　　　return {

　　　　　　add: add
　　　　};
　　});
```
#### 如何使用
Node.js 在基础库本来就包含了require API提供出来用于实现CommonJs，而且AMD模块的加载也使用require(),但是区别是多了个参数
```js

    require([modules], callback)

    function callback(module) {
        // module表示加载到的AMD模块
    }
```

---

## ES Module
不同规范的提出给前端的module实现做出了支持，但是不同库、项目使用的规范可能不尽相同，多种规范不统一也可能带来各种恶果、终于在ES6提出了js的module方案，这里本文称为ES Module

### 使用
主流的浏览器以及NodeJs大多版本都已支持ES Module
NodeJs中使用
* 将文件名定义为mjs，则运行时NodeJs会认为该文件使用ES Module
* 将package.json中的type定义为module，则会将所有js文件认为是module，如果需要使用CommonJsm模块，需要将对应的脚本名改为.cjs，同理，反过来也一样

浏览器中使用
* js分脚本和模块两种，所以当type声明为module时，则会认为当前加载的文件为模块
```js
    <script type='module'>
```

### 特性

相对于CommonJs等模块，ESModule是编译时加载，也就是在编译阶段根据import的变量去加载相应的值，因此就可以在编译期间确定模块依赖关系，可以进行DCE（dead code elimination）等处理。

1. 预编译期间静态加载，
2. 加载的是引用




```js 
    /* es6 模块使用方法*/
    import 'modulename'
    import a from 'modulename'

```

es6提供了两个方法: import 和 export
export：用于确定模块对外输出的接口

```js
    // 主要有以下两种方式，两种方式是等价的
    // 1
    export var a = 1;
    // 2
    var a = 1;
    export {
        a
    }
    
```

推荐第二种输出方式，这样可以看到该模块所有对外输出的变量，export规定了对外输出的接口，就是内部值和对外输出的值做一个映射。

```js
    //这就是为什么下面方法是错误的原因
    var a = 1;
    export a;
    // 因为这相当于直接输出
    export 1 // 根本就没有指定要输出的模块
    // 
    export var a = 1;
    //相当于export 
    var a = 1;
    export {
        a as a
    }
    //也就是输出自己本身名字作为命名，如果要对外输出重新命名则可用as
    export {
        a as anotherName
    }
```


### 静态加载过程
```js
    // a.js
    export let a = 1

    // index.js
    import {a} from './a.js'
    console.log('a---', a)
    // 编译后代码
    (()=>{"use strict";console.log("a---",1)})();
```
ES Module 会被自动加上严格模式，可以看到代码在编译期间自动将引入的值替换成了对应的引用，这就使得在编译期间就能确定所有的引用模块，进行优化处理。


###  CommonJs 和 ES Module的兼容

我们引用某些库，或者提供某些库可能不知道该模块暴露出来的具体变量去加载，而是想要直接使用，则可以使用export dfault为模块指定默认输出。
该方式的本质相当于会将该模块的输出放到指定到default变量上

```js
    // a.js
    var a = 1;
    export default a;
    // 相当于
    export default {
        a as default;
    }
    // 此时外部如果需要使用则需要

    //b.js
    import A from 'a.js';
    console.log(A); // 1
    // 相当于
    import {default as A} from 'a.js';
    console.log(A);
```

这里有一个常见的误区

```js
    // 这里使用的{a,b} 看上去跟
    import {a,b} from './util.js';
    // 上面通过模块暴露的变量名去引用该变量的方式也被称为named export,跟对象的解构看上去很像，但是不是同一回事
    import A from './util.js';
    const {a,b} = A;

    // 因此会有个很常见的问题
    // util.js;
    const a = 1;
    const b = 2;
    export default {
        a,b
    }
    // test.js
    import {a,b} from './util.js';
    console.log(a, b); // 这里只会输出undefined, undefined;

```

正确的方式如下，只有通过export约定了该模块对外输出的接口名（变量名或者方法名） ，才能够通过import {接口名} 去输入需要的模块，这中也被称为named export, 跟对象的解构没有任何关系，也无法进行解构，所以如果像上面的例子一样输入模块默认输出，那只能引入整个默认对象，并不能将其解构。所以上面的例子返回的undefined。


## 问题

上述所说的关于默认模块引入的问题是个很常见的严重错误。但是如果使用babel5去转换，则发现可以正常输出。而且babel6发现了该问题并且解决修复了，所以babel 6进行模块转换的话会发现输出是undefined undefined。但是如果是老代码从babel5迁移到babel6的话则需要进行兼容，所以有babel-plugin-add-module-exports可以解决该问题，可以通过该插件恢复babel5错误的代码现象。

很多第三方库或者模块都是只用cjs写的，这导致前端项目中可能有cjs也可能有ejs模块。那么对于这些模块的编译需要统一一个规则。
对于CmmonJs模块来说输出的是模块要导出生成的模块对象modole.exports。
对于esmodule来说模块由于named export 指定输出接口，也包含default export的模块默认输出。
所以为了兼容default export 则相当于做以下转换

```js
    const a = 1;
    export default a;
    // babel会将esmodule转换成cjs模块
    const a = 1;
    module.exports["default"] = a;
    
```

对于named export来说

```js
    export const a = 1;
    //引用
    import {a} from 'A';
    console.log(a);

    // babel会将esmodule转换成cjs模块
    module.exports.a = 1;
    // 引用
    import A from 'A';
    console.log(A.a);
    
```

本质上就是cjs引入是cjs模块对象，而直接引ejs其实只是引入了ejs的默认输出，对于cjs也就是放到了exports.default属性上，因此为了兼容如果是cjs模块就是该模块导出时放到default属性上。

```js
    // 类似如下方式
    function getModule(module) {
        module?.__esModule ? module : {default: module};
    }
    
```

这样不管是esm还是cjs引入都会有default属性，因此引入时直接取default就可以兼容esm和cjs模块。

## 一些小的注意点
    1. 这import和export两个方法只能在最顶层使用，因为如果放到函数或者其他块语句比如条件语句内部则需要动态运行才能确定，违反了静态化的原则。
    2. 由于import在编译时处理，所以会被提升到顶部。


本题可以采用「单调栈」的解法，可以参考「496. 下一个更大元素 I 的官方题解」。使用单调栈先预处理 \textit{prices}prices，使得查询 \textit{prices}prices 中每个元素对应位置的右边的第一个更小的元素值时不需要再遍历 \textit{prices}prices。解法的重点在于考虑如何更高效地计算 \textit{prices}prices 中每个元素右边第一个更小的值。倒序遍历 \textit{prices}prices，并用单调栈中维护当前位置右边的更小的元素列表，从栈底到栈顶的元素是单调递增的。具体每次我们移动到数组中一个新的位置 ii，就将单调栈中所有大于 \textit{prices}[i]prices[i] 的元素弹出单调栈，当前位置右边的第一个小于等于 \textit{prices}[i]prices[i] 的元素即为栈顶元素，如果栈为空则说明当前位置右边没有更大的元素，随后我们将位置 ii 的元素入栈。

当遍历第 ii 个元素 \textit{prices}[i]prices[i] 时：

如果当前栈顶的元素大于 \textit{prices}[i]prices[i]，则将栈顶元素出栈，直到栈顶的元素小于等于 \textit{prices}[i]prices[i]，栈顶的元素即为右边第一个小于 \textit{prices}[i]prices[i] 的元素；

如果当前栈顶的元素小于等于 \textit{prices}[i]prices[i]，此时可以知道当前栈顶元素即为 ii 的右边第一个小于等于 \textit{prices}[i]prices[i] 的元素，此时第 ii 个物品折后的价格为 \textit{prices}[i]prices[i] 与栈顶的元素的差。

如果当前栈中的元素为空，则此时折扣为 00，商品的价格为原价 \textit{prices}[i]prices[i]；

将 \textit{prices}[i]prices[i] 压入栈中，保证 \textit{prices}[i]prices[i] 为当前栈中的最大值；

Python3C++JavaC#CJavaScriptGolang


