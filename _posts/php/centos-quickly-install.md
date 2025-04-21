---
title: "CentOS 7服务器快速安装PHP 7.3备忘录"
date: 2022-01-21
summary: "本文提供在CentOS 7服务器上安装PHP 7.3环境的详细步骤，包括配置Remi仓库、安装PHP及常用扩展的命令，适用于需要快速部署LAMP或LEMP环境的开发者。"
tags: [PHP, CentOS, Linux, DevOps]
---

## 配置Remi源仓库

首先需要安装EPEL发布包和yum工具，然后添加Remi仓库：

```sh
yum install epel-release yum-utils
sudo yum install http://rpms.remirepo.net/enterprise/remi-release-7.rpm
```

## 启用PHP 7.3 Remi仓库

在CentOS 7中安装PHP 7.3，需要先启用对应版本的Remi仓库：

```sh
sudo yum-config-manager --enable remi-php73
```

## 安装PHP 7.3和常用扩展

执行以下命令安装PHP 7.3及其常用扩展模块：

```sh
sudo yum install php php-common php-opcache php-mcrypt php-cli php-gd php-curl php-mysqlnd
```

<Callout type="info">
并非所有PHP扩展都可通过yum安装。Remi仓库提供了大多数常用扩展，但某些特殊扩展可能需要手动编译安装。
</Callout>

## 安装其他常用PHP扩展

根据项目需要，可以选择性安装其他常用扩展：

```sh
# 安装MySQL和GD库支持
sudo yum install php-mysql php-gd

# 安装更多功能扩展
sudo yum install php-xml php-soap php-xmlrpc php-mbstring php-json php-pecl-redis php-fpm
```

## 验证安装结果

安装完成后，可以通过以下命令验证PHP版本和已安装的扩展：

```sh
php -v
php -m
```

## 配置PHP-FPM（可选）

如果您需要使用PHP-FPM与Nginx配合：

```sh
# 启动PHP-FPM服务
sudo systemctl start php-fpm
sudo systemctl enable php-fpm

# 检查状态
sudo systemctl status php-fpm
```

![PHP安装成功界面](https://h5.ahmq.net/res/mweb/2025-04/21_17452368681971.jpg?x-oss-process=style/mweb-image)
