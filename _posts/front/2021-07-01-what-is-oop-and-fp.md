---
layout: post
title:  OOP（面向对象）与 FP（函数式） 风格
categories: [其他]
tags: [算法,前端]
---

最近考察Vue3，发现vue3架构改动幅度很大，当前对于ts的支持度非常友好了，从早期基于对象的编程（OOP）转向了函数式编程（FP）。

> 函数式编程（Functional Programming, FP）是一种编程范式——一种构建计算机程序结构和元素的方式，它将计算视为数学函数的评估，并避免改变状态和可变数据。

> 面向对象编程（Object-oriented Programming, OOP）是一种基于“对象”概念的编程范式，它可以包含字段（通常称为属性或属性）形式的数据，以及过程（通常称为方法）形式的代码。


计算机的著名定论：`程序 = 数据结构 + 算法`，无论是什么范式，都必须处理数据结构和算法。

## OOP

OOP 会把数据和相关行为放到某个对象中处理，所谓的对象就是数据与行为的集合，是对现实某个实体的抽象，比起数据，对象更关心实体有哪些行为，比如java/php/js中的class。


### 特点

- 抽象（关注本质，隐藏不必要的细节）
- 继承（根据另一个类定义一个类）
- 多态性（组合元素以创建新实体）
- 封装：（它允许对用户隐藏不相关的数据并防止未经授权的访问）

```ts
export default class Person extends AnyThing {
    private age: number = 10;
    week () {}
    private _clear () {}
}
```

对象一般就是某个类的实例`new Person`，实例中的数据一般不会暴露给外部代码，外部代码能接触到的只有实例提供的方法。

### 优点

- 保护部分方法不被外部使用。隐藏类中的变量，从而防止外部访问。除此之外，OOP允许模块化（将程序的功能分成独立模块的可能性）和共享状态的管理。
- 对象可在另一个应用程序中重用。为同一个类创建新对象很容易，容易维护和修改代码。
- 内存管理：在创建大型程序时，它提供了很大的好处，因为它可以轻松地将事物分成更小的部分，并有助于区分需要以某种方式执行的组件。

### 缺点

不可重用。由于某些函数依赖于使用它们的类，因此它们很难与其他类一起使用。除此之外，它的效率较低且更难处理。许多面向对象的程序也用于模拟大规模架构，并且可能很复杂。

## FP

FP 是通过组合纯函数来构建软件的过程。所有对象都是不可变的，这意味着一旦创建了某些东西，就无法更改它。

把数据和行为完全分开处理，比起行为，FP 更加关注数据结构是什么样的，怎么样由 A 数据衍生计算出 B 数据，代表语言如`go`/`F#`。FP 适合数据结构稳定清晰的场景，数据驱动开发模式就是基于 FP 范式的。FP 带来的很大好处是数据不可变，由于数据不可变，开发者不用关心什么某个数据在什么时候什么条件下会改变。

### 特点

- 函数是第一等公民
- 强调将计算过程分解成可复用的函数
- 只有纯的、没有副作用的函数，才是合格的函数。

```js
const add = (x, y) => x + y
const pow = (x) => x * x
const val = pow(add(2 + 3)) // (2 + 3)^2
```

### FP运算

#### 合成

如果一个值要经过多个函数，才能变成另外一个值，就可以把所有中间步骤合并成一个函数，这叫做"函数的合成"（compose）。

```js
const compose = (f, g) => (x) => f(g(x))
// 函数的合成满足交换律和结合律，以下调用方式等价
compose(f, compose(g, h))
compose(compose(f, g), h)
compose(f, g, h)
```

#### 柯里化

`f(x)`和`g(x)`合成为`f(g(x))`，有一个隐藏的前提，就是`f`和`g`都只能接受一个参数。如果可以接受多个参数，比如`f(x, y)`和`g(a, b, c)`，函数合成就非常麻烦，所谓"柯里化"，就是把一个多参数的函数，转化为单参数函数。

```js
// 柯里化之前
const add = (x, y) => x + y
add(1, 2) // 3

// 柯里化之后
const addN = x => y => x + y
addN(2)(3) // 5
```

### 优点

- 提供了诸如惰性求值、无错误代码、嵌套函数、并行编程等优点。它使用更具声明性的方法，专注于需要做的事情而不是如何去做，并强调效率和优化。
- 在函数式编程中，由于对象本身现在是具有不同名称的新对象，因此更容易了解进行了哪些更改。当有一组固定的操作时，它会很有效，并且随着您的代码的发展，您可以在现有事物上添加新的操作。
- 当不需要边界或已经预定义边界时，它可以很好地工作。
- 在函数式编程中，模拟现实世界的过程比模拟对象更容易。它的数学起源使其适用于需要计算或任何包括转换和处理的情况。在这种情况下，OOP 将是低效的。

### 缺点

- 关于数据操作的，采用不同的思维方式来编写代码。虽然用面向对象的术语来思考很容易，但将现实世界的场景转换为简单的场景需要更多的脑力劳动。
- 由于 FP 更难学习，因此以这种方式编程的人较少，因此有关该主题的信息自然较少。

## 怎么选

两种范式共同目标是开发可理解且无错误的程序，但它们的方法不同。普遍的共识是 OOP 和 FP 在任何特定情况下都是有效的，因此开发人员始终可以选择使过程高效且简单的编程范式。

## Vue2 VS Vue3

Vue2 到 Vue3 最直观的改变就是 Composition API——几乎所有的 Vue2 options 方法都被放到了 setup 函数里：

```js
+ import { onMounted, reactive, watchEffect } from 'vue'

export default {
  name: "App",

+  setup( props ) {
+    const state = reactive({ /*...*/ });
+    onMounted(() => { /*...*/ });
+    watchEffect(() => { /*...*/ });
+    return { state };
+  },

-  data: () => ({ state: /*...*/ }),
-  mounted(){ /*...*/ },
-  watch: { /*...*/ },
};
```

这是一个比较大的风格转变，通俗来说，就是从基于对象的编程（OOP）转向了函数式编程（FP）。


## 参考

- [ramda.js](https://ramdajs.com/)
- [函数式编程入门教程](https://www.ruanyifeng.com/blog/2017/02/fp-tutorial.html)
