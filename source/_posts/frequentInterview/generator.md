Generator

generator是一种异步编程的解决方案。正常一个函数执行完会返回一个值，而generator则像一个状态积，调用generator会返回一个迭代器，执行该迭代器会执行该迭代器的代码，然后遇到yield返回下一个状态，所以每次迭代器执行next都能得到其值，这就是生成器的由来。
直接调用generator函数不会执行函数，而是会返回迭代器对象
## 特点
    1. 声明时需要"*"
    2. 内部有yield，根据yield来定义不通的状态以及下一个迭代器的指针位置
    3. yield只有在生成器中才能使用，其他地方直接报错

```js
    function* fn() {
        ...
        yield 'val'
        ...
    }
    let pointer = fn() //直接调用不会执行，而是返回遍历器
    pointer.next() // 通过遍历器的next方法执行当前的代码直到下一个yield状态
```

## yield 注意点
1. 每次next调用都可以穿入参数，作为yield的返回值，因此可以通过外部传入参数改变内部的运行策略
```js
    function* fn(val) {
        let x = yield val + 3
        return x
    }
    let a = fn(5)
    console.log(a.next())  // 8
    console.log(a.next(1)) // 1

```

## 迭代器和生成器
1. for...of ,... 可以自动遍历generator生成的遍历器对象
[Symbol.iterator]会返回遍历器的生成函数，而generator就是一个遍历器生成函数，所以直接用generator就可以快捷的设置遍历器，从而使该对象拥有遍历能力

### throw
generator遍历器除了next还有throw方法，外部通过遍历器throw的错能在生成器内部捕获
```js
    function* test() {
        try {
            yield 'go'
        } catch (e) {
            console.log('内部捕获e---',e)
        }
    }
    let fn = test()
    fn.next() // 一定要先进入try...catch
    fn.throw('c') // 内部捕获e--- c

```

### yield *
任何拥有iterator接口的对象以及生成器都可以通过yield * 进行遍历
```js
    function* a() {
        yield 1
        yield 2
        yield 3
        yield 4
    }
    for (let val of a()) {
        console.log(val)
    }
    // 而且生成器内提供了更简单的遍历方式，但是只能在生成器内使用，本质就是上面的一个语法糖
    function* b() {
        yield *a()
    }
    
```