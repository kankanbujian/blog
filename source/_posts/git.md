---
title: git
date: 2021-01-09 17:55:36
tags:
---

# 记录一下差用的git指令和一些骚操作

## 关于分支

查看本地分支

```git
    git branch
```

查看本地和远程所有分支

```git
    git branch -a
```

新建本地分支

```git
    // 单纯建分支
    git branch newBranchName
    // 建完分支并切到该分支上
    git branch -b newBranchName
    // 上面相当于这个
    git branch newBranchName && git checkout newBranchName
```

本地和远程分支关联

```git
    git push --set-upstream origin newBranch
```

如果不建立分支的话pull或者push都必须指定分支，否则不知道你到底要对哪个远程分支进行操作，如果关联直接使用 git pull 和 git push 指令即可。

创建空白分支

```git
    git checkout --orphan branchName
```

该分支还是包含所属分支所有代码，但是不会有任何提交和历史，所以，当前对分支的第一次提交就是当前分支的首次提交。
