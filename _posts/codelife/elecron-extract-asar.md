---
date: 2020-07-25
title:  Electron 包文件 asar 的解压与压缩
summary: 介绍了 Electron 应用中 asar 文件的解压与压缩方法，提供了实用的命令行工具和操作步骤，适合开发者进行二次开发和分析。
tags: [Electron, 解包, 逆向]
---

最近看到一款使用 Electron 开发的软件，内部有些功能实现得非常巧妙，出于学习和研究目的，尝试解包看看其实现原理。Electron 应用大多会将主程序文件封装在一个 `.asar` 包中，这是一个类似于 tar 格式的归档文件，方便资源整合与发布，但并未加密，因此可以通过官方工具进行查看和解压。

## 安装

首先需要安装 `asar` 工具，这是 Electron 官方提供的用于打包与解包 `.asar` 文件的命令行工具。

使用 Yarn 安装（也可以用 npm）：

```sh
yarn global add asar
```

安装后可以使用以下命令对 `.asar` 文件进行各种操作：

```sh
# 将 ./app 目录打包为 asar 文件，生成 ./dist 文件
asar pack ./app ./dist

# 查看 asar 文件目录结构
asar list ./app.asar

# 解压单个文件（例如 index.js）
asar extract-file app.asar index.js

# 解压整个 asar 归档到指定目录
asar extract app.asar ./dest
```

## 实践

在实践过程中，将目标应用中的 `.asar` 文件复制出来，使用上述工具进行分析。

![](https://h5.ahmq.net/res/hosting/2022-02-22/16380165283116.jpg)

应用中主要的 `.asar` 文件通常位于安装目录下的 `resources` 文件夹内，例如 `app.asar` 或 `core.asar` 等。通过 `asar extract` 命令进行解包，可以得到一个完整的源文件目录结构。

解压后结构如图：

![](https://h5.ahmq.net/res/hosting/2022-02-22/16380166714545.jpg)

解包后的文件结构通常包含：

- 主进程入口文件（如 `main.js`、`index.js`）
- 渲染进程使用的 HTML、JS、CSS 文件
- 配置文件和本地数据库（如 `.json`, `.sqlite`）
- 第三方依赖模块（如 `node_modules`）
- IPC 通信逻辑及业务实现代码

可以直接使用文本编辑器（如 VSCode）打开分析其实现方式。

## 修改与重新打包

如果想对某些功能进行定制化调整（仅限于合法和授权的场景），可以按照以下步骤操作：

1. 解包 `.asar` 文件至目录；
2. 修改需要的文件；
3. 使用 `asar pack` 命令重新打包为 `.asar` 文件；
4. 替换原有 `.asar` 文件（请注意备份）；
5. 重新启动应用查看效果。

```sh
asar extract app.asar ./app_unpacked
# 修改 ./app_unpacked 下的内容
asar pack ./app_unpacked ./app_modified.asar
```

## 注意事项

- `.asar` 文件本身未加密，但可能会有应用层的校验机制，如签名验证、文件校验和、运行时路径检测等；
- 某些 Electron 应用会在启动时校验 `.asar` 是否被篡改，修改后可能无法正常运行；
- 对商业软件的逆向修改需要遵循相关法律法规与许可协议，切勿将此用于未授权的行为；
- 如果只是为了学习 UI 构建逻辑、功能结构，可以只做只读分析。
