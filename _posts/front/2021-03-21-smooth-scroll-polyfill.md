---
layout: post
title:  smooth-scroll 兼容处理方案
categories: [前端]
tags: [CSS,滚动,polyfill,js]
---

## 问题场景

想使用原生的滚动功能，并支持锚点的跳转方式，发现`safair`/`IE`/`Edge`等不支持smooth。

## MDN文档

当用户手动导航或者 CSSOM scrolling API 触发滚动操作时，CSS 属性 scroll-behavior 为一个滚动框指定滚动行为，其他任何的滚动，例如那些由于用户行为而产生的滚动，不受这个属性的影响。在根元素中指定这个属性时，它反而适用于视窗。

- auto 滚动框立即滚动。
- smooth 滚动框通过一个用户代理预定义的时长、使用预定义的时间函数，来实现平稳的滚动，用户代理应遵循其平台的约定，如果有的话。

## JS兼容解决方案（smoothscroll）

借助`smoothscroll.js`的`polyfill`可以让浏览器支持`scroll-behavior`。其原理是通过覆盖滚动元素的`scroll`和`scrollTo`的事件来处理的。

在浏览器环境中，会自动运行补丁。
```html
<script src="https://unpkg.com/smoothscroll"></script>
```

现在就可以通过JS来使用smooth滚动了

```js
window.scroll({ top: 2500, left: 0, behavior: 'smooth' });
window.scrollBy({ top: 100, left: 0, behavior: 'smooth' });
window.scrollBy({ top: -100, left: 0, behavior: 'smooth' });
document.querySelector('.hello').scrollIntoView({ behavior: 'smooth' });

// scrollTo
element.scroll({ top: 0, left: 0, behavior: 'smooth' });
// Scroll to top
window.scroll({ top: 0, left: 0, behavior: 'smooth' });
document.querySelector('header').scrollIntoView({ behavior: 'smooth' });
```

## 支持anchor的兼容解决方案

使用smoothscroll基本已经够用了，但是如果页面有锚点的话，比如`<a href="#hello">GO</a>`，还是无法生效，本来打算写一个插件，通过监听hashchange拦截，并使用js平滑滚动到锚点，一番查询发现已经有这个轮子了[smoothscroll-anchor-polyfill](https://github.com/jonaskuske/smoothscroll-anchor-polyfill)，原理也是差不多的，足够用了。

1. 使用css定义

```css
html {
    /* CSS custom property for the polyfill */
    --scroll-behavior: smooth;
    /* Normal CSS property for browsers with native support */
    scroll-behavior: smooth;
}
```
或者内联标签`<html style="scroll-behavior: smooth;">...`。

2. 加载polyfill，可以使用npm

```html
<!--html-->
<script src="https://unpkg.com/smoothscroll-anchor-polyfill"></script>
```

```js

// js
// Import any polyfill to enable smoothscroll for JS APIs
import smoothscrollPolyfill from 'smoothscroll-polyfill';

// Import this package to apply the smoothscroll to anchor links
import smoothscrollAnchorPolyfill from 'smoothscroll-anchor-polyfill';

// (Unlike this package, smoothscroll-polyfill needs to be actively invoked: )
smoothscrollPolyfill.polyfill();
```


> 注1：经过我的测试，好像不支持转义了的中文锚点，最好用en命名！
> 注2：此插件的实现原理是调用`window.scroll()`和`Element.scrollIntoView()`实现的（如果这两个方法不吃smooth，那么这个也是不行的），所以如果插件未生效，先得检查一下，可以引入`smoothscroll.js`，

### 参考链接

* [MDN scroll-behavior](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-behavior)
* [Demo smoothscroll](http://iamdustan.com/smoothscroll/)
* [smoothscroll Github](https://github.com/iamdustan/smoothscroll)
* [smoothscroll-anchor-polyfill DEMO](https://jonaskuske.github.io/smoothscroll-anchor-polyfill/)
* [smoothscroll-anchor-polyfill Github](https://github.com/jonaskuske/smoothscroll-anchor-polyfill)
