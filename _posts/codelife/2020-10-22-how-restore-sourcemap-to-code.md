---
layout: post
title:  从sourcemap还原前端代码
categories: [其他]
tags: [sourcemap,js]
---

## 原理

浏览某个在线设计网站时，发现脚本开放了`sourcemap`，sourcemap是由打包工具生成的，和源代码一一对应，可以根据sourcemap还原全部或者绝大多数的源代码。

![](https://h5.ahmq.net/res/hosting/2022-02-22/16379325276250.jpg)

## 理论

看了一下[mozilla 的 source-map](https://github.com/mozilla/source-map)工具源码，提供了`SourceMapGenerator`，和 `SourceMapConsumer`，那么明显，通过`SourceMapConsumer`可以还原出源代码的树信息。

```js
// 伪代码

// 获取sourcemap
const json = JSON.stringify(fs.readFileSync('./public.js.map'))
// 读取源代码信息
const consumer = new SourceMapConsumer(json)
// 写出代码树
// sources : An array of URLs to the original source files.
// sourceContentFor: Returns the original source content for the source provided. The only argument is the URL of the original source file.
consumer.sources.forEach(source => {
    const [path, src] = source
    const txt = consumer.sourceContentFor(src)
    fs.writeFileSync(src, path)
})

```

## 实践

查询时发现已经有现成的轮子[restore-source-tree](https://github.com/laysent/restore-source-tree)，跑一下试试。

```sh
git clone https://github.com/laysent/restore-source-tree
cd restore-source-tree
yarn install
wget xx.com/public.js.map
node dist.js public.js.map
```

![](https://h5.ahmq.net/res/hosting/2022-02-22/16379334956067.jpg)

少了css源码和很多静态资源，可以自己想办法补全，后面修修改改就能运行了。

（完）

