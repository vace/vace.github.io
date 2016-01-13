---
layout: post
title:  javascript中二进制数据和文件的操作
categories: [前端]
tags: [javascript,html5,Blob,FileReader]
---

历史上，JavaScript无法处理二进制数据。如果一定要处理的话，只能使用`charCodeAt()`方法，一个个字节地从文字编码转成二进制数据，还有一种办法是将二进制数据转成Base64编码，再进行处理。这两种方法不仅速度慢，而且容易出错。ECMAScript 5引入了Blob对象，允许直接操作二进制数据。

Blob对象是一个代表二进制数据的基本对象，在它的基础上，又衍生出一系列相关的API，用来操作文件。



## 二进制Blob以及相关文件处理对象介绍
### Blob对象

**(1) 构造方法**

`Blob(blobParts[, options])`,返回一个新创建的`Blob`对象,`blobParts`是一个包含实际数据的数组，第二个参数是数据的类型，这两个参数都不是必需的。
`blobParts`的数组类型也可以是`ArrayBuffer`, `ArrayBufferView`, `Blob`, `DOMString` `objects`
`options` 包括 `type`(默认为空,blob中的数组元素的MIME类型。),`endings`(默认为`transparent`,还有个值`native`)

```javascript
var bolbParts = ['<h1>hello world</h1>'];
var blob = new Blob(bolbParts,{ "type" : "text\/xml" });
```

![blob对象]({{site.image}}/blog/8EB738BF-8108-4C2D-8A15-CAE8DD2380BC.png)

**(2) bolb的属性**
Blob对象有两个只读属性：

* `size`：二进制数据的大小，单位为字节。
* `type`：二进制数据的MIME类型，全部为小写，如果类型未知，则该值为空字符串。

**(3) bolb的方法**
`Blob.slice([start[, end[, contentType]]])`,用于切割blob对象,返回一个新的Blob对象,读取大文件的时候，可以利用Blob对象的slice方法，将大文件分成小段，逐一读取，这样可以加快处理速度.

`var blob1 = bolb.slice([start [, end [, contentType]]]);`

* start切割起点,默认为0,如果<0则从blob对象末尾计算
* end 切割终点,默认值为 blob.size,<0从blob对象末尾计算
* contentType 给切割后的blob重新设置type,默认为空


### FileList对象

FileList对象针对表单的file控件。当用户通过file控件选取文件后，这个控件的files属性值就是FileList对象。它在结构上类似于数组，包含用户选取的多个文件。也被用于使用拖放对象的API将文件列表放入web。可以查看 `DataTransfer`对象

**(1) 属性**
`length` 只读属性,返回FlieList中File对象的数量

**(2) 方法**
`FileList.item(index)` 返回fileList对象中索引为`index`的File对象,从0开始,也可以直接使用 fileList[index]访问

### File API
其实File对象就是一种特殊的`Blob`对象,所以可以使用Blob对象的属性和方法,尤其是, `FileReader`, `URL.createObjectURL()`, `createImageBitmap()`,`XMLHttpRequest.send()` 都可以接受`Files`对象和`Bolb对象`
File API提供`File`对象，它是FileList对象的成员，包含了文件的一些元信息，比如文件名、上次改动时间、文件大小和文件类型。

**(1) 属性 (属性都是只读的)**

 * name：文件名，该属性只读。
 * size：文件大小，单位为字节，该属性只读。
 * type：文件的MIME类型，如果分辨不出类型，则为空字符串，该属性只读。
 * lastModified：文件的上次修改时间，格式为时间戳。
 * lastModifiedDate：文件的上次修改时间，格式为Date对象实例。


**(2) 方法**
`Blob.slice([start[, end[, contentType]]])` 详细可以看`Blob`对象的slice方法,一样的

### FileReader对象
FileReader API用于读取文件，即把文件内容读入内存。它的参数是File对象或Blob对象。

对于不同类型的文件，FileReader提供不同的方法读取文件。

**(1) 构造方法**
`var reader = new FileReader()`构建一个FileReader对象

**(2) 属性(只读)**

* `FileReader.error` 当读取文件发生错误时会抛出`DOMError`错误
* `FileReader.readyState` 文件读取状态,包含以下可能的值:

| key        | 数值   |  含义  |
| :--------   | :-----:| :----:  |
| `FileReader.EMPTY`      |   0   |   没有载入任何数据     |
| `FileReader.LOADING`    |   1   |   数组正在载入   |
| `FileReader.DONE`       |   2   |   整个读取请求已经完成  |

* `FileReader.result` 当前的fileReader对象的内容,只能在FileReader.readyState 为 DONE才有效,格式化的数据与读取数据的方法有关

**(3) 事件**
FileReader对象采用异步方式读取文件，可以为一系列事件指定回调函数。

* FileReader.onabort方法：读取中断或调用reader.abort()方法时触发。
* FileReader.onerror方法：读取出错时触发。
* FileReader.onload方法：读取成功后触发。
* FileReader.onloadend方法：读取完成后触发，不管是否成功。触发顺序排在 onload 或 onerror 后面。
* FileReader.onloadstart方法：读取将要开始时触发。
* FileReader.onprogress方法：读取过程中周期性触发。

**(4) 方法**

* `FileReader.abort()`终止正在读取的操作,并让readyState=DONE
* `readAsBinaryString(Blob|File)`：返回二进制字符串，该字符串每个字节包含一个0到255之间的整数。
* `readAsText(Blob|File, opt_encoding)：`返回文本字符串。默认情况下，文本编码格式是'UTF-8'，可以通过可选的格式参数，指定其他编码格式的文本。
* `readAsDataURL(Blob|File)`：返回一个基于Base64编码的data-uri对象。
* `readAsArrayBuffer(Blob|File)`：返回一个ArrayBuffer对象。

### URL对象
URL对象用于生成指向File对象或Blob对象的URL。

```javascript
var objecturl =  window.URL.createObjectURL(blob);
```

上面的代码会对二进制数据生成一个URL，类似于“blob:http%3A//test.com/666e6730-f45c-47c1-8012-ccc706f17191”。这个URL可以放置于任何通常可以放置URL的地方，比如img标签的src属性。需要注意的是，即使是同样的二进制数据，每调用一次URL.createObjectURL方法，就会得到一个不一样的URL。

这个URL的存在时间，等同于网页的存在时间，一旦网页刷新或卸载，这个URL就失效。除此之外，也可以手动调用URL.revokeObjectURL方法，使URL失效。

```javascript
window.URL.revokeObjectURL(objectURL);
```

**(1) 构造方法**

```javascript
url = new URL(urlString, [baseURLstring])
url = new URL(urlString, baseURLobject)
```

**(2) 属性和方法**
URL对象属性和方法继承`URLUtils`,具体可以自行查找`URLUtils`的属性

**(3) 静态方法**

`objectURL = URL.createObjectURL(blob);`参数是一个`File`或者`Blob`对象

window.URL.revokeObjectURL(objectURL); 卸载objectURL对象

###DataTransfer对象
DataTransfer对象用来保存拖放操作时被拖动的数据。它可能包含一个或多个数据项,一个或多个数据类型。关于拖拽的更多信息,可以查看`Drag`和`Drop`的API

![属性和API]({{site.image}}/blog/79A55477-26AE-4433-9296-83F00000083B.png)

## 应用场景

1.读取并且预览本地的多张图片(按住ctrl键多选)
<iframe width="100%" height="400" src="//jsfiddle.net/vace/67czjbxL/1/embedded/result,js,html,css/dark/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

2.拖动并且预览文件(支持拖动多个文件)

<iframe width="100%" height="300" src="//jsfiddle.net/vace/g6y57ars/1/embedded/result,js,html,css/dark/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

3.读取剪切板中文件

TODO....




