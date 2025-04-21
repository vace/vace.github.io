---
title: "Mac上使用Charles抓包"
date: 2021-12-01
summary: "详解如何在Mac系统中配置Charles进行HTTP/HTTPS抓包，包括客户端配置、证书安装、移动设备连接和抓包原理，以及HTTP与HTTPS抓包的区别。"
tags: [Charles, 抓包, Mac]
---

## Charles简介

Charles是一款强大的HTTP代理工具，可以帮助开发者查看和分析网络请求的内容。它能够监控、捕获并显示电脑和互联网之间的所有HTTP/HTTPS通信，包括请求、响应和HTTP头信息等。

## Charles抓包原理

Charles的工作原理基于中间人（Man-in-the-Middle，MITM）代理机制：

1. Charles在本地建立一个代理服务器（默认端口8888）
2. 所有网络请求都被重定向到这个代理服务器
3. 对于HTTP请求：Charles直接捕获并转发请求和响应
4. 对于HTTPS请求：Charles通过自己的CA证书与客户端建立TLS连接，同时与服务器建立另一个TLS连接，实现"中间人"角色

> Charles能够解密HTTPS流量的关键在于客户端信任了Charles的根证书，使其能够动态生成针对不同域名的SSL证书。

## Charles客户端配置
安装好Charles后，在菜单栏勾选『Proxy -> macOS Proxy』，macOS系统HTTP/HTTPS代理将会被自动设置为本地代理，默认端口8888。

![](https://h5.ahmq.net/res/hosting/2022-02-22/16380184425869.jpg)

系统偏好设置 - 网络 - 高级

![代理已设置完毕](https://h5.ahmq.net/res/hosting/2022-02-22/16380186318616.jpg)

## HTTP与HTTPS抓包的区别

### HTTP抓包
HTTP协议的数据是明文传输的，Charles只需要作为代理服务器转发请求即可捕获全部内容：

1. 无需安装任何证书
2. 请求和响应内容直接可见
3. 配置简单，开启代理后即可使用

### HTTPS抓包
HTTPS协议使用SSL/TLS加密，抓包过程更为复杂：

1. 需要安装并信任Charles的根证书（CA证书）
2. Charles会动态生成证书与客户端通信
3. 如不安装证书，将无法查看加密内容，只能看到连接信息

## 配置HTTPS抓包

### 安装Charles根证书

1. 打开Charles，点击菜单 `Help -> SSL Proxying -> Install Charles Root Certificate`
2. 证书会自动添加到钥匙串，但默认不受信任
3. 打开钥匙串访问，找到"Charles Proxy CA"证书
4. 双击证书，展开"信任"选项，将"使用此证书时"修改为"始终信任"

### 启用SSL代理

1. 菜单栏选择 `Proxy -> SSL Proxying Settings`
2. 勾选 `Enable SSL Proxying`
3. 点击 `Add` 按钮添加要抓取的域名，或使用 `*:443` 抓取所有HTTPS流量

## 抓包移动设备

### iOS设备配置

1. 确保手机和电脑在同一WiFi网络
2. 在手机WiFi设置中手动设置代理，服务器为电脑IP地址，端口为8888
3. 访问 `chls.pro/ssl` 安装证书
4. 在iOS设备上，需要额外在 `设置 -> 通用 -> 关于本机 -> 证书信任设置` 中启用完全信任

### Android设备配置

1. 设置同一WiFi网络下的代理为电脑IP和8888端口
2. 访问 `chls.pro/ssl` 下载证书
3. 在设备的安全设置中安装证书
4. Android 7.0以上版本需要额外配置，可能需要root权限

## 常用功能

### 过滤请求

使用 `Filter` 功能过滤特定域名或内容：
- `⌘+F` 快速搜索
- 右键选择 `Focus` 专注于特定域名
- 使用工具栏的过滤器按钮

### 模拟网络环境

通过 `Proxy -> Throttle Settings` 可以模拟各种网络环境：
- 3G/4G网络
- 弱网络
- 自定义带宽和延迟

### 修改请求/响应

通过 `Tools -> Rewrite` 可以设置规则修改请求头、URL参数或响应内容。

## 注意点

- ⚠️ 关闭v/p/n或者其他代理软件，避免代理冲突
- ⚠️ 需要安装根证书并添加到信任列表，否则HTTPS流量无法解密
- ⚠️ 移动端也是需要安装根证书的
- ⚠️ 公司电脑可能有安全策略限制证书安装
- ⚠️ 某些应用可能实现了证书锁定(SSL Pinning)，这会阻止Charles抓包

## 一些小技巧

1. 使用会话(Session)功能保存不同项目的抓包配置
2. 对大型API调试，可使用断点功能(Breakpoints)在请求发送前修改参数
3. 使用Map Local功能将远程资源映射到本地文件进行调试
4. 抓包完成后及时关闭系统代理，避免影响正常上网
5. 定期清理会话数据，防止软件变慢
