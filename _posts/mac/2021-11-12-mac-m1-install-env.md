---
layout: post
title:  MAC M1 安装各种东西指北
categories: [MAC]
tags: [mac,xcode,brew]
---

拿到新电脑了，开始倒腾必须的开发资源安装，记录一下。

## 环境变量设置问题

MAC的命令终端可以通过`.bash_profile`或者`.zshrc`设置环境变量，两者的区别在与`.zshrc`开机生效，而`.bash_profile`需要使用`source ~/.bash_profile`使其生效，也可以在.zshrc中加一行`source .bash_profile`来自动加载。

![设置环境变量-w500](https://h5.ahmq.net/res/hosting/2022-02-22/16378172521078.jpg)


> **注意** `.zshrc`不是手动创建，如果没有这个文件，需要安装`oh-my-zsh`

## Xcode

> Mac 拥有自己的开发环境 Xcode，它包含大部分在 CMake 过程中需要的东西。

建议直接在appstore安装。

## brew

> 在mac上使用brew安装软件十分的方便，安装brew时需要科学上网(见终端被墙时使用代理.md)，查看国内镜像源：

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

- `brew list` 查看安装包列表
- `brew uninstall pkgname` 卸载安装包
- `brew clean [可选pagname]` 清理软件的旧版
- 

**参考**
- [清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/)
- [Homebrew/Linuxbrew 镜像使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)
- [程序员 Homebrew 使用指北](https://sspai.com/post/56009)
- [brew.sh](https://brew.sh/index_zh-cn)

## oh-my-zsh

> 可以使用 curl 或 wget 通过命令行安装它。

```sh
# 使用curl下载
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# 使用wget安装
sh -c "$(wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

- [ohmyz.sh 官网](https://ohmyz.sh/#install)
- [文档wiki](https://github.com/ohmyzsh/ohmyzsh/wiki)

## python3

> 系统自动的python是古老的2.x版本，2020年停止更新

```sh
brew install python3
/opt/homebrew/bin/python3 --version # 安装成功 Python 3.9.9
vim ~/.bash_profile # 设置别名
alias python="/opt/homebrew/bin/python3"
```

## pip

> pip 是一个安装和管理 Python 包的工具，安装完成python后，可以用python安装pip，注：pip是easy_install的替代品（建议使用代理）

```sh
curl https://bootstrap.pypa.io/get-pip.py | python
```

## ffmpeg

> 系统默认是没有这个的，可以用brew安装，或者下载二进制包，二进制包下载更方便。（建议使用代理）

```sh
brew install ffmpeg
```

- [官网下载二进制包](http://www.ffmpeg.org/download.html#build-mac)

## git

> 我的系统已经默认安装了`git version 2.30.1 (Apple Git-130)`，安装xcode时可能已经安装了。

```sh
brew install git
brew install git-gui #可选GUI
```

## nvm

> nodejs 得最佳管理工具。

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

## nodejs/npm

> 这里只写使用nvm安装，后面的版本号可以自定义，也可同时安装多个。

```sh
nvm 16.13.0 # 安装nodejs@16.13.0 LTS
nvm use 16.13.0 # 使用nodejs@16.13.0

# 安装并使用完成
node -v
npm -v
```

## yarn

> Yarn是Facebook最近发布的一款依赖包安装工具。

```sh
# 方案1：使用脚本安装
curl -o- -L https://yarnpkg.com/install.sh | bash  
# 方案2：使用brew安装
brew install yarn
# 方案3：使用npm安装
npm install -g yarn
# 安装完成测试
yarn --version 
```

## opencv

> 计算机视觉

```sh
brew install opencv
# 如果要安装其它版本，如 OpenCV3、OpenCV2，则 使用如下命令
brew install opencv@3
brew install opencv@2
```

安装后的位置：
* 本体：/usr/local/Cellar
* 头文件：/usr/local/include
* 库文件：/usr/local/lib
* cmake module：/usr/local/share
* 二进制文件：/usr/local/bin，只是自带的几个Demo
* 符号链接： /usr/local/opt，不知道干啥用的

## php

> 我用的php7比较多，

```sh
brew install php@7.4
```

- [PHP brew版本查询](https://formulae.brew.sh/formula/php)

## golang

```sh
brew install go
# 安装完成后查看版本
go version
```

## typescript

> 最新的v4需要nodejs17以及以上。

```sh
brew install typescript
```

**参考**
- [brew ts](https://formulae.brew.sh/formula/typescript)
- [ts官网](https://www.typescriptlang.org/)

## wget

> 很强大的检索下载软件，比如下载整个网站（支持文件名通配符或者递归镜像目录）

```sh
brew install wget
```

**参考**
- [使用文档](https://www.gnu.org/software/wget/manual/wget.html)
- [GUN Wget](https://www.gnu.org/software/wget/)
