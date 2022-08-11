---
title: 字典树
date: 2020-06-22 14:53:00
tags: 算法
categories:
    - [算法]
    - [字典树]
    - [字符串]
    - [前缀树]
---
# 字典树
字典树也可称为前缀树用于满足构造字符串字典，可以用于统计字典树中是否有某些字符串构造或者出现频率，是否存在某些前缀下的字符串，自动补全等。
我们期待的查询字典方式如下，比如app，那么我们会先去字典中查a开头的，如a命中则继续往下看a的后缀中是否包含p，如此类推，直到完成整个字符串命中或者退出。
![](https://raw.githubusercontent.com/kankanbujian/image_host/main/dist.gif)

## 数据结构
很显然我们希望能有一个树结构，每个当前命中的元素，他的下一个可能的字典元素又可能是所有的字典原子集，对于纯英文单词的话则可以用26位的数组来存储new Array(26), 存储内容需要能够存储当前字典原子的值：currentWord.charCodeAt() - 'a'.charCodeAt()，并且还有下一个后缀集合。
因此很自然我们可以想到用链表结构来表示，这种字典树的基本链表节点称为TrieNode
```js
    function TrieNode {
        this.nextTrie = new Array[26] // 用于存储当前字典的原子占用情况
        this.count = 0 // 用于存储当前字符串命中次数
    }
```

### 通用模版
```js
    // insert
    funtion insert(str) {
        let node = this.nextTrie
        const n = str.length
        for (let i  = 0 ; i < ; i++ ) {
            let val = str[i].charCodeAt() - 'a'.charCodeAt()
            if (!node[val]) {
                node[val] = new TrieNode()
            }
            node = node[val]
        }
        node.count = 1
    }
    //  search
    function search(str) {
        let node = this.nextTrie
        const n = str.length
        for (let i  = 0 ; i < ; i++ ) {
            let val = str[i].charCodeAt() - 'a'.charCodeAt()
            if (!node[val]) return false
            node = node[val]
        }
        return node.count > 0
    }
    // prefix
    function startWith(prefix) {
        let node = this.nextTrie
        const n = str.length
        for (let i  = 0 ; i < ; i++ ) {
            let val = str[i].charCodeAt() - 'a'.charCodeAt()
            if (!node[val]) return false
            node = node[val]
        }
        return true
    }
```

#### tips
若字符串比较复杂，则直接将TrieNode中的可选字典原子结构换成map即可

