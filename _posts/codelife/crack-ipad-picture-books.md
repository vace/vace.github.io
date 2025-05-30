---
date: 2021-11-17
title: 记一次绘本类 iPad 应用的技术分析过程
summary: 记录了对某款绘本类 iPad 应用的在线授权机制进行分析的过程，包括抓包、接口劫持和资源重构等技术细节。
tags: [iOS, 抓包, 逆向]
---

## 背景

在分析某款绘本类 iPad 应用时，发现其服务模式为在线授权机制，即便在会员阶段购买的内容已下载到本地，但是在会员状态失效后仍会限制阅读权限。出于技术研究目的，尝试分析其数据请求与授权逻辑。

## 抓包准备

1. 使用 `Charles` 作为抓包工具。

   ![抓包工具界面](https://h5.ahmq.net/res/hosting/20211117004640-2021-11-17.png)

2. 在 iPad 上配置代理及导入根证书。遇到证书写入失败的问题后，将证书以 `.cer` 格式导出，通过浏览器导入成功。

3. 成功配置代理后，开启应用进行抓包。

   ![网络抓包](https://h5.ahmq.net/res/hosting/20211117005557-2021-11-17.png)

在抓包过程中，观察到接口返回的 `vip_status` 和 `expire_time` 字段可用于判断用户状态及到期时间。

## 接口劫持尝试

尝试建立自定义中间服务，拦截并修改接口返回的会员状态字段，伪造尚在有效期的授权信息：

- 修改响应中的 `vip_status` 为有效状态
- 替换 `expire_time` 为未来时间

   ![劫持接口返回数据](https://h5.ahmq.net/res/hosting/20211117005821-2021-11-17.png)

尽管数据被成功篡改，但客户端未表现出预期效果。推测应用内部可能对授权状态进行了本地校验或加密比对。

   ![可疑加密字段](https://h5.ahmq.net/res/hosting/20211117010312-2021-11-17.png)

返回数据中包含 `_s` 字段，疑似加密数据块，可能作为授权校验的对照依据，尝试多种解密方式均未成功。

## 替代方案探索

### 方案 2：绘本内容接口替换

观察到部分内容为免费资源，尝试劫持内容接口，将收费资源替换为免费资源结构。虽然部分页面显示正常，但阅读过程中仍会验证会员状态，导致阅读中断。

   ![尝试替换内容资源](https://h5.ahmq.net/res/hosting/20211117010602-2021-11-17.png)

### 方案 3：离线资源重构

分析下载资源结构，发现绘本为 ZIP 包，内部为 Cocos 项目格式，包含图像、音频及动画信息。

   ![资源包结构](https://h5.ahmq.net/res/hosting/20211117010949-2021-11-17.png)

资源包中存在加密机制，运行绘本需较高成本的逆向或重新构建阅读器，因此未继续深入。

### 方案 4：时间机制模拟

进一步抓包时，注意到应用会请求服务器时间接口以校验授权有效性。由此联想到通过修改设备时间模拟在有效期内的状态：

   ![时间接口数据](https://h5.ahmq.net/res/hosting/20211117011337-2021-11-17.png)

实验将系统时间回拨至会员到期前，客户端识别为有效状态，读取功能恢复。

## 自动化处理

为简化操作流程，构建了本地 `hosts` 配置，拦截时间接口并返回伪造时间值。同时设置设备系统时间至特定日期，以实现长期本地离线可读的效果。

最终效果如下：

   ![最终阅读效果](https://h5.ahmq.net/res/hosting/20211117012043-2021-11-17.png)

---

本次分析记录了一个典型移动端应用中会员机制的实现逻辑及客户端验证方式，通过抓包、接口篡改、本地资源分析和系统行为模拟等方式进行测试。研究过程中未对服务端造成干扰，仅为学习目的进行分析和验证。