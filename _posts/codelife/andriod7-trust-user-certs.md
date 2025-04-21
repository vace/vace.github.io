---
date: 2022-12-04
title: Android 7.0+ HTTPS 抓包方案
tags: [Android, HTTPS, 抓包, Magisk]
summary: 从 Android 7.0 开始，系统不再默认信任用户安装的证书，导致无法进行 HTTPS 抓包。本文介绍如何通过 Magisk 框架安装 AlwaysTrustUserCerts 模块，将用户证书提升为系统证书，从而使 Charles、Fiddler 等抓包工具能够正常捕获加密流量。文章还解释了证书类型区别及其他可选解决方案。
---

# Android 7.0+ HTTPS 抓包方案

从 Android 7.0 开始，Google 增强了系统安全性，默认不再信任用户安装的证书，这导致了无法正常进行 HTTPS 抓包。本文介绍如何解决这个问题，让 HTTPS 抓包工具（如 Charles, Fiddler, mitmproxy 等）重新工作起来。

## 问题背景

在 Android 7.0 之前，我们只需安装抓包工具的证书到设备上，就能轻松抓取 HTTPS 流量。但 7.0 后，系统将证书分为两类：

1. **系统证书**：安装在 `/system/etc/security/cacerts/` 目录下的证书
2. **用户证书**：安装在 `/data/misc/user/0/cacerts-added/` 目录下的证书

默认情况下，应用只信任系统证书，而用户安装的证书被归类为用户证书，导致大部分应用的 HTTPS 流量无法被抓取。

![证书存储区](https://h5.ahmq.net/res/mweb/2025-04/21_17452372047256.jpg?x-oss-process=style/mweb-image)

## 解决方案

想要在 Android 7.0+ 设备上成功抓包，我们需要将用户证书添加到系统信任证书中。为此，我们需要:

1. 获取 Root 权限（通过 Magisk）
2. 安装 AlwaysTrustUserCerts 模块

### 先决条件：安装 Magisk

要完成操作，首先需要在设备上安装 Magisk 获取 Root 权限。详细步骤请参考我的另一篇文章：[Android Magisk 安装指南](/blog/andriod-magisk-install)

### 安装 AlwaysTrustUserCerts 模块

1. **下载模块**：从 [GitHub Releases](https://github.com/NVISOsecurity/MagiskTrustUserCerts/releases) 下载最新的 AlwaysTrustUserCerts.zip 文件

2. **传输文件到设备**：使用 adb 命令将插件发送到手机
   ```bash
   adb push ./AlwaysTrustUserCerts.zip /sdcard/Download/
   ```

3. **通过 Magisk 安装模块**：
   - 打开 Magisk 应用
   - 点击底部菜单中的"模块"选项卡
   - 点击"从本地安装"按钮
   - 选择刚才传输的 AlwaysTrustUserCerts.zip 文件
   - 等待安装完成，然后重启设备

   ![Magisk模块安装](https://h5.ahmq.net/res/mweb/2025-04/21_17452372047277.png?x-oss-process=style/mweb-image)

### 工作原理

AlwaysTrustUserCerts 模块的原理很简单，它会自动将用户安装的证书从 `/data/misc/user/0/cacerts-added/` 复制到系统证书目录 `/system/etc/security/cacerts/` 中：

```bash
cp -f /data/misc/user/0/cacerts-added/* $MODDIR/system/etc/security/cacerts/
```

### 验证证书是否生效

重启设备后，打开设备的安全设置，查看证书存储区。如果之前安装的用户证书现在显示在"系统"或"受信任的凭据"部分，则表示模块安装成功。

现在可以正常使用 Charles、Fiddler 或其他抓包工具来分析 HTTPS 流量了。

## 其他解决方案

除了使用 Magisk 模块外，还有其他方案可以解决这个问题：

1. **网络安全配置**：应用开发者可以在 AndroidManifest.xml 中添加网络安全配置，允许应用信任用户证书
2. **Xposed 框架**：使用 TrustMeAlready 等 Xposed 模块绕过证书校验
3. **修改系统文件**：直接修改系统文件（需要 Root 权限）

## 参考资料

- [Android 网络安全配置](https://developer.android.com/training/articles/security-config)
- [Android : add cert to system store](https://gist.github.com/pwlin/8a0d01e6428b7a96e2eb)
- [MagiskTrustUserCerts](https://github.com/NVISOsecurity/MagiskTrustUserCerts)
- [NVISO Blog: Easily adding custom CA certificates to Android System Trust Store](https://blog.nviso.eu/2022/01/13/easily-adding-custom-ca-certificates-to-the-android-system-trust-store/)
