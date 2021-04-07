---
title: design-mode
date: 2020-11-25 11:19:13
tags: '设计模式'
categories: '设计模式'
---

# 设计模式

## 单例

所谓单例，顾名思义，只有一个实例存在，一般用于需要维护单独实例属性的类
```
    function Single() {
        
    }
    var instance = null;
    function createSingleInstance() {
        if (!instance)  {
            instance = new Single();
        }
        return instance;
    }

    
    const singleProxy = (function() {
        var instance = null;
        return function() {
            if (!instance) intanc
        }
    })()
```