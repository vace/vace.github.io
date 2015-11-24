---
layout: post
title:  how to mark css
categories: [javascript,css]
tags: [javascript,nodejs]
---


> 百分比数值是相对 父元素宽度 的宽度计算的。由此可以发现只需将元素垂直方向的一个 padding 值设定为与 width 相同的百分比就可以制作出自适应正方形了

# 纯css实现正方形
在处理移动端页面时，我们有时会需要将banner图做成与屏幕等宽的正方形以获得最佳的体验效果，那么应该怎么使用纯 CSS 制作出能够自适应大小的正方形呢？

## 方案一：CSS3 vw 单位

CSS3 中新增了一组相对于可视区域百分比的长度单位 `vw`, `vh`, `vmin`, `vmax`。其中 vw 是相对于视口宽度百分比的单位，`1vw = 1% viewport width`， vh 是相对于视口高度百分比的单位，`1vh = 1% viewport height；`vmin 是相对当前视口宽高中 较小 的一个的百分比单位，同理 vmax 是相对当前视口宽高中 较大 的一个的百分比单位。该单位浏览器兼容性如下：

![兼容性](http://cc.cocimg.com/api/uploads/20150806/1438854016411308.jpg)

利用 vw 单位，我们可以很方便做出自适应的正方形：

![css](http://cc.cocimg.com/api/uploads/20150806/1438854120158107.png)

* 优点：简洁方便
* 缺点：浏览器兼容不好
---
layout: post
title:  CSS实现一个正方形
categories: [javascript]
---

#css实现正方形

## 方案二：设置垂直方向的padding撑开容器
在 CSS 盒模型中，一个比较容易被忽略的就是 margin, padding 的百分比数值计算。按照规定，margin, padding 的百分比数值是相对 父元素宽度 的宽度计算的。由此可以发现只需将元素垂直方向的一个 padding 值设定为与 width 相同的百分比就可以制作出自适应正方形了：

```css
.placeholder {
  width: 100%;
  padding-bottom: 100%;
}
```
这时一切看起来都很正常，我们试着给容器内增加内容：
![pic](http://cc.cocimg.com/api/uploads/20150806/1438854582415388.jpg)

咦？高度怎么溢出了？我们来看这时的盒模型：

![pic](http://cc.cocimg.com/api/uploads/20150806/1438854717481797.png)

如图中所示，内容区域占据了 38px 的高度。为了解决这个问题，我们可以设置容器的高度为 0：

```css
.placeholder {
  height: 0;
}
```
这种方案简洁明了，且兼容性好；但是除了填充内容后会出现问题以外，还有可能碰上max-height不收缩：DEMO，于是第三种方案来了：

## 方案三：利用伪元素的 margin(padding)-top 撑开容器

在方案二中，我们利用百分比数值的 padding-bottom 属性撑开容器内部空间，但是这样做会导致在元素上设置的 max-height 属性失效：
![pic](http://cc.cocimg.com/api/uploads/20150806/1438854808355052.png)

而失效的原因是max-height 属性只限制于 height，也就是只会对元素的 content height 起作用。那么我们是不是能用一个子元素撑开 content 部分的高度，从而使 max-height 属性生效呢？我们来试试：

```css
.placeholder {
  width: 100%;
}
.placeholder:after {
  content: '';
  display: block;
  margin-top: 100%; /* margin 百分比相对父元素宽度计算 */
}
```
一刷新页面，啊嘞？怎么什么也没有？

这里就涉及到`margin collapse`的概念了，由于容器与伪元素在垂直方向发生了外边距折叠，所以我们想象中的撑开父元素高度并没有出现。而应对的方法是在父元素上触发 BFC：
```css
.placeholder {
  overflow: hidden;
}
```
> 注：若使用垂直方向上的 padding 撑开父元素，则不需要触发 BFC

OK，父元素被撑起来了，我们再试一试设置 `max-height：`

![pic](http://cc.cocimg.com/api/uploads/20150806/1438854896664149.jpg)

完美！什么？你说元素内部添加内容时高度会溢出？来人，把这个叛徒拖出去喂狗！对于这样的情况，可以将内容放到独立的内容块中，利用绝对定位消除空间占用。

以上就是我目前所想到的三种制作自适应正方形的方案，抛去 CSS3 中的视口相对单位，主要利用到 margin, padding 的百分比数值相对父元素宽度的宽度计算得出 来制作宽高相等、且相对视口宽度自适应的正方形。如果需求是制作相对视口高度自适应的正方形，估计就只能使用 vh 单位了吧~

