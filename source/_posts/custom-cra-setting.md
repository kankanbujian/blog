---
title: 如何自定义cra配置，以及你真的需要eject么
date: 2021-01-04 17:28:03
tags: ['create-react-app', 'eject', 'react-scripts', 'react-rewired', 'custom-cra']
categories: 
    - [create-react-app]
    - [项目构建]
---

## 背景
公司的项目使用了create-react-app脚手架，为了自定义一些构建配置、环境变量、以及做一些交互式的构建流程，所以执行了cra的“npm run eject” 命令，从而将原本cra内置的配置和脚本暴露出来，在该基础上进行部分配置的修改，以及一些功能的添加（比如一些plugins，pretier等）。

当然这种方式也带来一些问题，eject是cra官方提供的脚本指令，该命令不可逆，一旦执行则会将所有的配置和脚本以及依赖暴露出来。

---
执行eject前:
![执行eject前](https://raw.githubusercontent.com/kankanbujian/image_host/main/beforeEject.jpg)

---
执行eject后:
![执行eject后](https://raw.githubusercontent.com/kankanbujian/image_host/main/afterEject.jpg)

---
## 一些问题
###  展开后通用基础配置太多，自定义配置冗杂难以排查

当前公司的应用较多、那么相当于每个项目都需要将这些展开后的上千行配置文件拷贝到各个项目里；同时各个项目会对一些环境变量、配置做一下特殊处理；并且这些处理也藏在这些文件中。所以当后面的新人想要增加、修改排查问题根本无从下手，而且团队不是每个人都对这方面感兴趣或者擅长的，那么当遇到一些构建问题的更改时，这上千行代码的稳定谁来保证呢。

###  无法快速的拥抱未来

如果cra更新后添加了一些你心动的功能，但是这些功能你自己在当前的配置里做处理可能会影响到很多地方，且项目构建的稳定性也无法保证。如果没有执行eject的话你可以直接通过更新cra的react-scripts去升级项目，比如新增了webpack升级到5.0，react升级到18等特性，你就找到对应的changelog的版本号去升级依赖来拥抱相应的功能或特性，参考[cra-关于update官方文档](https://create-react-app.dev/docs/updating-to-new-releases)

---

### 无法专注技术、自定义配置难以排查

我相信在大多数情况下，大部分的配置如babel，webpack-dev-server，样式处理、文件处理，大部分的plugins等基础配置都是相同且能满足我们项目需求的。

对于研发团队，如果使用了脚手架，那么大部分目的是开箱即用，研发人员可以专注于业务和项目以及技术框架本身，而不是为了如何引入/升级一个技术框架或修改一些配置就头痛；
当时eject后，大量本来脚手架自身维护的基础通用配置全部暴露出来，那么我们在多个项目中就需要维护多个类似的配置和脚本。而我们真正自己自定义的配置也融入其中不易维护，遇到问题也难以排查。新人面对着那么多的config和scripts脚本文件可能也无从下手。

此外开展一个额外的新项目可以快速通过脚手架就构建出一个熟悉的开发环境，而不需要对具体的使用的依赖的版本、构建的工具有太多的负担。任何开发，即使是新人，如果需要升级一些主流的并且cra拥有的技术，你要做的只需要看看cra的版本升级日志，找到感兴趣的changelog[changelog地址](https://github.com/facebook/create-react-app/blob/main/CHANGELOG.md)中希望用到的特性，然后升级到对应的版本并且使用就可以满足你的框架构建升级，剩下的就是修改你的业务代码即可。

---

## 方案
当然我们需要有对构建进行一些自定义的修改、定制、增加的能力，但是他应该是相对解耦、文件相对独立、方法相对稳定的。
关于如何修改cra配置的主流方案有以下几种
1. eject：通过执行eject命令后暴露出的配置和脚本，我们当然可以完全自定义我们的构建环境，当然会存在上述问题
2. 自定义react-scripts:
在cra中的指令是通过react-scripts实现的，我们简单看一下其文件结构，是不是觉得很熟悉！没错跟eject执行后的结构差不多，其实eject本质暴露的就是这些东西。因此我们完全可以将该仓库拉下来，针对公司自身做一下额外特殊处理，然后再发布到仓库上如xx-react-scripts，最后将本地的命令换成xx-react-script即可
![](https://raw.githubusercontent.com/kankanbujian/image_host/main/react-scripts.jpg)
3. react-app-rewired + custom-cra:
该方案需要提供一个config-overrides.js配置文件，custom-cra提供了一些方法可以对react-scripts暴露出的webpackConfig做额外的处理，同时不会影响其本身的配置。
  
[react-app-rewired传送门](https://github.com/timarney/react-app-rewired)

[customize-cra传送门](https://github.com/arackaf/customize-cra)

## 最终选择

![react-scripts的webpack方法](https://raw.githubusercontent.com/kankanbujian/image_host/main/react-app-rewired.jpg)
react-app-rewired其实类似一个自定义的react-scripts，但是他并没有提供构建的自身的构建配置，而是加载当前项目的版本的react-scripts的配置，获取后再传入到config-overrides文件去进行修改得到最终的webpack配置，这种方案即可保留react-scripts的正常配置和升级，也可以针对需要对其进行一些overrides。