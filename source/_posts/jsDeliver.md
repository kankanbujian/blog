---
title: jsDeliver 
date: 2020-11-01 16:20:46
tags: [blog, cdn]
categories:
    - [blog]
    - [cdn]
---
# 本文主要用于了解CDN，如果以及使用jsDeliver实现免费的CDN。
本文很多东西参考自Simon大佬写的一篇文章，有兴趣想对CDN的深入了解可以看看 [也许是史上最全的一次CDN详解](https://zhuanlan.zhihu.com/p/28940451)

## 什么是CDN
CDN，也就是content deliver network，故名意思，内容分发网络。一般而言我们将如果资源部署到一个服务器上，全球世界各地的用户想要该服务器上的资源，则可能会因为网络分布、贷款、服务器性能等原因访问失败。
CDN会使用部署在各地的服务器，实时的根据当地的网络流量、各节点连接状况、负载情况、用户的距离、访问时间等来将用户调度离其最近最快的服务节点，从而提高命中率，降低网络拥堵。
比如我的blog就部署在github上，图床也是用github搭建，那么国内访问就会很慢，所以需要使用CDN来加速我们的网络资源访问。

## CDN运行方式
> 1. 用户输入访问url，本地DNS解析，将该url对应的的CDN专用的DNS服务器告诉用户本地DNS。
> 2. 用户本地DNS服务器访问CDN专用DNS服务器，DNS返回本地服务器CDN的根负载均衡服务器(SLB)。
> 3. 用户访问CDN的根SLB， 根SBL根据用户的IP和其所要访问的资源，返回一个该用户所属的域SLB。
> 4. 用户访问该域SLB，域SLB根据用户所在的网络情况、各服务器当前连接数、哪台服务器有当前请求资源等进行均衡运算，返回一个缓存服务器的ip地址为该用户进行服务。
> 5. 用户访问该缓存服务器ip，如果缓存服务器上有用户要访问的资源，则响应用户；否则继续访问上一级的缓存服务器，不停循环，直到访问到源服务器，获取到响应内容。

DNS的解析图不清楚可以回顾下图
![](https://images2015.cnblogs.com/blog/464291/201707/464291-20170703113844956-354755333.jpg)

## 如果通过jsDeliver建立免费的CDN
当然有很多CDN服务商，其中有免费的和付费的。我用CDN的初衷很简单，就是加速本站blog的加载速度，所以使用了jsDeliver作为CDN加持我们的网络加载速度。使用方式很简单，网上也有很多的教程，这里就直接展示如何对github上的内容使用jsDeliver来引用资源，从而使用CDN来加速我们的资源请求。话不多说，直接看疗效

* jsDeliver引用方式：<https://cdn.jsdelivr.net/gh/${github名}/${仓库地址}${branch名或者发布的版本号}/${具体资源路径}>
* 比如原始url为：<https://raw.githubusercontent.com/kankanbujian/image_host/1.0/6ccd3e8d8aa3713d0bfd7e898293f62a-md_check_style-55278c.png>
* 使用CDN的url为：<https://cdn.jsdelivr.net/gh/kankanbujian/image_host@main/6ccd3e8d8aa3713d0bfd7e898293f62a-md_check_style-55278c.png>

