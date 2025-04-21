---
title: "Linux Shell命令备忘录：find和exec组合使用技巧"
date: 2023-02-10
summary: "详解Linux中find命令与exec组合使用的语法和实用案例，包括批量文件操作、扩展名修改和大文件删除等常见任务的命令示例和实践指南。"
tags: [Linux, Shell, CLI, DevOps]
---

## find与exec命令组合详解

`find`命令结合`exec`可以实现强大的文件批量处理功能。掌握这组合是Shell编程的基本技能。

### 基本语法

`find`和`exec`命令组合使用有两种基本语法形式:

```sh
find [path] [arguments] -exec [command] {} \;
```

或者:

```sh
find [path] [arguments] -exec [command] {} +
```

语法要点:
- `[command]` 是对find命令结果要执行的操作
- `{}` 是占位符，代表find命令的每个搜索结果
- `\;` 表示每找到一个文件就执行一次命令，需要转义`;`避免shell提前解释
- `+` 表示将所有结果作为参数一次性传递给命令，提高执行效率

### 常用组合示例

#### 文件复制

将当前目录下所有HTML文件复制到指定目录:

```sh
# 从当前目录递归查找制定后缀文件，并拷贝到某目录中
find . -name "*.html" -exec cp {} ./html/ \;
```

#### 批量更改文件扩展名

将所有txt文件重命名为js文件:

```sh
# 以下命令将会修改当前目录的所有*.txt文件扩展名为.js
find . -name '*.txt' -exec sh -c 'mv "$1" "${1%.txt}.js"' _ {} \;
```

<Callout type="info">
这里使用`sh -c`是因为需要用到shell的字符串替换功能`${1%.txt}`，它会去除文件名中的`.txt`后缀。
</Callout>

#### 删除大文件

删除桌面上大于100MB的文件:

```sh
# 删除大于100 MB的文件
find ~/Desktop -size +100M -exec rm {} \;
```

## 高级用法提示

- 添加`-print`参数可以在执行前先显示匹配的文件
- 使用`-ok`代替`-exec`会在每次执行操作前请求用户确认
- 搭配`xargs`可以进一步控制并行执行和参数传递方式

<Callout type="warning">
删除文件时建议先用`-exec echo`或`-print`预览将被操作的文件，以防错误删除重要数据。
</Callout>