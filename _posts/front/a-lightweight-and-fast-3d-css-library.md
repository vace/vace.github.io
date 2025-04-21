---
title: "轻量快速的css3d库c3.js"
date: 2016-07-14
summary: "介绍自主开发的c3.js库，一个仅20KB的轻量级CSS 3D引擎，支持平面、立方体、多面体渲染，提供完整API及使用示例。"
tags: [CSS, JavaScript, 前端, 动画]
---

## 简介

`c3.js` 是一个轻量快速的CSS 3D库，项目源码可在 [GitHub](https://github.com/vace/c3.js) 或 [Coding](https://git.coding.net/vace/c3.js.git) 获取。c3.js是我使用CSS实现的一套简单3D引擎，受到 [css3d-engine](https://github.com/shrekshrek/css3d-engine) 和 [voxel.css](https://github.com/HunterLarco/voxel.css) 这两个库的启发。

> **特点：体积小巧，仅20KB，gzip压缩后只有6.4KB！**

<iframe width="100%" height="300" src="//jsfiddle.net/vace/xvvcc83u/embedded/result,js/dark" allowFullScreen="allowfullscreen" frameBorder="0"></iframe>

## 演示示例

以下是几个实际应用场景的演示链接：

- [空间效果预览](https://h5.ahmq.net/res/myblog/demo/css3d-csjs/space.html)
- [平面，立方体，多面圆柱展示](https://h5.ahmq.net/res/myblog/demo/css3d-csjs/index.html)
- [材质贴图示例](https://h5.ahmq.net/res/myblog/demo/css3d-csjs/material.html)
- [3D全景模拟](https://h5.ahmq.net/res/myblog/demo/css3d-csjs/pano.html)
- [魔方示例](https://h5.ahmq.net/res/myblog/demo/css3d-csjs/rubik.html)
- [带贴图的魔方](https://h5.ahmq.net/res/myblog/demo/css3d-csjs/superrubik.html)

## 使用指南

### 安装

```bash
npm install c3.js
```

### 引入方式

**CommonJS (Node.js)**
```javascript
var c3 = require('c3')
```

**AMD (RequireJS)**
```javascript
define(['c3'], function(c3) {
    // 你的代码
})
```

**ES6 模块**
```javascript
import c3 from 'c3'
```

### HTML结构

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>c3.js Demo</title>
    </head>
    <body>
        <script src="c3.js"></script>
        <script type="text/javascript">
        	// 你的js代码
        </script>
    </body>
</html>
```

### JavaScript基础用法

```javascript
// 创建舞台
var stage = new c3.Stage(window.innerWidth, window.innerHeight);
// 挂载舞台到页面元素
stage.attach('body');
// 添加平面
var plane = new c3.Plane(width, height, zIndex);
// 添加立方体
var cube = new c3.Cube(xWidth, yWidth, zWidth);
// 添加分组
var group = new c3.Sprite();
// 添加多面体
var cylinder = new c3.Cylinder(width, height, number);
// 创建材质
var material = new c3.Material();
// 添加材质到显示对象
cylinder.material = material;
// 将显示对象添加到舞台
stage.addChild(plane);
```

## API文档

### HashObject

`c3.js`的顶级对象。框架内所有对象的基类，为对象实例提供唯一的`hashCode`值。

#### 公共属性

* `hashCode: string` [只读] 返回此对象唯一的哈希值，用于唯一确定一个对象

### Display 类 (extends HashObject)

Display 类是可放在显示列表中的所有对象的基类。该显示列表管理运行时中显示的所有对象。

#### 公共属性

* `visible: boolean` 显示对象是否可见
* `backface: boolean` 显示对象背面是否可见
* `className: string` 显示对象class类名
* `opacity: number` 显示对象的透明度

#### 公共方法

**大部分方法支持链式调用，其中`position`、`rotate`、`translate`、`scale`参数其中一个为字符串时表示变化值，如`rotate('+0.5',0,0)` => `rotate.x += 0.5`**

* `css(param: Object): Display` - 为当前显示对象设置样式，例如 `css({color:'red'})`
* `on(type: string, cb: Function[, capture: boolean]): Display` - 为显示对象添加事件
* `once(type: string, cb: Function[, capture: boolean]): Display` - 为显示对象添加事件，只触发一次
* `off(type: string, cb: Function[, capture: boolean]): Display` - 删除对象中的侦听器
* `position(x: number|string, y?: number|string, z?: number|string): Display` - 设置显示对象的位置
* `getPosition(): Point` - 获取显示对象的位置
* `size(x: number|string, y?: number|string, z?: number|string): Display` - 设置显示对象的尺寸和显示优先级
* `getSize(): Point` - 获取显示对象的尺寸
* `rotate(x: number|string, y?: number|string, z?: number|string): Display` - 设置显示对象的旋转
* `getRotate(): Quaternion` - 获取显示对象的旋转四元数
* `scale(x: number|string, y?: number|string, z?: number|string): Display` - 设置显示对象缩放
* `getScale(): Vector3D` - 获取显示对象的缩放
* `translate(x: number|string, y?: number|string, z?: number|string): Display` - 设置显示对象位移
* `getTranslate(): Vector3D` - 获取显示对象的位移
* `update(): void` - 更新场景中的(position,translate,rotate,scale)的设置

### Sprite 类 (extends Display)

Sprite 是基本显示列表构造块：一个可包含子项的显示列表节点。

#### 公共属性

* `children: Display[]` [只读] 当前Sprite下的所有子显示对象
* `numChildren: number` [只读] 当前Sprite下子项的数量
* `material: Material[]` 设置或获取显示对象组的材质

#### 公共方法

* `addChild(...displays: Display[]): void` - 添加显示对象到组内
* `removeChild(...displays: Display[]): void` - 从组内移除对象

### Stage 类 (extends Sprite)

Stage 为所有显示元件的顶级父对象，一个场景只能有一个Stage。

#### 构造方法

```javascript
var stage = new c3.Stage(stageWidth, stageHeight)
```

参数：
* `stageWidth`: 舞台宽度
* `stageHeight`: 舞台高度

#### 公共属性

* `camera: c3.Camera` - 获取当前场景的`camera`对象

#### 公共方法

* `attach(selector: string)` - 将舞台挂载到指定DOM元素

### Camera 类 (extends Sprite)

Camera 为 Stage 的直接子元素，可以通过 `stage.camera` 引用。

#### 属性

* `fov: number` - 相机视锥体垂直视角

### Plane 类 (extends Display) 

一个二维平面，具有width、height、zIndex和material属性。

#### 构造方法

```javascript
var plane = new c3.Plane(width, height, zIndex = 0)
```

参数：
* `width: number` - 平面宽度
* `height: number` - 平面高度
* `zIndex: number` - 平面的z-index (默认值为0)

#### 属性

* `material: Material` - 设置或获取平面的材质

### Cube 类 (extends Sprite)

一个三维立方体空间。

#### 构造方法

```javascript
var cube = new c3.Cube(x, y, z)
```

参数：
* `x: number` - 立方体x轴宽度
* `y: number` - 立方体y轴宽度
* `z: number` - 立方体z轴宽度

### Cylinder 类 (extends Sprite)

多面圆柱，所有面的长宽是相等的。

#### 构造方法

```javascript
var cylinder = new c3.Cylinder(width, height, num)
```

参数：
* `width: number` - 面宽
* `height: number` - 面高
* `num: number` - 面的个数

### Material 类 (extends HashObject)

一个材质可以被多个显示对象使用，每个显示对象只能有一个材质。这里的材质实质上是对显示对象的CSS属性操作。

#### 构造方法

```javascript
var material = new C3.Material(param: Itexture = {})
```

Itexture 接口包括：
* `color?: string` - CSS: background-color
* `position?: string` - CSS: background-position
* `size?: string` - CSS: background-size
* `repeat?: string` - CSS: background-repeat
* `origin?: string` - CSS: background-origin
* `clip?: string` - CSS: background-clip
* `attachment?: string` - CSS: background-attachment
* `image?: string` - CSS: background-image
* `filter?: string` - CSS: filter
* `hidden?: boolean` - CSS: background:none
* `visible?: boolean` - CSS: visible
* `backface?: boolean` - CSS: backface-visibility
* `opacity?: number` - CSS: opacity

#### 方法

* `clone()` - 克隆当前材质
* `update(param: Itexture = {})` - 更新材质属性
* `getAttr(attr: string)` - 获取材质属性值
* `render(target?: Display)` - 将材质渲染到指定显示对象上

## 实现原理

c3.js 利用CSS3的3D变换能力实现各种3D效果，主要包括：

1. 使用CSS Transform属性进行3D变换
2. 使用四元数计算旋转角度
3. 通过DOM层级结构模拟3D场景树
4. 使用事件代理优化交互性能

## 辅助函数

c3.js提供了一些实用的辅助函数：

* `c.style(el, param)` - 为元素添加CSS，API可参考[style.js](https://github.com/vace/style.js)
* `c.rnd(min, max)` - 生成指定区间的随机数
* `c.rndInt(min, max)` - 生成指定区间的随机整数
* `c.rndColor()` - 生成随机色值

