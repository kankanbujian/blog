---
title: decorator
date: 2020-11-25 18:51:31
tags: ['es', 'js']
categories: 
    ['es']
    ['js']
---
# decorator---装饰器

装饰器的本质是相当于一个高阶函数使用了装饰器设计模式来给我们希望的类新增对象的行为。

```
    function addAgeProperty(target) {
        target.age = 18;
    }

    @addAgeProperty
    class A{

    }
    console.log(A.age);
```
