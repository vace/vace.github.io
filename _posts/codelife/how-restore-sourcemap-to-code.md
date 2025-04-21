---
date: 2020-10-22
title: 从 Sourcemap 恢复前端源代码的技术流程
summary: 介绍了 Source Map 的工作原理和使用方法，展示了如何通过开源工具从 Sourcemap 文件中提取源文件结构，并还原到本地。
tags: [前端, 工具, 逆向]
---

## 概述

在浏览某些在线应用网站时，可以观察到其部署的前端脚本附带了 `.map` 后缀的 Source Map 文件。Source Map 是现代前端构建工具在打包过程中生成的映射文件，用于将压缩混淆后的代码映射回其原始源码位置。这项机制主要用于开发调试，但在特定条件下，也可以被用于还原部分甚至完整的源代码结构。

![](https://h5.ahmq.net/res/hosting/2022-02-22/16379325276250.jpg)

## 工作原理

Source Map 文件本质上是一种包含源码位置信息的 JSON 结构。以 Mozilla 提供的 [source-map](https://github.com/mozilla/source-map) 工具为例，该工具提供了 `SourceMapConsumer` 和 `SourceMapGenerator` 两个核心接口。其中，`SourceMapConsumer` 可用于读取并解析 `.map` 文件，提取映射关系以及源代码内容。

以下为基于 `source-map` 模块的伪代码流程，演示如何从 `.map` 文件中提取原始文件：

```js
// 伪代码示例

// 读取 sourcemap 文件内容
const json = JSON.stringify(fs.readFileSync('./public.js.map'))

// 创建 source map 消费者实例
const consumer = new SourceMapConsumer(json)

// 遍历 source 列表，写出原始源代码
consumer.sources.forEach(source => {
    const content = consumer.sourceContentFor(source)
    fs.writeFileSync(source, content)
})
```

上述方法依赖于 `.map` 文件中包含完整的 `sourcesContent` 字段。

## 工具实践

社区中已有开源工具封装了类似逻辑，例如 [`restore-source-tree`](https://github.com/laysent/restore-source-tree)，该项目支持从 Sourcemap 文件中自动提取源文件结构，并还原到本地。

示例使用流程如下：

```sh
git clone https://github.com/laysent/restore-source-tree
cd restore-source-tree
yarn install
wget https://example.com/public.js.map
node dist.js public.js.map
```

![](https://h5.ahmq.net/res/hosting/2022-02-22/16379334956067.jpg)

执行后可还原出部分 JS 源文件。如果 `.map` 文件中未包含 CSS、图片等静态资源的原始内容，需根据实际情况补全资源路径或进行手动恢复。

---

以上内容仅从技术角度展示 Sourcemap 的原理与工具使用流程。
