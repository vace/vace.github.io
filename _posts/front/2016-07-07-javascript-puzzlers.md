---
layout: post
title:  Javascript 入坑指谜
categories: [前端]
tags: [javascript]
---


-------------
JavaScript的C风格的语法，包括大括号和复杂的for 语句，让它看起来好象是一个普通的过程式语言。这是一个误导因为JavaScript和函数式语言如Lisp和Scheme有更多的共同之处。它用数组代替了列表，用对象代替了属性列表。函数是第一型的。而且有闭包。你不需要平衡那些括号就可以用lambda算子。但是早期实现错误百出。这对该语言带来了很恶劣的影响。更糟糕的是，这些实现还被嵌入的更错误百出的浏览器中。踩到坑是常见的.....下面来踩一踩


## 说明
下面所有的JavaScript测试基于行为ECMA 262浏览器环境中

## 开始

### 回调函数

**代码：**

`["1", "2", "3"].map(parseInt)` 

**结果：**

`[1,NaN,NaN]`

**分析：**

map的语法和参数 `Array.prototype.map(callback(currentValue, index, array)[,thisArg])`,得到如下

```javascript
["1","2","3"].map(function(value,index){
	return parseInt(value,index)
})
// result
parseInt("1",0) = 1
parseInt("2",1) = NaN
parseInt("3",2) = NaN
```


**代码：**

`"1 2 3".replace(/\d/g, parseInt)`

**结果：**

`1 NaN 3`

**分析：**

`str.replace(regexp|substr, newSubStr|function)`,当替换内容是函数的时候,参数为
|变量名|代表的含义|
|--|--|
|match|匹配的子串。|
|p1,p2...| 假如replace()方法的第一个参数是一个RegExp 对象，则代表第n个括号匹配的字符串。（对应于$1，$2等。）|
|offset	| 匹配到的子字符串在原字符串中的偏移量。（比如，如果原字符串是“abcd”，匹配到的子字符串时“bc”，那么这个参数将是1）|
|string|	被匹配的原字符串。|

```javascript
"1 2 3".replace(/\d/g, function(match,index){
	return parseInt(match,index) // 参数分别是 [1, 0], [2, 2], [3, 4].
})
```


### javascript中的null

**代码：**

`[typeof null, null instanceof Object]`

**结果：**

`['object',false]`

**分析：**

typeof操作符返回一个字符串,表示未经求值的操作数(unevaluated operand)的类型。在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是0。由于 null 代表的是空指针(大多数平台下值为0x00)，因此，null的类型标签也成为了0，typeof null就错误的返回了"object".
~~该现象有待于在ECMAScript 6中被修复 (该提议已被否决). 正确的返回值将成为 typeof null === 'null'.~~


### reduce 应用在空数组会抛出异常

**代码：**

`[ [1,2,3].reduce(Math.pow), [].reduce(Math.pow) ]`

**结果：**

`Uncaught TypeError: Reduce of empty array with no initial value`

### 三元表达式优先级

**代码：**

`['value is ' + (89 > 90) ? 'A' : 'B','value is ' + (91 > 90) ? 'A' : 'B']`

**结果：**

`['A','A']`

**分析：**

```javascript
console.log('value is ' + (89 > 90) ? 'A' : 'B')
// 实际上运算优先级会变成下面
console.log(('value is ' + (89 > 90)) ? 'A' : 'B'  ) // 结果A
```

### 变量提升

**代码：**

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

**结果：**

`Goodbye Jack`


**分析：**

javascript的变量提升，很简单，就是把变量提升提到函数的top的地方。我么需要说明的是，变量提升 只是提升变量的声明，并不会把赋值也提升上来。所以原代码可以转化为以下句子

```javascript
var name = 'World!';
(function () {
	var name
	// 此时的name并没有赋值,所以typeof name = 'undefined'
    if (typeof name === 'undefined') {
		// 赋值
        name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```


**代码：**

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

**结果：**

`['hello','bye']`

**分析：**

还是变量提升~

```javascript
function foo(a) {
    var a;
	a = arguments[0] = 'hello'
    return a; // hello
}
function bar(a) {
	var a;
	a = arguments[0] = 'hello'
    a = 'bye';
    return a; //bye
}
[foo('hello'), bar('hello')]
```


### js中Number溢出

**代码：**

```javascript
var end = Math.pow(2, 53)
var start = end - 100
var count = 0
for(var i = start; i <= end; i ++){
	count ++
}
console.log(count)

```

**结果：**

额,没有结果...这是个死循环.

**分析：**

JavaScript中所有的数字，无论是整数还是小数，其类型均为Number。在程序内部，Number类型的实质是一个64位的浮点数,问题代码在于`i <= end` , js能表示的最大整数就是`Math.pow(2, 53)`=`9007199254740992`,所以`Math.pow(2, 53) + 1 <= Math.pow(2, 53) === true`

### 稀疏数组

**代码：**

```javascript
var ary = [0,1,2];
ary[10] = undefined;
ary.filter(function(x) { return x === undefined;});
```
**结果：**

`[undefined]`

**分析：**

`filter`的回调函数会智能的跳过稀疏数组~



### 浮点数运算

**代码：**

```javascript
var two   = 0.2
var one   = 0.1
var eight = 0.8
var six   = 0.6
[two - one === one, eight - six === two]
```

**结果：**

`[true,false]`

**分析：**

所谓「计算机浮点数」，其实就是二进制的「科学计数法」。在十进制中，科学计数法的形式是：`m * 10^n`,相应的，二进制的科学计数法就是：`m * 2^n`,所以在js中有些小数能精确表示,有些不能~~~

相关资料可以看这个
[关于JavaScript中计算精度丢失的问题（一）](http://rockyee.iteye.com/blog/891538)



### Switch 选择

**代码：**

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

**结果：**

`Do not know! , Case A`

**分析：**

`new String('A')` 返回 `String {0: "A", length: 1, [[PrimitiveValue]]: "A"}`
`String('A') === 'A'`,`switch` 使用 `=== internally` 和 `new String(x) !== x`


### or 运算符

**代码：**

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

**结果：**

`[true, true, true, false, false]`

**分析：**

```javascript
-9 % 2 = -1
Infinity % 2 = NaN
```

### Array.prototype

**代码：**

`Array.isArray( Array.prototype )`

**结果：**

`true`

**分析：**

Array.prototype 是一个数组,等价于 `Array.prototype = []`

### 比较运算

**代码：**

```javascript
// 1
var a = [0]
if ( a ){
	console.log(a == true)
}else{
	console.log('hello world')
}
// 2
console.log([]==[])

// 3
console.log([[[2]]] == 2)
```

**结果：**

`false,false,true`

**分析：**

1. `Boolean(a) = true`,但是比较字符串的时候 `a.toString() = '0'`,所以 `'0' == true` 为false
2. 这是两份数组,两个数组不能直接比较相等。
3. `[[[2]]].toString() = '2'`

[JavaScript 中的相等性判断](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness)


### arguments 对象

**代码：**

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

**结果：**

`21`

**分析：**

`arguments` 是一个类数组对象。代表传给一个function的参数列表。所以对源代码做如下拆分

```javascript
function sidEffecting(ary) {
  ary[0] = ary[2];
}
function bar() {
//   var a = arguments[0]
//   var b = arguments[1]
  arguments[2] = 10
//   sidEffecting(arguments);// 执行后相当于
  arguments[0] = arguments[2]
  return arguments[0] + arguments[1] + arguments[2]; // 10 + 10 + 1 = 21
}
bar(1,1,1)
```


### Number的toString()

**代码：**

```javascript
console.log(3.toString())
console.log(3..toString())
console.log(3...toString())
```

**结果：**

1. `Uncaught SyntaxError: Invalid or unexpected token`
2. `3`
3. `Uncaught SyntaxError: Unexpected token .`

**分析：**

1. `3.toString()` 是不合法的语句
2. `3..toString()` = `(3.).toString()` 3
3. `3...toString()` = `(3.)..toString()` error


### 对象的prototype

**代码：**

```javascript
var a = {}
var b = Object.prototype;

console.log([a.prototype === b, Object.getPrototypeOf(a) === b])

function f(){}

console.log(f.prototype === Object.getPrototypeOf(f))
```

**结果：**

1. `[false,true]`
2. `false`

**分析：**

`Object.getPrototypeOf()`  方法返回指定对象的原型（也就是该对象内部属性[[Prototype]]的值,
函数有函数有一个原型`prototype`属性，但其他对象的`prototype = undefined`。


### 数组的尾部逗号

**代码：**

`[,,,].join(", ")`

**结果：**

`, , `

**分析：**

标准是规定的是“应该省略最后一个逗号” - -,


### Function.length

**代码：**

`console.log(Function.length,new Function().length)`

**结果：**

`1,0`

**分析：**

`Function.length` 规定是`1`,但是`new Function()`生成的匿名函数`length = 0`

### Math.min 和 Math.max 比较

**代码：**

`console.log(Math.min() < Math.max())`

**结果：**

`false`

**分析：**

当没有传递参数的时候 `Math.min() = Infinity`,`Math.max() = -Infinity`


综上,这个语言的设计从整体上看还是十分健全的....恩,是的,我很欣赏这门语言~~~哈哈
