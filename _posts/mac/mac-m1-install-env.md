---
title: "MAC M1 安装各种开发环境指北"
date: 2021-11-12
summary: "详细记录Mac M1芯片设备上安装各类开发环境的步骤与注意事项，包括环境变量配置、包管理工具及常用开发语言的安装方法。"
tags: [MacOS, 工具]
---

# MAC M1 安装开发环境指北

拿到新电脑了，开始倒腾必须的开发资源安装，记录一下M1芯片Mac安装各种开发环境的过程和注意事项。

## 环境变量设置问题

MAC的命令终端可以通过`.bash_profile`或者`.zshrc`设置环境变量，两者的区别在于`.zshrc`开机自动生效，而`.bash_profile`需要使用`source ~/.bash_profile`使其生效，也可以在`.zshrc`中加一行`source ~/.bash_profile`来自动加载。

![设置环境变量-w500](https://h5.ahmq.net/res/hosting/2022-02-22/16378172521078.jpg)

> **⚠️ 注意**：`.zshrc`不是手动创建，如果没有这个文件，需要先安装`oh-my-zsh`

## Xcode

> Mac 拥有自己的开发环境 Xcode，它包含大部分在 CMake 过程中需要的东西。

建议直接在App Store安装。Xcode提供了大量开发工具和SDK，是Mac开发环境的基础组件。

### 实现原理

Xcode安装后会自动配置多种开发工具，包括编译器、调试工具和Command Line Tools，为后续安装其他开发环境提供基础支持。

## Homebrew

> 在Mac上使用`brew`安装软件十分方便，是Mac平台的包管理神器。安装brew时可能需要科学上网。

```sh
# 安装Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 常用命令

- `brew list` - 查看已安装包列表
- `brew uninstall pkgname` - 卸载安装包
- `brew cleanup [可选pkgname]` - 清理软件的旧版本
- `brew update` - 更新Homebrew自身
- `brew upgrade` - 更新所有安装的包

### 最佳实践

对于M1芯片的Mac，Homebrew默认安装在`/opt/homebrew/`目录，与Intel芯片的`/usr/local/`不同，安装后建议将路径添加到环境变量：

```sh
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
```

**参考资源**
- [清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/)
- [Homebrew/Linuxbrew 镜像使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)
- [程序员 Homebrew 使用指北](https://sspai.com/post/56009)
- [brew.sh](https://brew.sh/index_zh-cn)

## oh-my-zsh

> 强大的zsh配置管理工具，提供丰富的主题和插件

```sh
# 使用curl下载安装
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# 或使用wget安装
sh -c "$(wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

### 最佳实践

安装完成后，可以通过编辑`~/.zshrc`文件自定义主题和加载插件：

```sh
# 设置主题
ZSH_THEME="robbyrussell"

# 加载插件
plugins=(git docker node npm)
```

**参考资源**
- [ohmyz.sh 官网](https://ohmyz.sh/#install)
- [文档wiki](https://github.com/ohmyzsh/ohmyzsh/wiki)

## Python3

> 系统自带的Python是古老的2.x版本，2020年已停止更新，建议安装Python3

```sh
# 安装Python3
brew install python3

# 查看版本
/opt/homebrew/bin/python3 --version # 安装成功 Python 3.9.9

# 设置别名
echo 'alias python="/opt/homebrew/bin/python3"' >> ~/.bash_profile
```

### 实现原理

Homebrew安装的Python3会被放置在`/opt/homebrew/bin/`目录下，与系统自带的Python分开管理，通过别名可以默认使用Python3。

## pip

> pip 是Python的包管理工具，用于安装和管理Python包，是easy_install的替代品

```sh
# 安装pip
curl https://bootstrap.pypa.io/get-pip.py | python
```

### 最佳实践

配置pip国内镜像源可以加速包的下载：

```sh
mkdir -p ~/.pip
echo '[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple' > ~/.pip/pip.conf
```

## ffmpeg

> 强大的音视频处理工具，M1芯片上安装需注意架构兼容性

```sh
# 使用Homebrew安装
brew install ffmpeg
```

### 实现原理

M1芯片上的ffmpeg使用ARM架构编译，相比x86版本在某些音视频处理任务上性能更优，但可能存在部分库兼容性问题。

**参考资源**
- [官网下载二进制包](http://www.ffmpeg.org/download.html#build-mac)

## git

> 版本控制工具，Xcode安装后可能已经自带

```sh
# 检查是否已安装
git --version  # 我的系统显示 git version 2.30.1 (Apple Git-130)

# 如需更新或重新安装
brew install git
brew install git-gui  # 可选GUI
```

### 最佳实践

初次设置git的用户信息：

```sh
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## nvm

> Node.js版本管理工具，便于在不同项目间切换Node版本

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### 实现原理

nvm通过修改PATH环境变量来切换不同版本的Node.js，使多版本共存且互不干扰。

## Node.js/npm

> 使用nvm安装Node.js，可同时安装多个版本

```sh
# 安装LTS版本的Node.js
nvm install 16.13.0 

# 切换使用指定版本
nvm use 16.13.0 

# 验证安装结果
node -v
npm -v
```

### 最佳实践

设置npm国内镜像源加速包下载：

```sh
npm config set registry https://registry.npmmirror.com
```

## yarn

> Facebook开发的依赖包管理工具，比npm更快、更可靠

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

### 实现原理

yarn通过并行下载和缓存机制提高了包安装速度，同时使用锁文件确保安装依赖的一致性。

## OpenCV

> 强大的计算机视觉库，在M1上安装需注意ARM架构兼容性

```sh
# 安装最新版OpenCV
brew install opencv

# 安装指定版本
brew install opencv@3  # 安装OpenCV3
brew install opencv@2  # 安装OpenCV2
```

### 安装位置及结构

- 本体：`/usr/local/Cellar` 或 M1芯片上 `/opt/homebrew/Cellar`
- 头文件：`/usr/local/include` 或 `/opt/homebrew/include`
- 库文件：`/usr/local/lib` 或 `/opt/homebrew/lib`
- cmake module：`/usr/local/share` 或 `/opt/homebrew/share`
- 二进制文件：`/usr/local/bin` 或 `/opt/homebrew/bin`，包含自带的Demo
- 符号链接：`/usr/local/opt` 或 `/opt/homebrew/opt`

## PHP

> 主要用于Web开发的脚本语言

```sh
# 安装PHP 7.4
brew install php@7.4

# 设置环境变量
echo 'export PATH="/opt/homebrew/opt/php@7.4/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/php@7.4/sbin:$PATH"' >> ~/.zshrc
```

**参考资源**
- [PHP brew版本查询](https://formulae.brew.sh/formula/php)

## Golang

> Google开发的编程语言，以高效的并发处理著称

```sh
# 安装Go语言
brew install go

# 安装完成后查看版本
go version
```

### 最佳实践

设置GOPATH环境变量：

```sh
echo 'export GOPATH=$HOME/go' >> ~/.zshrc
echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.zshrc
```

## TypeScript

> JavaScript的超集，添加了类型系统

```sh
# 使用Homebrew安装
brew install typescript

# 或使用npm全局安装
npm install -g typescript
```

### 实现原理

TypeScript编译器将TypeScript代码转换为JavaScript代码，使开发人员能够利用类型系统进行更可靠的开发。

**参考资源**
- [brew ts](https://formulae.brew.sh/formula/typescript)
- [ts官网](https://www.typescriptlang.org/)

## wget

> 强大的命令行下载工具，支持断点续传和递归下载

```sh
brew install wget
```

### 最佳实践

使用wget镜像整个网站：

```sh
wget -r -np -k http://example.com/
```

**参考资源**
- [使用文档](https://www.gnu.org/software/wget/manual/wget.html)
- [GNU Wget](https://www.gnu.org/software/wget/)
