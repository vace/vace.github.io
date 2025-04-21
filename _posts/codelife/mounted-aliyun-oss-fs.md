---
title: "在阿里云ECS上挂载OSS文件系统"
date: 2022-11-30
summary: "详解如何在阿里云ECS服务器上安装并配置ossfs工具，实现将OSS对象存储挂载为本地文件系统，包括安装、配置、挂载与开机自动加载的完整步骤。"
tags: [OSS, Linux, Cloud]
---

## ossfs 简介与安装

[ossfs](https://github.com/aliyun/ossfs) 是阿里云开源的工具，可以将OSS对象存储挂载到本地文件系统，实现像操作本地文件一样操作OSS文件。

### 安装依赖包

```sh
yum install -y automake gcc-c++ git libcurl-devel libxml2-devel fuse-devel make openssl-devel
```

### 下载源码并编译

```sh
git clone https://github.com/aliyun/ossfs.git
cd ossfs
./autogen.sh
./configure
make && make install
```

## 配置阿里云OSS秘钥

将OSS的访问密钥配置到系统中，支持配置多个bucket，每行一个：

```sh
echo bucket-name:AK:SK > /etc/passwd-ossfs     
chmod 640 /etc/passwd-ossfs
```

配置说明：
- `bucket-name`: OSS存储空间名称
- `AK`: AccessKey ID
- `SK`: AccessKey Secret

![](https://h5.ahmq.net/res/mweb/2025-04/21_17452371452793.jpg?x-oss-process=style/mweb-image)

## 挂载OSS存储空间

### 基本挂载命令

命令格式：`ossfs [Bucket空间名] [挂载路径] -ourl=[OSS EndPoint]`

```sh
ossfs h5-app /cdn -ourl=http://oss-cn-hangzhou-internal.aliyuncs.com
```

<Callout type="info">
如果使用ossfs的机器是阿里云ECS服务器，建议使用内网域名（internal）来避免产生额外的流量费用并获得更快的访问速度。
</Callout>

### 卸载OSS存储空间

```sh
umount /cdn
```

## 设置开机自动挂载

为确保系统重启后自动挂载OSS，在 `/etc/rc.local` 文件中添加以下命令：

```sh
ossfs h5-app /cdn -ourl=http://oss-cn-hangzhou-internal.aliyuncs.com -o allow_other
```

<Callout type="warning">
此方式比修改`/etc/fstab`更安全，避免因挂载失败导致系统无法正常启动。添加`-o allow_other`参数允许非root用户操作挂载的OSS目录。
</Callout>