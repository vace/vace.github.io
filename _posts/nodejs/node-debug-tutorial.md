---
title: "Node.js 调试指南"
date: 2016-11-03
summary: "详解Node.js调试的三种方法：node debugger、node inspector和测试驱动开发，通过实例演示如何高效调试Node应用程序。"
tags: [Node.js, 调试, JavaScript]
---

# Node.js 调试指南

大家对Node.js调试应该都比较头疼，至少我这个不用IDE写js的人很头疼这个。其实Node的生态圈非常好，有很多优秀的工具和现代化的开发方式可以帮助我们进行调试。

本文总结了3种方法和3个实例，希望能对大家有所帮助。

## 三种调试方法

- Node内置调试器（Node debugger）
- Node Inspector可视化调试
- 测试驱动开发（TDD/BDD）

## 三个调试示例

- Hello World基础示例
- JavaScript继承调试示例
- Express应用调试示例

## 1. Node内置调试器

V8 引擎提供了一个强大的调试器，可以通过 TCP 协议从外部访问。Node.js封装了这个调试器，提供了一个内建的调试工具来帮助开发者调试应用程序。开启调试器只需在代码中加入`debugger`标签，当Node.js执行到该标签时会自动暂停（相当于在代码中设置一个断点）。

### 1.1 Hello World调试示例

代码如下（`helloword-debug.js`）：

```javascript
var hello = 'hello';
var world = 'nodejs';

debugger;

var hello_world = hello + ' ' + world;
console.log(hello_world);
```

执行命令：`node debug helloword-debug.js` 进入调试模式。

> ⚠️ 注意：需要在程序代码中手动添加断点`debugger;`，这样当以调试模式运行时，程序会自动在该位置中断。

```bash
node-debug-tutorial git:(master) ✗ node debug helloword-debug.js
< debugger listening on port 5858
connecting... ok
break in helloword-debug.js:1
  1 var hello = 'hello';
  2 var world = 'nodejs';
  3 
debug> help
Commands: run (r), cont (c), next (n), step (s), out (o), backtrace (bt), setBreakpoint (sb), clearBreakpoint (cb),
watch, unwatch, watchers, repl, restart, kill, list, scripts, breakOnException, breakpoints, version
debug> 
debug> n
break in helloword-debug.js:2
  1 var hello = 'hello';
  2 var world = 'nodejs';
  3 
  4 debugger;
debug> repl
Press Ctrl + C to leave debug repl
> hello
'hello'
```

此时`repl`命令打开了JavaScript上下文即时求值环境，与Chrome调试器中的console功能类似。

如果想退出REPL模式，按下`Ctrl + C`即可返回到debug模式：

```bash
debug> n
break in helloword-debug.js:4
  2 var world = 'nodejs';
  3 
  4 debugger;
  5 
  6 var hello_world = hello + ' ' + world;
debug> n
break in helloword-debug.js:6
  4 debugger;
  5 
  6 var hello_world = hello + ' ' + world;
  7 console.log(hello_world);
  8 
debug> n
break in helloword-debug.js:7
  5 
  6 var hello_world = hello + ' ' + world;
  7 console.log(hello_world);
  8 
  9 });
debug> repl
Press Ctrl + C to leave debug repl
> hello_world
'hello nodejs'
> 
end
```

如果想终止调试，连续按两次`Ctrl + C`键即可。

### 1.2 调试命令说明

| 命令 | 用途 | 
|-------|------------| 
| `run`, `r` | 执行脚本，在第一行暂停 | 
| `restart` | 重新执行脚本 | 
| `cont`, `c` | 继续执行，直到遇到下一个断点 | 
| `next`, `n` | 单步执行 | 
| `step`, `s` | 单步执行并进入函数 | 
| `out`, `o` | 从函数中步出 | 
| `setBreakpoint()`, `sb()` | 在当前行设置断点 | 
| `setBreakpoint('f()')`, `sb(...)` | 在函数f的第一行设置断点 | 
| `setBreakpoint('script.js', 20)`, `sb(...)` | 在script.js的第20行设置断点 | 
| `clearBreakpoint`, `cb(...)` | 清除所有断点 | 
| `backtrace`, `bt` | 显示当前的调用栈 | 
| `list(5)` | 显示当前执行到的前后5行代码 | 
| `watch(expr)` | 把表达式expr加入监视列表 | 
| `unwatch(expr)` | 把表达式expr从监视列表移除 | 
| `watchers` | 显示监视列表中所有的表达式和值 | 
| `repl` | 在当前上下文打开即时求值环境 | 
| `kill` | 终止当前执行的脚本 | 
| `scripts` | 显示当前已加载的所有脚本 | 
| `version` | 显示V8版本 | 

> Node.js调试器的设计类似于GDB等传统调试器，熟悉这些工具的开发者可以很快上手。

回顾一下，Node.js调试有两种主要模式：

- JavaScript上下文即时求值环境模式（REPL）
- Debug断点模式

> 八卦：这与vi编辑器的三种工作模式（普通模式、插入模式和命令行模式）有异曲同工之妙。

更多调试信息可以参考[Node.js debugger官方文档](http://nodejs.org/api/debugger.html)

### 1.3 故障排除

如果遇到以下错误：

```
< Failed to open socket on port 5858, waiting 1000 ms before retrying
```

请终止所有debug进程：

```bash
ps -ef|grep debug-brk|awk '{print $2}'|xargs kill -9
```

## 2. Node Inspector可视化调试

作为前端开发人员，我们习惯于使用Chrome DevTools或Firefox的调试工具进行JavaScript调试。Node Inspector允许我们使用熟悉的浏览器调试界面来调试Node.js程序。

Node Inspector通过WebSocket方式转发debug输入输出，因此在调试前需要先启动Node Inspector服务来监听Node.js的调试端口。

### 2.1 安装Node Inspector

使用npm全局安装：

```bash
npm install -g node-inspector
```

安装完成后，可以在后台启动服务：

```bash
node-inspector &
```

默认会监听8080端口，也可以通过`--web-port`参数修改端口号。然后，在执行Node.js程序时添加`--debug-brk`参数：

```bash
node --debug-brk app.js
```

或者直接使用：

```bash
node-debug app.js
```

控制台将显示"debugger listening on port 5858"，然后打开浏览器访问`http://localhost:8080/debug?port=5858`，就会看到类似Chrome DevTools的调试界面，代码会在第一行自动断点。

### 2.2 常用调试功能

- 添加/移除断点
- 查看调用栈和变量
- 使用console打印调试信息
- 单步执行、步入、步出等操作

> 使用方法与Chrome的开发者工具（F12）调试网页基本一致，非常适合前端开发人员上手。

Node Inspector支持远程调试。只需将localhost替换为对应的IP地址即可（注意检查服务器防火墙设置）。

### 2.3 调试继承示例

测试JavaScript的继承实现，先看输出结果：

```bash
➜  node-debug-tutorial git:(master) node extend.js 
node debug
hello node debug
```

使用Node Inspector进行调试：

```bash
➜  node-debug-tutorial git:(master) node-debug extend.js
Node Inspector is now available from http://localhost:8080/debug?port=5858
Debugging `extend.js`

debugger listening on port 5858
```

#### 2.3.1 调试界面说明

Mac系统按键说明：

| 符号 | 按键 | 
|:---------:|:-----------:|
| &#8984; | Command键 |
| &#8963; | Control键 |
| &#8997; | Option键 |
| &#8679; | Shift键 |

断点操作按键：

- 继续执行（F8）：跳过当前断点，执行到下一个断点
- 单步跳过（F10）：执行下一行代码，不进入函数内部
- 单步进入（F11）：进入函数内部执行
- 单步跳出（Shift + F11）：从当前函数返回到调用处

#### 2.3.2 调试案例：检查继承实现

添加断点并观察`this`对象：

执行下一步，再次查看`this`对象：

#### 2.3.3 结论

通过调试可以清晰看到`base.call(this);`这行代码的作用：它使test对象获得了base对象的所有属性和方法，实现了继承。这是JavaScript中实现继承的基本方式之一，也可以用于实现多重继承（Mixin模式）。

### 2.4 调试Express应用

API调试通常需要检查request对象中的params、query和body等属性。

#### 2.4.1 准备工作

```bash
npm init .
npm install --save express
touch express-helloworld.js
```

创建Express示例代码（express-helloworld.js）：

```javascript
var express = require('express');
var app = express();

app.get('/',function(req,res){
    res.send('hello,world');
});

app.listen(5008);
```

安装服务器自动重载模块：

```bash
npm install -g supervisor
supervisor express-helloworld.js
```

打开浏览器访问`http://127.0.0.1:5008/`即可看到"hello,world"响应。

使用`Ctrl + C`停止supervisor，然后使用Node Inspector调试：

```bash
➜  node-debug-tutorial git:(master) ✗ node-debug express-helloworld.js 
Node Inspector is now available from http://localhost:8080/debug?port=5858
Debugging `express-helloworld.js`

debugger listening on port 5858
```

在路由处理函数处添加断点：

使用curl模拟GET请求（增加一个test参数便于调试）：

```bash
curl -G -d "test=string" http://127.0.0.1:5008/
```

此时浏览器调试窗口会停在断点处，在console中输入`req.query`可以查看请求参数：

## 3. 测试驱动开发

除了直接调试，测试驱动开发（TDD）和行为驱动开发（BDD）也是调试和验证代码的有效方法。

### 3.1 测试框架

常用的Node.js测试框架：

- nodeunit：简单易用的单元测试框架
- mocha：功能丰富的JavaScript测试框架

### 3.2 更多测试工具

```bash
npm install --save-dev chai       # 断言库
npm install --save-dev sinon      # 测试桩和Mock框架
npm install --save-dev supertest  # HTTP测试
npm install --save-dev zombie     # 无头浏览器测试
```

### 3.3 代码覆盖率测试

使用Gulp自动化测试流程：

```bash
npm install --save-dev gulp
npm install --save-dev gulp-mocha
npm install --save-dev gulp-istanbul
```

创建gulpfile.js：

```javascript
var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha'); 

gulp.task('test', function (cb) {
  gulp.src(['db/**/*.js'])
    .pipe(istanbul()) // Covering files
    .on('finish', function () {
      gulp.src(['test/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports()) // Creating the reports after tests runned
        .on('end', cb);
    });
});

gulp.task('default',['test'], function() {
  gulp.watch(['./db/**/*','./test/**/*'], ['test']);
});

gulp.task('watch',['test'], function() {
  gulp.watch(['./db/**/*','./test/**/*'], ['test']);
});
```

运行测试：

```bash
node_modules/.bin/gulp
```

这样，修改测试文件或源文件时会自动触发测试。如果只想执行一次测试：

```bash
node_modules/.bin/gulp test
```

> 如果不熟悉Gulp，可以在[这里](https://github.com/i5ting/js-tools-best-practice/blob/master/doc/Gulp.md)学习更多内容。

修改package.json添加测试脚本：

```json
"scripts": {
  "start": "./node_modules/.bin/supervisor ./bin/www",
  "test": "./node_modules/.bin/mocha -u tdd"
}
```

## 参考资源

- [debugger官方文档](http://nodejs.org/api/debugger.html)
- [node-inspector仓库地址](https://github.com/node-inspector/node-inspector)
- [nodeunit](https://github.com/caolan/nodeunit)
- [mocha](https://github.com/mochajs/mocha)
- [chai断言库](https://github.com/chaijs/chai)
- [sinon.js](http://sinonjs.org/)
- [zombie.js](http://zombie.labnotes.org/)
- [supertest API测试](https://github.com/tj/supertest)
- [Gulp指南](https://github.com/i5ting/js-tools-best-practice/blob/master/doc/Gulp.md)