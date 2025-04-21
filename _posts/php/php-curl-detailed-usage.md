---
title: "PHP cURL详解与实战：从基础用法到自定义类实现"
date: 2016-01-23
summary: "深入介绍PHP cURL库的各种用法，包含常用参数详解、请求封装、认证连接、Cookie操作及文件下载，并展示如何构建链式调用的cURL工具类。"
tags: [PHP, Web]
---

## 简介

在PHP中处理远程内容获取时，简单场景可以使用`file_get_contents`函数，但遇到复杂的`HTTP POST`、`HTTP PUT`、`FTP 上传`等操作时，我们需要更强大的工具。PHP提供的cURL扩展正好满足这些需求，以下是官方文档的介绍：

> PHP支持的由Daniel Stenberg创建的libcurl库允许你与各种的服务器使用各种类型的协议进行连接和通讯。libcurl目前支持http、https、ftp、gopher、telnet、dict、file和ldap协议。libcurl同时也支持HTTPS认证、HTTP POST、HTTP PUT、FTP 上传(这个也能通过PHP的FTP扩展完成)、HTTP 基于表单的上传、代理、cookies和用户名+密码的认证。

## cURL常量与配置选项

cURL提供了大量配置选项，下面将根据不同类型进行分类介绍：

### 1. 常用布尔值选项

`CURLOPT_AUTOREFERER` ：当返回的信息头含有转向信息时，自动设置前向连接  
`CURLOPT_BINARYTRANSFER` ：在使用CURLOPT_RETURNTRANSFER时，返回原始的输出  
`CURLOPT_COOKIESESSION` ：标志为新的cookie会话，忽略之前设置的cookie会话  
`CURLOPT_CRLF` ：将Unix系统的换行符转换为Dos换行符  
`CURLOPT_DNS_USE_GLOBAL_CACHE` ：使用全局的DNS缓存  
`CURLOPT_FAILONERROR` ：忽略返回错误  
`CURLOPT_FILETIME` ：获取请求文档的修改日期，该日期可以用curl_getinfo()获取  
`CURLOPT_FOLLOWLOCATION` ：紧随服务器返回的所有重定向信息  
`CURLOPT_FORBID_REUSE` ：当进程处理完毕后强制关闭会话，不再缓存供重用  
`CURLOPT_FRESH_CONNECT` ：强制建立一个新的会话，而不是重用缓存的会话  
`CURLOPT_HEADER` ：在返回的输出中包含响应头信息  
`CURLOPT_HTTPGET` ：设置HTTP请求方式为GET  
`CURLOPT_HTTPPROXYTUNNEL` ：经由一个HTTP代理建立连接  
`CURLOPT_NOBODY` ：返回的输出中不包含文档信息  
`CURLOPT_NOPROGRESS` ：禁止进程级别传输，PHP自动设为真  
`CURLOPT_NOSIGNAL` ：忽略所有发往PHP的信息  
`CURLOPT_POST` ：设置POST方式提交数据，POST格式为application/x-www-form-urlencoded  
`CURLOPT_PUTTRUE` ：设置PUT方式上传文件，同时设置CURLOPT_INFILE和CURLOPT_INFILESIZE  
`CURLOPT_RETURNTRANSFER` ：返回字符串，而不是调用curl_exec()后直接输出  
`CURLOPT_SSL_VERIFYPEER` ：SSL验证开启  
`CURLOPT_UNRESTRICTED_AUTH` ：一直链接后面附加用户名和密码，同时设置CURLOPT_FOLLOWLOCATION  
`CURLOPT_UPLOAD` ：准备上传  

### 2. 整数值选项

`CURLOPT_BUFFERSIZE` ：缓存大小  
`CURLOPT_CONNECTTIMEOUT` ：连接时间设置，默认0为无限制  
`CURLOPT_DNS_CACHE_TIMEOUT` ：内存中保存DNS信息的时间，默认2分钟  
`CURLOPT_INFILESIZE` ：上传至远程站点的文件尺寸  
`CURLOPT_LOW_SPEED_LIMIT` ：传输最低速度限制  
`CURLOPT_LOW_SPEED_TIME` ：传输时间限制  
`CURLOPT_MAXCONNECTS` ：最大持久连接数  
`CURLOPT_MAXREDIRS` ：最大转向数  
`CURLOPT_PORT` ：连接端口  
`CURLOPT_PROXYAUTH` ：代理服务器验证方式  
`CURLOPT_PROXYPORT` ：代理服务器端口  
`CURLOPT_PROXYTYPE` ：代理服务器类型  
`CURLOPT_TIMEOUT` ：CURL函数的最大执行时间  

### 3. 字符串选项

`CURLOPT_COOKIE` ：HTTP头中set-cookie中的cookie信息  
`CURLOPT_COOKIEFILE` ：包含cookie信息的文件，cookie文件的格式可以是Netscape格式,或者只是HTTP头的格式  
`CURLOPT_COOKIEJAR` ：连接结束后保存cookie信息的文件  
`CURLOPT_CUSTOMREQUEST` ：自定义请求头，使用相对地址  
`CURLOPT_ENCODING` ：HTTP请求头中Accept-Encoding的值  
`CURLOPT_POSTFIELDS` ：POST格式提交的数据内容(也可以是数组)  
`CURLOPT_PROXY` ：代理通道  
`CURLOPT_PROXYUSERPWD` ：代理认证用户名和密码  
`CURLOPT_RANGE` ：返回数据的范围,以字节计算  
`CURLOPT_REFERER` ：前向链接  
`CURLOPT_URL` ：要连接的URL地址，可以在curl_init()中设置  
`CURLOPT_USERAGENT` ：HTTP头中User-Agent的值  
`CURLOPT_USERPWD` ：连接中使用的验证信息  

### 4. 数组选项

`CURLOPT_HTTP200ALIASES`：200响应码数组，数组中的响应码被认为是正确的响应  
`CURLOPT_HTTPHEADER`：自定义请求头信息  

### 5. 流句柄选项

`CURLOPT_FILE`：传输要写入的文件句柄，默认是标准输出  
`CURLOPT_INFILE`：传输要读取的文件句柄  
`CURLOPT_STDERR`：作为标准错误输出的一个替换选项  
`CURLOPT_WRITEHEADER`：传输头信息要写入的文件  

### 6. 回调函数选项

`CURLOPT_HEADERFUNCTION`：拥有两个参数的回调函数，第一个参数是会话句柄，第二参数是HTTP响应头信息的字符串。响应头信息按行返回。设置返回值为字符串长度。  
`CURLOPT_READFUNCTION`：拥有两个参数的回调函数，第一个参数是会话句柄，第二参数是HTTP响应内容。自行处理返回的数据。返回值为数据尺寸。  
`CURLOPT_WRITEFUNCTION`：拥有两个参数的回调函数，第一个参数是会话句柄，第二参数是HTTP响应数据。自行处理响应数据。响应数据是整个字符串。设置返回值为字符串长度。  

### 7. curl_getinfo中使用的常量

`CURLINFO_EFFECTIVE_URL` - 最后一个有效的URL地址  
`CURLINFO_HTTP_CODE` - 最后一个收到的HTTP代码  
`CURLINFO_FILETIME` - 远程获取文档的时间，如果无法获取，则返回值为"-1"  
`CURLINFO_TOTAL_TIME` - 最后一次传输所消耗的时间  
`CURLINFO_NAMELOOKUP_TIME` - 名称解析所消耗的时间  
`CURLINFO_CONNECT_TIME` - 建立连接所消耗的时间  
`CURLINFO_PRETRANSFER_TIME` - 从建立连接到准备传输所使用的时间  
`CURLINFO_STARTTRANSFER_TIME` - 从建立连接到传输开始所使用的时间  
`CURLINFO_REDIRECT_TIME` - 在事务传输开始前重定向所使用的时间  
`CURLINFO_SIZE_UPLOAD` - 上传数据量的总值  
`CURLINFO_SIZE_DOWNLOAD` - 下载数据量的总值  
`CURLINFO_SPEED_DOWNLOAD` - 平均下载速度  
`CURLINFO_SPEED_UPLOAD` - 平均上传速度  
`CURLINFO_HEADER_SIZE` - header部分的大小  
`CURLINFO_HEADER_OUT` - 发送请求的字符串  
`CURLINFO_REQUEST_SIZE` - 在HTTP请求中有问题的请求的大小  
`CURLINFO_SSL_VERIFYRESULT` - 通过设置CURLOPT_SSL_VERIFYPEER返回的SSL证书验证请求的结果  
`CURLINFO_CONTENT_LENGTH_DOWNLOAD` - 从Content-Length: field中读取的下载内容长度  
`CURLINFO_CONTENT_LENGTH_UPLOAD` - 上传内容大小的说明  
`CURLINFO_CONTENT_TYPE` - 下载内容的Content-Type:值，NULL表示服务器没有发送有效的Content-Type: header  

## cURL 函数列表

PHP提供了一系列操作cURL的函数，以下是常用的cURL函数：

`void curl_close ( resource $ch )` — 关闭一个cURL会话并且释放所有资源。cURL句柄ch 也会被释放。  
`resource curl_copy_handle ( resource $ch )` — 复制一个cURL句柄和它的所有选项(保持相同的选项)。  
`int curl_errno ( resource $ch )` — 返回最后一次的错误号。  
`string curl_error ( resource $ch )` — 返回一个保护当前会话最近一次错误的字符串。  
`string curl_escape ( resource $ch , string $str )` — 该函数使用 URL 根据[» RFC 3986](http://www.faqs.org/rfcs/rfc3986)编码给定的字符串。  
`mixed curl_exec ( resource $ch )` — 执行一个cURL会话(这个函数应该在初始化一个cURL会话并且全部的选项都被设置后被调用)。  
`mixed curl_file_create(string $filename[, string $mimetype][,string $postname])` — 创建一个 CURLFile 对象。  
`mixed curl_getinfo ( resource $ch [, int $opt = 0 ] )` — 获取一个cURL连接资源句柄的信息。  
`resource curl_init ([ string $url = NULL ] )` — 初始化一个cURL会话,供curl_setopt(), curl_exec()和curl_close() 函数使用。  

更多函数包括多句柄操作、共享句柄等，可以参考[PHP官方文档](https://www.php.net/manual/en/book.curl.php)获取完整列表。

## 实战应用场景

### 1. 构造一个简单的GET请求

以下代码展示如何使用cURL抓取网页内容：

```php
function curl_get($url=''){
    //初始化一个cURL会话
    $ch = curl_init();
    curl_setopt_array($ch, [
        //作用是让curl_exec返回字符串,而不是直接输出
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_URL => $url
    ]);
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}
echo curl_get('http://www.example.com/');
```

> ⚠️ 注意：使用cURL进行网络请求时应注意超时设置，避免长时间阻塞PHP进程。

### 2. 构造一个简单的POST请求

POST请求常用于表单提交和API调用，下面是一个提交数据的例子：

```php
function curl_post($url,$data=[]){
    $ch = curl_init();
    curl_setopt_array($ch,[
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_URL => $url,
        CURLOPT_POSTFIELDS => $data
    ]);
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

$post = curl_post('http://httpbin.org/post',['username'=>'vace','age'=>23]);

print_r($post);
```

运行结果:

```json
{
  "form": {
    "age": "23", 
    "username": "vace"
  }, 
  ...
}
```

### 3. HTTP 认证连接

某些API需要基本认证（Basic Authentication）才能访问，可以这样实现：

```php
function curl_auth($url,$user,$passwd){
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_USERPWD => $user.':'.$passwd,
        CURLOPT_URL     => $url,
        CURLOPT_RETURNTRANSFER => true
    ]);
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

$authurl = 'http://httpbin.org/basic-auth/vace/passwd';

echo curl_auth($authurl,'vace','passwd');
```

返回结果:

```json
{
  "authenticated": true, 
  "user": "vace"
}
```

### 4. Cookie操作与保存

在Web应用中，Cookie处理是很常见的需求，以下展示如何使用cURL操作Cookie：

```php
/**
 * [curl_cookies 使用curl发送和保存cookies]
 * @param  string $url       访问URL
 * @param  string $save_path cookies的保存地址
 * @return string            设置cookies后的内容
 */
function curl_cookies($url,$save_path){
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_URL => $url,
        CURLOPT_COOKIEJAR => $save_path,  // 保存Cookie
        CURLOPT_COOKIEFILE => $save_path  // 读取Cookie
    ]);
    $result = curl_exec($ch);
    curl_close($ch);

    return $result;
}
echo curl_cookies('http://httpbin.org/cookies/set?cookie1=vace','./cookies.log');
```

执行后，在脚本运行目录会生成`cookies.log`文件，内容格式如下：

```
# Netscape HTTP Cookie File
# http://curl.haxx.se/docs/http-cookies.html
# This file was generated by libcurl! Edit at your own risk.
httpbin.org	FALSE	/	FALSE	0	cookie1	vace
```

### 5. 文件下载功能

cURL可以很方便地实现文件下载功能：

```php
/**
 * [curl_download 下载远程文件]
 * @param  string $url      远程地址
 * @param  string $savename 保存本地文件名
 * @return void
 */
function curl_download($url,$savename){
    $fp = fopen($savename, 'w');
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_FILE => $fp,     // 将输出写入文件
        CURLOPT_HEADER => 0      // 不包含头信息
    ]);
    curl_exec($ch);
    curl_close($ch);
    fclose($fp);
}

curl_download('http://httpbin.org/image/png','./down.png');
```

> 💡 上述代码执行后，将在代码目录下载并保存一个名为`down.png`的图片文件。

## 实现原理：自定义cURL类

为了简化cURL的使用，我们可以封装一个支持链式调用的cURL类，提供更友好的接口。

### 使用示例

```php
// 1.GET请求示例
echo Curl::get('http://www.example.com/')->send();

// 2.POST请求示例
print_r( Curl::post('http://httpbin.org/post')->setData(['username'=>'vace','age'=>23])->send() );

// 3.基本认证示例
echo Curl::get('http://httpbin.org/basic-auth/vace/passwd')->setAuth('vace','passwd')->send();

// 4.Cookie操作示例
echo Curl::get('http://httpbin.org/cookies/set?cookie1=vace')->useCookies('./cookies.log')->send();

// 5.文件下载示例
Curl::get('http://httpbin.org/image/png')->download('./test.png')->send();
```

### 实现代码

下面是一个支持链式调用的cURL类实现：

```php
class Curl{
    /**
     * [__callStatic 调用方法请求数据]
     * @param  string $method [allMethod key]
     * @param  array $url    [请求url地址]
     * @return object        [Curl对象]
     */
    public static function __callStatic($method,$url){
        $methods = static::$allMethod;
        if(!array_key_exists($method, $methods)){
            throw new \InvalidArgumentException("Method {$method} not valid HTTP method", 1);    
        }
        return new self($method,$url[0]);
    }
    /**
     * [$allMethod 全部访问方法]
     * @var array
     */
    public static $allMethod = [
        'get'     => false,
        'head'    => false,
        'post'    => true,
        'put'     => true,
        'patch'   => true,
        'delete'  => false,
        'options' => false
    ];
    /**
     * [$url 请求url]
     * @var string
     */
    private $url;
    /**
     * [$method 请求方法]
     * @var string
     */
    private $method;
    /**
     * [$headers curl header]
     * @var array
     */
    private $headers = [];
    /**
     * [$cookies cookies信息]
     * @var array
     */
    private $cookies = [];
    /**
     * [$data 设置数据]
     * @var array
     */
    private $data = [];

    /**
     * [$option curl opt 参数]
     * @var array
     */
    private $option = [];

    /**
     * [$auth 认证信息]
     * @var mixed
     */
    private $auth = false;
    /**
     * [$ch curl_init 句柄]
     * @var resource
     */
    private $ch;
    
    /**
     * [__construct 构造函数]
     * @param string $method HTTP方法
     * @param string $url    请求URL
     */
    private function __construct($method,$url){
        $this->url = $url;
        $this->method = $method;
    }

    // 各种getter/setter方法
    // ...existing code...

    /**
     * [send 执行cURL请求]
     * @return mixed 请求结果
     */
    public function send(){
        $this->ch = curl_init();

        $strings = [];
        foreach ($this->cookies as $key => $value) {
            $strings[] = "{$key}={$value}";
        }
        if(!empty($strings)) $this->setHeader('cookie',implode(';', $strings));


        $option = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_URL => $this->url,
            CURLOPT_HTTPHEADER => $this->headers
        ];

        $method = $this->method;

        if ($method === 'post') {
            $option[CURLOPT_POST] = true;
        } elseif ($method !== 'get') {
            $option[CURLOPT_CUSTOMREQUEST] = $method;
        }


        //auth
        if(false !== $this->auth){
            $option[CURLOPT_USERPWD] = $this->auth;
        }

        //postdata
        if (static::$allMethod[$method] === true) {
            $option[CURLOPT_POSTFIELDS] = $this->data;
        }

        //cookies
        if(false !== $this->cookies_path){
            $option[CURLOPT_COOKIEJAR] = $option[CURLOPT_COOKIEFILE] = $this->cookies_path;
        }
        
        //download
        $filename = $this->download_file;
        if($filename){
            if(!$filename) throw new \Exception("use ->download(filename)", 1);
            $fp = fopen($filename, 'w');
            $option[ CURLOPT_FILE ] = $fp;
        }

        //合并配置
        $option = $option + $this->option;
        curl_setopt_array($this->ch,$option);

        $result = curl_exec($this->ch);

        curl_close($this->ch);
        if($filename){
            fclose($fp);
        }
        return $result;
    }
}
```

## 其他事项

在使用PHP cURL时，应遵循以下最佳实践：

1. **始终关闭cURL连接**：使用`curl_close()`释放资源
2. **设置超时参数**：防止请求阻塞PHP进程
3. **错误处理**：使用`curl_errno()`和`curl_error()`检查错误
4. **复用cURL句柄**：对于多次请求，可复用句柄提高性能
5. **安全考虑**：对于HTTPS请求，根据需要配置SSL验证选项

> 对于复杂的API交互，推荐使用成熟的HTTP客户端库，如[Guzzle](https://github.com/guzzle/guzzle)或[Httpful](https://github.com/nategood/httpful)。
