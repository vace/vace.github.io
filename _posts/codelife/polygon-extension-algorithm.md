---
date: 2021-12-01
title: 多边形扩展算法实现
summary: 记录了从原理分析到代码实现的全过程，并附带图示和公式推导，适合有一定图形学基础的开发者参考。
tags: [图形, 前端, JavaScript]
---

最近遇到了一个需求：期望用户可以设置场景的宽度参数，根据指定宽度对原始多边形进行扩展，以生成新的顶点坐标，本文记录了从原理分析到代码实现的全过程。

## 示例场景

以一个简单的矩形为例：

```ts
// 初始多边形由四个顶点构成
const pointList = [[0, 0], [0, 10], [10, 10], [10, 0]]
// 扩展距离为1
const expandWidth = 1
```

期望的效果是将该多边形向外扩展指定距离，形成一个略大的闭合图形。

## 算法原理

![](https://h5.ahmq.net/res/hosting/2022-02-21/16390386577816.jpg)

对每条边生成一条与其平行、距离为 `expandWidth` 的外扩线段，然后通过这些线段之间的交点计算出新的多边形顶点。

为了确保正确的外扩方向，需要首先判断原始多边形的顶点顺序（顺时针 CW 或逆时针 CCW），从而计算出正确的法线方向。

顶点的数据结构如下：

```ts
type IPoint = [number, number]
type IPolyonPoints = IPoint[]
```

## 判断顶点顺序方向

多边形的顶点顺序影响外扩法线的方向。可通过边向量与法线的点积判断方向：

![](https://h5.ahmq.net/res/hosting/2022-02-21/16390387118247.jpg)

算法实现如下：

```ts
function vecDot(v1: IPoint, v2: IPoint) {
  return v1[0] * v2[0] + v1[1] * v2[1];
}

function vecRot90CW(v: IPoint): IPoint {
  return [v[1], -v[0]];
}

function vecRot90CCW(v: IPoint): IPoint {
  return [-v[1], v[0]];
}

function polyIsCw(p: IPoint[]) {
  return vecDot(
    vecRot90CW([p[1][0] - p[0][0], p[1][1] - p[0][1]]),
    [p[2][0] - p[1][0], p[2][1] - p[1][1]]
  ) >= 0;
}

const rot = polyIsCw(pointList) ? vecRot90CCW : vecRot90CW;
```

## 构造外扩边线

对每条边计算其单位法线向量，并乘以扩展距离，平移原始边的两个端点得到平行线：

![](https://h5.ahmq.net/res/hosting/2022-02-21/16390389403649.jpg)

```ts
function vecUnit(v: IPoint): IPoint {
  const len = Math.sqrt(v[0] ** 2 + v[1] ** 2);
  return [v[0] / len, v[1] / len];
}

function vecMul(v: IPoint, s: number): IPoint {
  return [v[0] * s, v[1] * s];
}

const v01 = [pt1[0] - pt0[0], pt1[1] - pt0[1]];
const d01 = vecMul(vecUnit(rot(v01)), expandWidth);

const ptx0 = [pt0[0] + d01[0], pt0[1] + d01[1]];
const ptx1 = [pt1[0] + d01[0], pt1[1] + d01[1]];
```

## 计算交点作为新顶点

两条扩展边之间的交点就是扩展多边形的新顶点：

![](https://h5.ahmq.net/res/hosting/2022-02-21/16390390693510.jpg)

交点公式推导如下：

```ts
P1 + t * (P2 - P1) = P3 + u * (P4 - P3)
```

代码实现如下：

```ts
function intersect(line1: IPoint[], line2: IPoint[]) {
  const [a1, a2] = [line1[1][0] - line1[0][0], line1[1][1] - line1[0][1]];
  const [b1, b2] = [line2[0][0] - line2[1][0], line2[0][1] - line2[1][1]];
  const [c1, c2] = [line2[0][0] - line1[0][0], line2[0][1] - line1[0][1]];

  const denominator = a2 * b1 - a1 * b2;
  const t = (b1 * c2 - b2 * c1) / denominator;

  return [
    line1[0][0] + t * a1,
    line1[0][1] + t * a2
  ] as IPoint;
}
```

## 处理特殊情况

当多边形存在锐角或两边几乎重合时，可能导致扩展后的交点位置极度偏移，甚至出现无穷远的计算结果（被零除）。

此时应加入如下处理：

- 对于夹角小于阈值的交点，可采用插值或裁剪；
- 针对零向量法线，可跳过该边；
- 当出现 NaN 或无效交点，应跳过或回退使用原始点位。

## 总结

该算法基于向量法线和线段交点构建一个扩展后的多边形，思路清晰，适合凸多边形处理，具备良好的通用性。后续可考虑加入对凹多边形的兼容处理（如耳剪法分割成凸多边形再分别扩展）。

该方法在图形绘制、地图绘制、路径规划、图像边缘扩展等场景中均可应用。

---

如果你对这类几何算法感兴趣，欢迎一起交流。
