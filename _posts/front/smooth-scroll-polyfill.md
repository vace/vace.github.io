---
title: "smooth-scroll 兼容处理方案"
date: 2021-03-21
summary: "解析浏览器平滑滚动兼容性问题，探讨使用smoothscroll和smoothscroll-anchor-polyfill实现跨浏览器的平滑滚动和锚点跳转方案。"
tags: [JavaScript, CSS, 前端]
---

## 问题场景

在前端开发中，我们常常需要使用原生的平滑滚动功能，并支持锚点的跳转方式。然而，`Safari`/`IE`/`Edge`等浏览器对CSS属性`scroll-behavior: smooth`的支持并不完善，导致无法实现一致的用户体验。

## CSS scroll-behavior属性解析

当用户手动导航或者 CSSOM scrolling API 触发滚动操作时，CSS 属性 `scroll-behavior` 为一个滚动框指定滚动行为，其他任何的滚动，例如那些由于用户行为而产生的滚动，不受这个属性的影响。在根元素中指定这个属性时，它会应用于视窗。

该属性有两个可选值：
- `auto`：滚动框立即滚动，无过渡效果。
- `smooth`：滚动框通过一个用户代理预定义的时长、使用预定义的时间函数，来实现平稳的滚动，用户代理应遵循其平台的约定。

## JS兼容解决方案：smoothscroll polyfill

借助`smoothscroll.js`的`polyfill`可以让浏览器支持`scroll-behavior`。其原理是通过覆盖滚动元素的`scroll`和`scrollTo`的事件来处理的。

### 实现原理

`smoothscroll`会检测浏览器是否原生支持平滑滚动，如果不支持，则会重写相关的滚动方法，添加平滑滚动的动画效果。它通过计算起始位置和目标位置之间的差值，然后使用定时器逐步调整滚动位置来模拟平滑滚动效果。

### 使用方法

在浏览器环境中，只需引入脚本，会自动运行补丁：

```html
<script src="https://unpkg.com/smoothscroll"></script>
```

引入后，就可以通过JS来使用smooth滚动了：

```js
// 滚动到指定位置
window.scroll({ top: 2500, left: 0, behavior: 'smooth' });

// 相对当前位置滚动
window.scrollBy({ top: 100, left: 0, behavior: 'smooth' });
window.scrollBy({ top: -100, left: 0, behavior: 'smooth' });

// 滚动到指定元素
document.querySelector('.hello').scrollIntoView({ behavior: 'smooth' });

// 元素滚动
element.scroll({ top: 0, left: 0, behavior: 'smooth' });

// 滚动到顶部
window.scroll({ top: 0, left: 0, behavior: 'smooth' });
document.querySelector('header').scrollIntoView({ behavior: 'smooth' });
```

## 锚点兼容解决方案：smoothscroll-anchor-polyfill

使用smoothscroll基本已经够用了，但是如果页面有锚点的话，比如`<a href="#hello">GO</a>`，还是无法生效。本来打算通过监听`hashchange`事件拦截，并使用js平滑滚动到锚点，但经过查询发现已经有现成的解决方案：[smoothscroll-anchor-polyfill](https://github.com/jonaskuske/smoothscroll-anchor-polyfill)。

### 实现原理

该polyfill通过监听所有锚点链接的点击事件，阻止默认的跳转行为，然后调用`window.scroll()`或`Element.scrollIntoView()`方法实现平滑滚动到目标元素的位置。

### 使用方法

1. 使用CSS定义平滑滚动行为：

```css
html {
    /* CSS custom property for the polyfill */
    --scroll-behavior: smooth;
    /* Normal CSS property for browsers with native support */
    scroll-behavior: smooth;
}
```

或者通过内联样式：`<html style="scroll-behavior: smooth;">...</html>`。

2. 加载polyfill，可以通过CDN或npm：

```html
<!-- 通过CDN加载 -->
<script src="https://unpkg.com/smoothscroll-anchor-polyfill"></script>
```

或者在JavaScript中导入：

```js
// 导入smoothscroll polyfill来启用JS API的平滑滚动
import smoothscrollPolyfill from 'smoothscroll-polyfill';

// 导入此包以将平滑滚动应用于锚点链接
import smoothscrollAnchorPolyfill from 'smoothscroll-anchor-polyfill';

// smoothscroll-polyfill需要主动调用以激活
smoothscrollPolyfill.polyfill();
```

## 总结

1. **同时使用两个polyfill**：对于需要全面兼容的项目，建议同时引入`smoothscroll`和`smoothscroll-anchor-polyfill`。

2. **性能考量**：由于polyfill会覆盖原生方法，可能会带来轻微的性能开销，建议在高性能要求的场景下进行测试。

3. **锚点命名规范**：
   > ⚠️ 经过测试，不支持转义了的中文锚点，最好使用英文命名！

4. **调试方法**：如果锚点滚动未生效，请检查：
   - 是否正确引入了两个polyfill
   - 目标元素是否存在且ID正确
   - 是否有JavaScript错误阻止了polyfill的执行

5. **渐进增强**：将平滑滚动作为增强体验的功能，而不是核心功能，确保没有polyfill时页面仍能正常工作。

## 浏览器兼容性

| 浏览器 | 原生支持 | 需要polyfill |
|------|---------|------------|
| Chrome 61+ | ✓ | |
| Firefox 36+ | ✓ | |
| Edge 79+ | ✓ | |
| Safari | ✗ | ✓ |
| IE | ✗ | ✓ |
| 旧版Edge | ✗ | ✓ |

> 注：此插件的实现原理是调用`window.scroll()`和`Element.scrollIntoView()`实现的。如果这两个方法不支持smooth参数，那么需要先引入`smoothscroll.js`作为基础。

### 参考链接

* [MDN scroll-behavior](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-behavior)
* [Demo smoothscroll](http://iamdustan.com/smoothscroll/)
* [smoothscroll Github](https://github.com/iamdustan/smoothscroll)
* [smoothscroll-anchor-polyfill DEMO](https://jonaskuske.github.io/smoothscroll-anchor-polyfill/)
* [smoothscroll-anchor-polyfill Github](https://github.com/jonaskuske/smoothscroll-anchor-polyfill)
