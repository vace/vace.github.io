---
title: "JavaScript中二进制数据和文件的操作"
date: 2016-01-12
summary: "详解JavaScript中二进制数据处理的演变与现代API，包括Blob、File、FileReader等对象的使用方法及应用场景，附带实用示例代码。"
tags: [JavaScript, 文件处理, Blob, HTML5]
---

> 历史上，JavaScript对二进制数据的处理能力有限。随着ECMAScript 5引入Blob对象及相关API，使得前端直接操作二进制数据和文件成为可能，本文将详细介绍这套强大的工具集及其实际应用场景。

## 二进制数据处理的演进

在HTML5之前，JavaScript处理二进制数据十分有限，开发者只能通过以下方式：

1. 使用`charCodeAt()`方法逐字节从文字编码转为二进制数据
2. 将二进制数据转为Base64编码再处理

这些方法不仅效率低下，而且容易出错。ECMAScript 5引入的Blob对象及相关API，极大地改善了这一情况，使JavaScript能够高效地处理二进制数据。

## 二进制Blob及文件处理相关API

### Blob对象

Blob (Binary Large Object)是表示二进制数据的基础对象，其他文件处理API都基于此构建。

#### Blob构造方法

```javascript
Blob(blobParts[, options])
```

参数说明：
- `blobParts`: 包含实际数据的数组，可以包含`ArrayBuffer`、`ArrayBufferView`、`Blob`或`DOMString`类型的对象
- `options`: 可选配置对象，包含以下属性：
  - `type`: 指定MIME类型，默认为空字符串
  - `endings`: 指定如何处理行结束符，可选值为`"transparent"`(默认)或`"native"`

示例代码：

```javascript
var bolbParts = ['<h1>hello world</h1>'];
var blob = new Blob(bolbParts, { "type": "text/xml" });
```
#### Blob属性

Blob对象有两个只读属性：

- `size`: 二进制数据的大小，单位为字节
- `type`: 二进制数据的MIME类型，全部为小写，未知类型则为空字符串

#### Blob方法

```javascript
Blob.slice([start[, end[, contentType]]])
```

返回一个新的Blob对象，包含原Blob的部分数据。此方法对处理大文件特别有用，可以将其分割成小段逐一处理。

参数说明：
- `start`: 切割起点，默认为0，负值表示从末尾计算
- `end`: 切割终点，默认为`blob.size`，负值表示从末尾计算
- `contentType`: 新Blob的MIME类型，默认为空字符串

### FileList对象

FileList对象表示用户通过`<input type="file">`元素选择的文件列表，或通过拖放操作获得的文件列表。

#### FileList属性

- `length`: 只读属性，返回FileList中File对象的数量

#### FileList方法

- `FileList.item(index)`: 返回指定索引位置的File对象，也可直接使用`fileList[index]`访问

### File对象

File对象是一种特殊的Blob对象，包含额外的文件元信息。可以使用所有Blob对象的属性和方法，并且可以作为参数传递给`FileReader`、`URL.createObjectURL()`、`createImageBitmap()`和`XMLHttpRequest.send()`等API。

#### File属性（只读）

- `name`: 文件名
- `size`: 文件大小（字节）
- `type`: 文件的MIME类型，无法识别则为空字符串
- `lastModified`: 文件的最后修改时间（时间戳）
- `lastModifiedDate`: 文件的最后修改时间（Date对象实例）

#### File方法

继承自Blob对象的`slice`方法。

### FileReader对象

FileReader API用于异步读取文件内容到内存中。它接受File对象或Blob对象作为输入。

#### FileReader构造方法

```javascript
var reader = new FileReader();
```

#### FileReader属性（只读）

- `FileReader.error`: 读取文件时发生的错误，为`DOMError`对象
- `FileReader.readyState`: 表示读取状态的数值：
  
  | 常量 | 值 | 描述 |
  |-----|-----|-----|
  | `FileReader.EMPTY` | 0 | 未加载任何数据 |
  | `FileReader.LOADING` | 1 | 数据正在加载 |
  | `FileReader.DONE` | 2 | 读取操作完成 |

- `FileReader.result`: 读取操作的结果，只在`readyState`为`DONE`时有效

#### FileReader事件

- `onabort`: 读取中断时触发
- `onerror`: 读取出错时触发
- `onload`: 读取成功完成时触发
- `onloadend`: 读取完成时触发（不论成功或失败）
- `onloadstart`: 读取开始时触发
- `onprogress`: 读取过程中周期性触发，可用于显示进度

#### FileReader方法

- `FileReader.abort()`: 中止正在进行的读取操作
- `readAsBinaryString(Blob|File)`: 将数据读取为二进制字符串
- `readAsText(Blob|File, [encoding])`: 将数据读取为文本字符串，默认编码为UTF-8
- `readAsDataURL(Blob|File)`: 将数据读取为Base64编码的data URL
- `readAsArrayBuffer(Blob|File)`: 将数据读取为ArrayBuffer对象

### URL对象

URL对象用于生成指向File或Blob对象的临时URL。

#### 创建对象URL

```javascript
var objectURL = window.URL.createObjectURL(blob);
```

生成的URL格式类似于：`blob:http%3A//example.com/666e6730-f45c-47c1-8012-ccc706f17191`

⚠️ **注意**：每次调用`createObjectURL`都会生成一个新的唯一URL，即使是相同的二进制数据。这些URL会一直有效，直到页面被卸载或手动调用`revokeObjectURL`方法。

#### 释放对象URL

```javascript
window.URL.revokeObjectURL(objectURL);
```

为避免内存泄漏，当不再需要URL时应该调用此方法释放它。

### DataTransfer对象

DataTransfer对象用于在拖放操作中保存被拖动的数据。它可以包含一个或多个数据项和数据类型。

## 实际应用场景

### 1. 本地多图片预览

以下示例展示如何实现选择多张本地图片并预览的功能（按住Ctrl键可多选）：

<iframe width="100%" height="400" src="//jsfiddle.net/vace/67czjbxL/1/embedded/result,js,html,css/dark/" allowFullScreen="allowfullscreen" frameborder="0"></iframe>

实现原理：
1. 监听`input[type="file"]`的`change`事件获取FileList对象
2. 使用FileReader将每个File对象读取为DataURL
3. 将DataURL设置为img元素的src属性实现预览

### 2. 拖放文件预览

以下示例演示如何通过拖放操作预览文件（支持拖放多个文件）：

<iframe width="100%" height="300" src="//jsfiddle.net/vace/g6y57ars/1/embedded/result,js,html,css/dark/" allowFullScreen="allowfullscreen" frameborder="0"></iframe>

实现原理：
1. 监听拖放区域的`dragover`和`drop`事件
2. 从`drop`事件的`dataTransfer.files`属性获取拖放的文件
3. 使用与上一个示例相似的方式预览文件

### 3. 大文件分片上传

以下示例展示如何实现大文件切片上传，支持断点续传（后端采用PHP实现，完整代码参见[GitHub html5upload](https://github.com/vace/html5upload)）：

<iframe width="100%" height="400" src="//jsfiddle.net/vace/7xnymmx8/2/embedded/result,js,html,css/dark/" allowFullScreen="allowfullscreen" frameborder="0"></iframe>

实现原理：
1. 使用`Blob.slice`方法将大文件切分为多个小块
2. 逐个上传这些块，并跟踪上传进度
3. 服务器端接收并合并这些块
4. 通过记录已上传的块信息，支持断点续传功能

## 实现原理

JavaScript二进制处理API主要基于ArrayBuffer作为底层实现。ArrayBuffer表示固定长度的二进制数据缓冲区，而TypedArray和DataView则提供了访问此数据的视图。Blob和File对象则在此基础上提供了更高级的抽象，使开发者可以更方便地处理二进制数据。

### 数据转换流程

下图展示了不同二进制数据格式之间的转换关系：

```
ArrayBuffer ⟷ TypedArray ⟷ DataView
      ↓
     Blob ⟵ String/Array
      ↓
     File
```

## 一些实践总结

1. **内存管理**：处理大型二进制数据时，记得及时释放资源，特别是通过`URL.revokeObjectURL()`释放对象URL
   
2. **性能优化**：
   - 对大文件进行分片处理，避免一次性加载全部内容
   - 优先使用异步API，不阻塞主线程
   
3. **兼容性处理**：
   - 在使用这些API前检查浏览器兼容性
   - 为不支持的浏览器提供适当的降级方案

4. **安全考虑**：
   - 在客户端验证文件类型和大小，但不要仅依赖此验证
   - 服务器端必须再次验证所有上传内容

5. **用户体验**：
   - 对于大文件操作，提供进度指示
   - 实现预览功能提高用户体验
   - 支持拖放功能简化文件选择过程

> 通过合理利用JavaScript二进制处理API，前端应用可以实现许多以前需要后端服务器才能完成的功能，大大提升了Web应用的能力边界和用户体验。



