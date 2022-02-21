---
layout: post
title:  Electron 包文件asar的解压与压缩
categories: [其他]
tags: [electron,asar]
---

最近看到一个一款使用electron开发的软件，内部有些功能很酷，尝试解包看看实现原理。

## 安装

全局安装asar

```sh
yarn global add asar
```

```sh
# 打包asar文件
asar pack ./app ./dist
# 查看asar文件目录
asar list ./app.asar
# 解压单个文件
asar extract-file app.asar index.js
# 解压整个asar归档
asar extract app.asar ./dest
```

## 实践

![](https://h5.ahmq.net/res/hosting/2022-02-22/16380165283116.jpg)

这两个目录提取出来，单独解压。

![](https://h5.ahmq.net/res/hosting/2022-02-22/16380166714545.jpg)


