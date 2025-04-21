---
title: "Javascript 入坑指谜"
date: 2016-07-07
summary: "揭秘JavaScript中常见但令人困惑的语言特性和陷阱，通过代码示例解析数组方法、数据类型、运算符优先级和函数行为等技术要点。"
tags: [JavaScript, 前端]
---

## JavaScript语言特性

JavaScript的C风格的语法，包括大括号和复杂的`for`语句，让它看起来像是一个普通的过程式语言。这其实是一个误导，因为JavaScript和函数式语言如Lisp和Scheme有更多的共同之处。它用数组代替了列表，用对象代替了属性列表。函数是第一公民，而且有闭包。你不需要平衡那些括号就可以用lambda算子。

但是，JavaScript早期实现错误百出，这对该语言带来了很恶劣的影响。更糟糕的是，这些实现还被嵌入到错误百出的浏览器中。因此，在JavaScript中踩坑是非常常见的现象，本文将通过一系列示例来分析这些常见陷阱。

## 测试环境

> 下面所有的JavaScript测试基于ECMA 262标准在浏览器环境中的行为表现

## 常见JavaScript陷阱

### 1. 数组方法中的回调函数

**示例一：map与parseInt的配合**

```javascript
["1", "2", "3"].map(parseInt)
```

**输出结果：**
```
[1, NaN, NaN]
```

**实现原理：**
`Array.prototype.map(callback(currentValue, index, array)[,thisArg])`方法中，回调函数会自动接收三个参数。而`parseInt(string, radix)`接受两个参数。当这两个函数配合时，实际执行过程如下：

```javascript
["1","2","3"].map(function(value, index) {
    return parseInt(value, index);
})
// 等价于以下调用
parseInt("1", 0) // 结果为1（radix为0时按十进制解析）
parseInt("2", 1) // 结果为NaN（没有1进制）
parseInt("3", 2) // 结果为NaN（2进制不能有3）
```

**示例二：replace与函数参数**

```javascript
"1 2 3".replace(/\d/g, parseInt)
```

**输出结果：**
```
1 NaN 3
```

**实现原理：**
`String.prototype.replace(regexp|substr, newSubStr|function)`方法的第二个参数为函数时，该函数会接收以下参数：

| 参数名 | 含义 |
|-------|------|
| match | 匹配的子串 |
| p1,p2... | 正则表达式分组捕获的结果 |
| offset | 匹配到的子字符串在原字符串中的偏移量 |
| string | 被匹配的原字符串 |

```javascript
"1 2 3".replace(/\d/g, function(match, index) {
    return parseInt(match, index); // 参数分别是 [1, 0], [2, 2], [3, 4]
})
// 等价于以下调用
parseInt("1", 0) // 1（十进制）
parseInt("2", 2) // NaN（2进制不能有2）
parseInt("3", 4) // 3（4进制下的3等于十进制的3）
```

### 2. JavaScript中的null陷阱

```javascript
[typeof null, null instanceof Object]
```

**输出结果：**
```
['object', false]
```

**实现原理：**
⚠️ JavaScript中`typeof null`返回`'object'`是一个历史遗留bug。在JavaScript最初实现中，值由一个类型标签和实际数据值表示，对象的类型标签是0，而`null`是空指针（通常是0x00），因此`null`的类型标签也变成了0，导致`typeof null`错误返回`'object'`。

这个问题曾计划在ECMAScript 6中修复（返回`'null'`），但提议被否决了。

### 3. 数组方法的边界情况

```javascript
[[1,2,3].reduce(Math.pow), [].reduce(Math.pow)]
```

**输出结果：**
```
Uncaught TypeError: Reduce of empty array with no initial value
```

**实现原理：**
`Array.prototype.reduce()`方法在没有提供初始值且数组为空时会抛出TypeError。这是因为reduce需要至少一个元素作为初始累加器值，如果数组为空且没有提供initialValue，就会出错。

### 4. 运算符优先级问题

```javascript
['value is ' + (89 > 90) ? 'A' : 'B', 'value is ' + (91 > 90) ? 'A' : 'B']
```

**输出结果：**
```
['A', 'A']
```

**实现原理：**
这个问题涉及到运算符优先级。加法运算符`+`优先级高于三元运算符`?:`，所以表达式会被解析为：

```javascript
(('value is ' + (89 > 90)) ? 'A' : 'B')
// 等价于
('value is false' ? 'A' : 'B') // 结果是'A'，因为非空字符串转为布尔值为true
```

### 5. 变量提升机制

**示例一：**

```javascript
var name = 'World!';
(function () {
    if (typeof name === 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```

**输出结果：**
```
Goodbye Jack
```

**实现原理：**
JavaScript中的变量提升（hoisting）会将变量声明（不包括赋值）提升到函数作用域顶部。因此，上面代码等价于：

```javascript
var name = 'World!';
(function () {
    var name; // 声明提升，此时name是undefined
    if (typeof name === 'undefined') {
        name = 'Jack'; // 赋值
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```

**示例二：**

```javascript
function foo(a) {
    var a;
    return a;
}
function bar(a) {
    var a = 'bye';
    return a;
}
[foo('hello'), bar('hello')]
```

**输出结果：**
```
['hello', 'bye']
```

**实现原理：**
函数参数可以视为在函数体顶部的变量声明。上面的代码等价于：

```javascript
function foo(a) { // a = 'hello'
    var a; // 重复声明，无效果
    return a; // 返回'hello'
}
function bar(a) { // a = 'hello'
    var a = 'bye'; // 重新赋值为'bye'
    return a; // 返回'bye'
}
```

### 6. 数值表示限制

```javascript
var end = Math.pow(2, 53)
var start = end - 100
var count = 0
for(var i = start; i <= end; i++){
    count++
}
console.log(count)
```

**输出结果：**
无限循环，不会输出结果。

**实现原理：**
⚠️ JavaScript中的`Number`类型是64位浮点数，能精确表示的最大整数是2^53，即`9007199254740992`。超过这个值后，JavaScript无法精确表示连续整数。

当`i = Math.pow(2, 53)`时，`i + 1 === i`会返回`true`，导致循环条件一直为true，形成死循环。

### 7. 稀疏数组处理

```javascript
var ary = [0,1,2];
ary[10] = undefined;
ary.filter(function(x) { return x === undefined; });
```

**输出结果：**
```
[undefined]
```

**实现原理：**
JavaScript数组可以是稀疏的，即包含"空位"。`Array.prototype.filter()`等迭代方法会跳过数组中的"空位"，但会处理值为`undefined`的元素。

在示例中，`ary[10] = undefined`创建了一个显式值为`undefined`的元素，而索引3到9是"空位"。`filter`方法跳过了空位，但处理了索引10的`undefined`值。

### 8. 浮点数计算精度问题

```javascript
var two   = 0.2
var one   = 0.1
var eight = 0.8
var six   = 0.6
[two - one === one, eight - six === two]
```

**输出结果：**
```
[true, false]
```

**实现原理：**
⚠️ JavaScript使用IEEE 754双精度浮点数表示数字，某些小数无法精确表示。浮点数计算可能会产生误差。

在二进制中，0.1和0.2都是无限循环小数，所以：
- `0.2 - 0.1`的结果接近但不一定等于0.1
- `0.8 - 0.6`的结果接近但不一定等于0.2

出乎意料的是第一个比较返回`true`，而第二个返回`false`，这与IEEE 754标准下的舍入规则有关。

> 处理金融计算时，应该使用专门的库或将数值转换为整数后再计算，以避免精度问题。

### 9. Switch语句的比较机制

```javascript
function showCase(value) {
    switch(value) {
    case 'A':
        console.log('Case A');
        break;
    case 'B':
        console.log('Case B');
        break;
    case undefined:
        console.log('undefined');
        break;
    default:
        console.log('Do not know!');
    }
}
showCase(new String('A'));
showCase(String('A'));
```

**输出结果：**
```
Do not know!
Case A
```

**实现原理：**
`switch`语句使用严格相等（`===`）进行比较。
- `new String('A')`创建了一个String对象，结果为`String {'A'}`，它不严格等于字符串`'A'`
- `String('A')`是一个函数调用，返回原始字符串`'A'`，严格等于`'A'`

这解释了为什么第一个调用匹配了default，而第二个调用匹配了`case 'A'`。

### 10. 取模运算符的特性

```javascript
function isOdd(num) {
    return num % 2 == 1;
}
function isEven(num) {
    return num % 2 == 0;
}
function isSane(num) {
    return isEven(num) || isOdd(num);
}
var values = [7, 4, '13', -9, Infinity];
values.map(isSane);
```

**输出结果：**
```
[true, true, true, false, false]
```

**实现原理：**
JavaScript中模运算的结果符号与被除数相同：
- `-9 % 2 = -1`，不等于1，所以`isOdd(-9)`返回`false`
- `Infinity % 2 = NaN`，所以`isOdd(Infinity)`和`isEven(Infinity)`都返回`false`

对于字符串`'13'`，在数学运算中会自动转换为数字13。

### 11. 原型链的特性

```javascript
Array.isArray(Array.prototype)
```

**输出结果：**
```
true
```

**实现原理：**
在JavaScript中，`Array.prototype`实际上是一个数组对象。这是JavaScript内置对象的一个特殊设计，等价于`Array.prototype = []`。因此，`Array.isArray(Array.prototype)`返回`true`。

### 12. 比较运算的隐式转换

```javascript
// 示例1
var a = [0]
if (a) {
    console.log(a == true)
} else {
    console.log('hello world')
}

// 示例2
console.log([]==[])

// 示例3
console.log([[[2]]] == 2)
```

**输出结果：**
```
false
false
true
```

**实现原理：**
1. 非空数组`[0]`转为布尔值是`true`，但在`==`比较时，数组会转为字符串`'0'`，而`true`转为1，`'0' == 1`为`false`
2. 两个数组是不同的对象引用，`==`比较引用地址，所以结果是`false`
3. `[[[2]]]`在比较时会先转为字符串`'2'`，然后与数字2比较，`'2' == 2`为`true`

### 13. arguments对象的特性

```javascript
function sidEffecting(ary) {
  ary[0] = ary[2];
}
function bar(a,b,c) {
  c = 10
  sidEffecting(arguments);
  return a + b + c;
}
bar(1,1,1)
```

**输出结果：**
```
21
```

**实现原理：**
在非严格模式下，函数参数和`arguments`对象是相互关联的。当修改`arguments[0]`时，对应的参数`a`也会改变：

```javascript
function bar(a,b,c) {
  c = 10;                // c变为10，同时arguments[2]也变为10
  sidEffecting(arguments); // 执行后arguments[0] = arguments[2] = 10
  // 此时a = 10, b = 1, c = 10
  return a + b + c;      // 10 + 1 + 10 = 21
}
```

⚠️ 注意：在严格模式('use strict')下，`arguments`对象不会与参数相互影响。

### 14. Number的toString方法调用

```javascript
console.log(3.toString())
console.log(3..toString())
console.log(3...toString())
```

**输出结果：**
```
Uncaught SyntaxError: Invalid or unexpected token
"3"
Uncaught SyntaxError: Unexpected token .
```

**实现原理：**
- `3.toString()`语法错误，因为JavaScript解析器会将第一个点视为小数点
- `3..toString()`正确，第一个点被解释为小数点，第二个点调用toString方法
- `3...toString()`错误，JavaScript不允许连续多个点

**最佳实践：**
为避免这类混淆，可以使用以下写法：
```javascript
(3).toString()
3..toString()
Number(3).toString()
```

### 15. 原型链访问方式

```javascript
var a = {}
var b = Object.prototype;

console.log([a.prototype === b, Object.getPrototypeOf(a) === b])

function f(){}

console.log(f.prototype === Object.getPrototypeOf(f))
```

**输出结果：**
```
[false, true]
false
```

**实现原理：**
- 普通对象没有`prototype`属性，只有函数对象才有。所以`a.prototype === undefined`
- `Object.getPrototypeOf(a)`返回对象`a`的原型，也就是`Object.prototype`
- 函数`f`的`prototype`属性是为它创建的实例对象设置原型用的
- `Object.getPrototypeOf(f)`返回函数`f`本身的原型，即`Function.prototype`

### 16. 数组的尾部逗号

```javascript
[,,,].join(", ")
```

**输出结果：**
```
", , "
```

**实现原理：**
JavaScript数组字面量中的尾部逗号会创建稀疏数组，`[,,,]`创建了一个有3个"空位"的数组。`join()`方法会将空位视为空字符串。

### 17. Function.length特性

```javascript
console.log(Function.length, new Function().length)
```

**输出结果：**
```
1, 0
```

**实现原理：**
- `Function.length`返回1，表示`Function`构造函数期望的参数数量为1
- `new Function().length`返回0，表示通过`new Function()`创建的默认函数不接受任何参数

### 18. Math.min和Math.max的边界值

```javascript
console.log(Math.min() < Math.max())
```

**输出结果：**
```
false
```

**实现原理：**
- `Math.min()`在没有参数时返回`Infinity`
- `Math.max()`在没有参数时返回`-Infinity`

因此，`Infinity < -Infinity`是`false`。
