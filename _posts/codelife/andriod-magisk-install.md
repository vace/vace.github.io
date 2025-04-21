---
date: 2022-12-03
title: Android Magisk 安装指南
tags: [Android, Root, Magisk]
summary: 本指南详细介绍如何在 Android 设备上安装 Magisk 获取 Root 权限，包括配置 ADB 工具、解锁 Bootloader、打包镜像并刷入的完整流程。适用于需要深度定制 Android 系统、安装模块、隐藏 Root 状态和避开设备检测的用户。
---

# Android Magisk 安装指南

Magisk 是一个安全、美观且功能强大的 Android 自定义工具。它主要有以下三个核心功能：

- **MagiskSU**：获取设备 Root 权限并经用户授权给应用
- **Magisk Modules**：下载、挂载与管理模块，实现系统个性化定制
- **MagiskHide**：对选定应用隐藏设备 Root 状态和 Magisk 自身的存在

## 安装步骤概览

1. 配置 ADB 和 Fastboot 工具
2. 解锁 Bootloader
3. 获取并修补 boot.img 镜像
4. 刷入修补后的镜像
5. 验证安装结果

## 配置 ADB 和 Fastboot

我使用的 macOS 系统，安装完 Android Studio 后自动安装了 `adb` 和 `fastboot`

![ADB工具安装](https://h5.ahmq.net/res/mweb/2025-04/21_17452372683134.jpg?x-oss-process=style/mweb-image)

也可以通过 `brew` 直接安装：`brew install android-platform-tools`

此时，连接设备到电脑，打开终端，输入 `adb devices`，如果返回了设备名称，说明 ADB 配置完成；用 `adb reboot bootloader` 进入 fastboot 界面，键入 `fastboot reboot` 后，若设备重启，说明 fastboot 正常。

![ADB设备连接](https://h5.ahmq.net/res/mweb/2025-04/21_17452372683157.jpg?x-oss-process=style/mweb-image)

## 解锁 Bootloader

不解锁 bootloader 则无法对设备进行底层的自定义。我使用的是小米红米手机，可以在这里申请解锁：[解锁小米手机](https://www.miui.com/unlock/index.html)

其他品牌手机请查阅对应的官方解锁教程。

## 打包镜像并刷入

### 安装 Magisk App 并检查 Ramdisk

在刷入前，先安装 Magisk App 来检查设备信息，确定进一步的操作步骤。首先从[官方项目地址](https://github.com/topjohnwu/Magisk/releases)下载最新的 APK 文件并安装。

![Magisk应用界面](https://h5.ahmq.net/res/mweb/2025-04/21_17452372683166.jpg?x-oss-process=style/mweb-image)

打开安装后的 Magisk App，查看 Ramdisk 的值。请确保此项的值为「是」或「True」，然后再进行下一步。

### 获取 boot.img

boot.img 镜像一般可以从当前使用的 ROM 的压缩包中提取。

![ROM包内容](https://h5.ahmq.net/res/mweb/2025-04/21_17452372683182.jpg?x-oss-process=style/mweb-image)

![提取boot.img](https://h5.ahmq.net/res/mweb/2025-04/21_17452372683208.jpg?x-oss-process=style/mweb-image)

### 使用 Magisk App 修补镜像

上一步我们获得了 boot.img，并将它复制到手机上。下面我们将用 Magisk App 修改这些镜像。如果你下载的是别人修改好的镜像，可以直接跳过这一步。

> 截图命令：`adb exec-out screencap -p > a-1.png`

打开手机 Magisk 应用 > 安装 > 选择并修补一个文件 > 选择复制进去的 boot.img > 开始。等待滚动的命令行显示 All Done。

![修补镜像](https://h5.ahmq.net/res/mweb/2025-04/21_17452372683230.jpg?x-oss-process=style/mweb-image)

下载修改后的启动镜像到电脑，这里我使用 adb pull：

```bash
adb shell ls /sdcard/Download/
adb pull /sdcard/Download/magisk_patched-25200_OfTSj.img
```

![拉取修补后的镜像](https://h5.ahmq.net/res/mweb/2025-04/21_17452372683240.jpg?x-oss-process=style/mweb-image)

### 使用 fastboot 刷入镜像

复制修改镜像后的完整路径，在终端中执行：

```bash
# 手机重启到 bootloader
adb reboot bootloader 
# 如果 Ramdisk 为 yes，执行以下命令
fastboot flash boot <修改后的boot.img路径> 
# 刷入完成后重启
fastboot reboot
```

![刷入镜像](https://h5.ahmq.net/res/mweb/2025-04/21_17452372683253.jpg?x-oss-process=style/mweb-image)

## 验证安装

再次打开 Magisk App，查看是否能获取到 Magisk 的版本信息。

通过 `adb shell` 进入 Linux 命令行，如果提示符是 `#` 则代表已获取 root 权限，如果是 `$` 则表示没有 root 权限。

![验证Magisk安装](https://h5.ahmq.net/res/mweb/2025-04/21_17452372683263.jpg?x-oss-process=style/mweb-image)

![获取Root权限](https://h5.ahmq.net/res/mweb/2025-04/21_17452372683271.jpg?x-oss-process=style/mweb-image)

## 相关文章

- [Android 7.0+ HTTPS 抓包方案](/blog/andriod7-trust-user-certs)

## 参考资料

- [Magisk 官方项目地址](https://github.com/topjohnwu/Magisk)
- [Magisk 官方论坛](https://forum.xda-developers.com/f/magisk.5903/)
- [Magisk 官方教程](https://topjohnwu.github.io/Magisk/)
- [Magisk 常见问题](https://www.didgeridoohan.com/magisk/HomePage)
- [少数派：Android 玩家必备神器入门：从零开始安装 Magisk](https://sspai.com/post/67932)
- [CSDN: Android adb 判断是否有root权限](https://blog.csdn.net/ezconn/article/details/85708000)

