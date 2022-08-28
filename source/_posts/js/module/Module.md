---
title: Module
date: 2019-07-15 18:56:33
tags:
---

## 历史

es6之前js是没有模块这个规范的，这也就是说没有办法将一个大程序拆解成一个个module。为此js社区制定了模块加载方案，主要使用CommonJS, AMD。

webpack打包是通过CommonJS模块，每个js文件都包含一个module对象，该对象就是一个模块，module上面有exports属性，通过对该值复写就可以实现模块的暴露。

```js
    //A.js
    var a = 1;
    module.exports = a;
    // 跟下面相当。
    exports = a
```

## es module

es6制定了Module标准，也就是ESModule。相对于CommonJs等模块，ESModule是编译时加载，也就是在编译阶段根据import的变量去加载相应的值。
而CommonJs是在运行时根据require获取到该暴露出来的整个模块对象，也就是module.exports。

```js
    // commonJs.js
    var a = 1;
    var b = 2;
    var c = 3;
    module.exports = { a,b,c }

    // test.js
    const commonJs = require('commonJs.js');
    // 这里的commonJs相当于加载commonJs文件模块，加载其所有的方法，然后生成一个对象，所以commonJs必须要再运行时才能得到这个对象，也被称为运行时加载。
```

而es6的模块设计是让一切尽量静态化，这样可以在静态编译期间就可以确定依赖关系，确定模块的输出和输入，这样可以带来很多做优化，比如tree shaking等，在编译期间确定模块依赖关系，就可以进行DCE（dead code elimination）等处理。

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

```js
    // util.js;
    // 方式1
    const a = 1;
    const b = 2;
    export {
        a,b
    }
    //方式2；
    export const a = 1;
    export const b = 2;
    
    // test.js
    import {a,b} from './util.js';
    console.log(a, b); // 1 2,
```

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
