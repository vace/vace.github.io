---
layout: post
title:  HTML5 Canvas 实现一个小宇宙
categories: [前端]
tags: [Javascript,Canvas]
---

> “妈的！一个叫伽利略的傻B发明了望远镜！旧的恒星天2D贴图不能用了！3D太阳系今晚黄昏前必须上线！米迦勒！木星的贴图画好了吗？！”

“还没有！我还在做土星，土星环的模具有问题！内外环缝隙太大装不上去啊！”

“那就把环分成几个凑活一下，吃晚饭前一定要把木星的贴图弄上去！注意要贴整齐，千万不要有气泡，不然没法解释为什么我的造物是不完美的。”

“小心！！”

“不！我的法厄同！碎了！完蛋了！我该怎么解释！开普勒说木星和火星间该有一颗行星的！”

“就。。。撒一圈在轨道上，说。。。说是小行星群，被土星和木星的潮汐扯碎了。。。”

“没办法了。。。就这么干吧。。。”

“打起精神来！我的安琪儿们！我们还有15分钟！一定要把合模线刮干净！不要舍不得用补土！千万别留下指纹！！”

“冥王星的轨道参数设错了！我多按了一个1！”

“不！引力摄动把海王星带歪了！”

“伽利略吃完饭了！他走近了望远镜！他在调焦距！”

“不行了！上线上线！我按钮了！”

“给我一分钟，木星上有个气泡我把它吹平。”

“走你！就留个大红斑好了。。。”
-------------------------------------------------------------------------------------------
“father，天王星上线太着急，轨道有点瓢”

“人类怎么看？”

“他们认为还有一颗更远的行星对天王星造成引力摄动，而且。。”

“而且什么？”

"而且有个叫勒威耶的计算出这个行星必将于23号出现在黄经326度宝瓶星座的一个天区，也就是明天”

“妈个鸡！我恨数学。
----------------------------------------------------------------------------------------------
“老大，粗大事了，人类的望远镜看得越远，需要渲染的场景越大，我们的电脑速度达到了极限，帧率再也上不去了，现在人类认为宇宙中的物体运动速度有极限，不能超过光速这种奇怪的结论，这可怎么办？他们要发现真相了吗？”

“嗯。。。路西法，麻烦你投胎下去把牛顿那套理论推翻，重新以光速为极限速度发明一套新理论，。。。，就叫相对论吧，先把人类糊弄过去再说。。。”

“那我们以后更新了设备，他们可以超光速怎么办？”

“没事，再告诉他们空间是可以折叠的，让他们直接走虫洞。”
----------------------------------------------------------------------------------------------
“father，人类越来越多，活动范围也越来越大了，这样下去资源都不够用了！他们要跑出地图了，怎么办！” 

“把他们的活动平面改成曲面，哦！球体最好，随便他们怎么跑！” 

“之前说好的天圆地方呢！修改量太大，时间不够啊！” 

“额。。。拉斐尔！你先把那几个不安分得注释掉！改好了再放出来”



上面的内容来源于[水木社区](http://www.newsmth.net/) 的段子,原作者不详,OK 不扯了.简单的开始

## JS 概览

```
├── [earth-and-sun.js](https://github.com/vace/canvas-universe/blob/master/scripts/earth-and-sun.js#L1) 地球太阳月亮组成的系统
├── [image-render.js](https://github.com/vace/canvas-universe/blob/master/scripts/image-render.js#L1) 普通图片渲染到canvas
├── [main-render.js](https://github.com/vace/canvas-universe/blob/master/scripts/main-render.js#L1) 主场景,场景管理入口
├── [meteors-render.js](https://github.com/vace/canvas-universe/blob/master/scripts/meteors-render.js#L1) 流星渲染
├── [moon-render.js](https://github.com/vace/canvas-universe/blob/master/scripts/moon-render.js#L1) 月亮
├── [solar-system.js](https://github.com/vace/canvas-universe/blob/master/scripts/solar-system.js#L1) 太阳系系统
├── [stars-render.js](https://github.com/vace/canvas-universe/blob/master/scripts/stars-render.js#L1) 星星
├── [system-to-the-moon.js](https://github.com/vace/canvas-universe/blob/master/scripts/system-to-the-moon.js#L1) 地月系
├── [utils.js](https://github.com/vace/canvas-universe/blob/master/scripts/utils.js#L1)
└── [vendor.js](https://github.com/vace/canvas-universe/blob/master/scripts/vendor.js#L1)
```


## 演示 ( ⊙ o ⊙ )！

 * [星星们✨✨✨✨](/a/canvas-universe/stars.html)

 * [流星们🌠🌠🌠🌠](/a/canvas-universe/meteors.html)

 * [地球上的星空🌐🌐🌐🌐](/a/canvas-universe/earth-sky.html)

 * [简单的地月系👀](/a/canvas-universe/system-to-the-moon.html)

 * [月球绕地球公转,地球绕太阳公转](/a/canvas-universe/earth-and-sun.html)

 * [八大星星和太阳](/a/canvas-universe/solar-system.html))

 * 更多正在写...

