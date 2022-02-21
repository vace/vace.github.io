---
layout: post
title:  Mac上使用Charles抓包
categories: [MAC]
tags: [mac,Charles]
---


## Charles客户端配置
安装好Charles后，在菜单栏勾选『Proxy -> macOS Proxy』，macOS系统HTTP/HTTPS代理将会被自动设置为本地代理，默认端口8888。

![](https://h5.ahmq.net/res/hosting/2022-02-22/16380184425869.jpg)


系统偏好设置 - 网络 - 高级

![代理已设置完毕](https://h5.ahmq.net/res/hosting/2022-02-22/16380186318616.jpg)


访问HTTP数据链接，可以开始抓取HTTP包。

TODO

不写了，太简单了。

## 注意点

- 关闭v/p/n或者其他代理软件
- 需要安装根证书并添加到信任列表
- 移动端也是需要安装根证书的
