---
layout: post
title:  PHP 中cURL详解说明
categories: [后端]
tags: [php,cURL]
---

## 简介
在php中一些简单的取远程内容操作,我们可以使用`file_get_contents`即可,但是遇到复杂的`HTTP POST`、`HTTP PUT`、 `FTP 上传`,却没有办法操作,还好PHP为我们提供了强大的CURL工具,看一下官方文档的介绍

> PHP支持的由Daniel Stenberg创建的libcurl库允许你与各种的服务器使用各种类型的协议进行连接和通讯。libcurl目前支持http、https、ftp、gopher、telnet、dict、file和ldap协议。libcurl同时也支持HTTPS认证、HTTP POST、HTTP PUT、 FTP 上传(这个也能通过PHP的FTP扩展完成)、HTTP 基于表单的上传、代理、cookies和用户名+密码的认证。


## 宏定义列表(PHP中常量)
这个比较多,我找了一篇博文里面介绍的比较详细 [MSDA的专栏 · CURL 宏定义列表](http://blog.csdn.net/msda/article/details/38047809/)

1. 常用设置选项布尔值选项

`CURLOPT_AUTOREFERER` ：当返回的信息头含有转向信息时，自动设置前向连接
`CURLOPT_BINARYTRANSFER` ：TRUEtoreturntherawoutputwhenCURLOPT_RETURNTRANSFERisused.
`CURLOPT_COOKIESESSION` ：标志为新的cookie会话，忽略之前设置的cookie会话
`CURLOPT_CRLF` ：将Unix系统的换行符转换为Dos换行符
`CURLOPT_DNS_USE_GLOBAL_CACHE` ：使用全局的DNS缓存
`CURLOPT_FAILONERROR` ：忽略返回错误
`CURLOPT_FILETIME` ：获取请求文档的修改日期，该日期可以用curl_getinfo()获取。
`CURLOPT_FOLLOWLOCATION` ：紧随服务器返回的所有重定向信息
`CURLOPT_FORBID_REUSE` ：当进程处理完毕后强制关闭会话，不再缓存供重用
`CURLOPT_FRESH_CONNECT` ：强制建立一个新的会话，而不是重用缓存的会话
`CURLOPT_HEADER` ：在返回的输出中包含响应头信息
`CURLOPT_HTTPGET` ：设置HTTP请求方式为GET
`CURLOPT_HTTPPROXYTUNNEL` ：经由一个HTTP代理建立连接
`CURLOPT_NOBODY` ：返回的输出中不包含文档信息.
`CURLOPT_NOPROGRESS` ：禁止进程级别传输，PHP自动设为真
`CURLOPT_NOSIGNAL` ：忽略所有发往PHP的信息
`CURLOPT_POST` ：设置POST方式提交数据，POST格式为application/x-www-form-urlencoded
`CURLOPT_PUTTRUE` ：设置PUT方式上传文件，同时设置CURLOPT_INFILE和CURLOPT_INFILESIZE
`CURLOPT_RETURNTRANSFER` ：返回字符串，而不是调用curl_exec()后直接输出
`CURLOPT_SSL_VERIFYPEER` ：SSL验证开启
`CURLOPT_UNRESTRICTED_AUTH` ：一直链接后面附加用户名和密码，同时设置CURLOPT_FOLLOWLOCATION
`CURLOPT_UPLOAD` ：准备上传

2. 整数值选项

`CURLOPT_BUFFERSIZE` ：缓存大小
`CURLOPT_CONNECTTIMEOUT` ：连接时间设置，默认0为无限制
`CURLOPT_DNS_CACHE_TIMEOUT` ：内存中保存DNS信息的时间，默认2分钟
`CURLOPT_INFILESIZE` ：上传至远程站点的文件尺寸
`CURLOPT_LOW_SPEED_LIMIT` ：传输最低速度限制andabort.
`CURLOPT_LOW_SPEED_TIME` ：传输时间限制
`CURLOPT_MAXCONNECTS` ：最大持久连接数
`CURLOPT_MAXREDIRS` ：最大转向数
`CURLOPT_PORT` ：连接端口
`CURLOPT_PROXYAUTH` ：代理服务器验证方式
`CURLOPT_PROXYPORT` ：代理服务器端口
`CURLOPT_PROXYTYPE` ：代理服务器类型
`CURLOPT_TIMEOUT` ：CURL函数的最大执行时间

3. 字符串选项

`CURLOPT_COOKIE` ：HTTP头中set-cookie中的cookie信息
`CURLOPT_COOKIEFILE` ：包含cookie信息的文件，cookie文件的格式可以是Netscape格式,或者只是HTTP头的格式
`CURLOPT_COOKIEJAR` ：连接结束后保存cookie信息的文件
`CURLOPT_CUSTOMREQUEST` ：自定义请求头，使用相对地址
`CURLOPT_ENCODING` ：HTTP请求头中Accept-Encoding的值
`CURLOPT_POSTFIELDS` ：POST格式提交的数据内容(也可以是数组)
`CURLOPT_PROXY` ：代理通道
`CURLOPT_PROXYUSERPWD` ：代理认证用户名和密码
`CURLOPT_RANGE` ：返回数据的范围,以字节记
`CURLOPT_REFERER` ：前向链接
`CURLOPT_URL` ：要连接的URL地址，可以在curl_init()中设置
`CURLOPT_USERAGENT` ：HTTP头中User-Agent的值
`CURLOPT_USERPWD` ：连接种使用的验证信息

4.数组选项

`CURLOPT_HTTP200ALIASES`：200响应码数组，数组中的响应吗被认为是正确的响应
`CURLOPT_HTTPHEADER`：自定义请求头信息

5.只能是流句柄的选项：

`CURLOPT_FILE`：传输要写入的晚间句柄，默认是标准输出
`CURLOPT_INFILE`：传输要读取的文件句柄
`CURLOPT_STDERR`：作为标准错误输出的一个替换选项
`CURLOPT_WRITEHEADER`：传输头信息要写入的文件

6.回调函数选项

`CURLOPT_HEADERFUNCTION`：拥有两个参数的回调函数，第一个是参数是会话句柄，第二是HTTP响应头信息的字符串。使用此回调函数，将自行处理响应头信息。响应头信息按行返回。设置返回值为字符串长度。
`CURLOPT_READFUNCTION`：拥有两个参数的回调函数，第一个是参数是会话句柄，第二是HTTP响应头信息的字符串。使用此函数，将自行处理返回的数据。返回值为数据尺寸。
`CURLOPT_WRITEFUNCTION`：拥有两个参数的回调函数，第一个是参数是会话句柄，第二是HTTP响应头信息的字符串。使用此回调函数，将自行处理响应头信息。响应头信息是整个字符串。设置返回值为字符串长度

7. `curl_getinfo`中使用的常量

`CURLINFO_EFFECTIVE_URL` - 最后一个有效的URL地址
`CURLINFO_HTTP_CODE` - 最后一个收到的HTTP代码
`CURLINFO_FILETIME` - 远程获取文档的时间，如果无法获取，则返回值为“-1”
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


##cURL 函数

`void curl_close ( resource $ch )` — 关闭一个cURL会话并且释放所有资源。cURL句柄ch 也会被释放。
`resource curl_copy_handle ( resource $ch )` — 复制一个cURL句柄和它的所有选项(保持相同的选项。)
`int curl_errno ( resource $ch )` — 返回最后一次的错误号
`string curl_error ( resource $ch )` — 返回一个保护当前会话最近一次错误的字符串
`string curl_escape ( resource $ch , string $str )` — 该函数使用 URL 根据[» RFC 3986](http://www.faqs.org/rfcs/rfc3986)编码给定的字符串。
`mixed curl_exec ( resource $ch )` — 执行一个cURL会话(这个函数应该在初始化一个cURL会话并且全部的选项都被设置后被调用。)
`mixed curl_file_create(string $filename[, string $mimetype][,string $postname])` — 创建一个 CURLFile 对象
`mixed curl_getinfo ( resource $ch [, int $opt = 0 ] )` — 获取一个cURL连接资源句柄的信息
`resource curl_init ([ string $url = NULL ] )` — 初始化一个cURL会话,供curl_setopt(), curl_exec()和curl_close() 函数使用。
`int curl_multi_add_handle ( resource $mh , resource $ch )` — 向curl批处理会话中添加单独的curl句柄(增加 ch 句柄到批处理会话mh)
`void curl_multi_close ( resource $mh )` — 关闭一组cURL句柄
`int curl_multi_exec ( resource $mh , int &$still_running )` — 运行当前 cURL 句柄的子连接(处理在栈中的每一个句柄。无论该句柄需要读取或写入数据都可调用此方法。)
`string curl_multi_getcontent ( resource $ch )` — 如果设置了CURLOPT_RETURNTRANSFER，则返回获取的输出的文本流
`array curl_multi_info_read ( resource $mh [, int &$msgs_in_queue = NULL ] )` — 获取当前解析的cURL的相关传输信息
`resource curl_multi_init ( void )` — 返回一个新cURL批处理句柄
`int curl_multi_remove_handle ( resource $mh , resource $ch )` — 移除curl批处理句柄资源中的某个句柄资源(从给定的批处理句柄mh中移除ch句柄。当ch句柄被移除以后，仍然可以合法地用curl_exec()执行这个句柄。当正在移除的句柄正在被使用，在处理的过程中所有的传输任务会被终止。)
`int curl_multi_select ( resource $mh [, float $timeout = 1.0 ] )` — 等待所有cURL批处理中的活动连接
`bool curl_multi_setopt ( resource $mh , int $option , mixed $value )` — 为 cURL 并行处理设置一个选项
`string curl_multi_strerror ( int $errornum )` — Return string describing error code
`int curl_pause ( resource $ch , int $bitmask )` — Pause and unpause a connection
`void curl_reset ( resource $ch )` — Reset all options of a libcurl session handle
`bool curl_setopt_array ( resource $ch , array $options )` — 为cURL传输会话批量设置选项(这个函数对于需要设置大量的cURL选项是非常有用的，不需要重复地调用curl_setopt()。)
`bool curl_setopt ( resource $ch , int $option , mixed $value )` — 设置一个cURL传输选项
`void curl_share_close ( resource $sh )` — Close a cURL share handle
`resource curl_share_init ( void )` — Initialize a cURL share handle
`bool curl_share_setopt ( resource $sh , int $option , string $value )` — Set an option for a cURL share handle.
`string curl_strerror ( int $errornum )` — Return string describing the given error code
`string curl_unescape ( resource $ch , string $str )` — 解码给定的 URL 编码的字符串
`array curl_version ([ int $age = CURLVERSION_NOW ] )` — 获取cURL版本信息

## 应用场景

### 构造一个简单的`get`请求,抓取`http://www.example.com/`的页面内容

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
### 构造一个简单的`post`请求,提交username和age到指定页面

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

运行结果
```
{
  "form": {
    "age": "23", 
    "username": "vace"
  }, 
  ...
}
```

### HTTP 认证连接
有些网域可能需要认证才能连接

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

返回结果

```
{
  "authenticated": true, 
  "user": "vace"
}
```



### 使用cURL获取cookies并保存到本地

```php
/**
 * [curl_cookies 使用curl发送和保存cookies]
 * @param  [type] $url       [访问URL]
 * @param  [type] $save_path [cookies的保存地址]
 * @return [type]            [设置cookies后的内容]
 */
function curl_cookies($url,$save_path){
	$ch = curl_init();
	curl_setopt_array($ch, [
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_URL => $url,
		CURLOPT_COOKIEJAR => $save_path,
		CURLOPT_COOKIEFILE => $save_path
	]);
	$result = curl_exec($ch);
	curl_close($ch);

	return $result;
}
echo curl_cookies('http://httpbin.org/cookies/set?cookie1=vace','./cookies.log');
```

然后在脚本运行目录会生成 `cookies.log`打开内容如下 `cookie1	vace`为cookies内容

```log
# Netscape HTTP Cookie File
# http://curl.haxx.se/docs/http-cookies.html
# This file was generated by libcurl! Edit at your own risk.
httpbin.org	FALSE	/	FALSE	0	cookie1	vace
```

### 下载一张图片到本地

```php
/**
 * [curl_download 下载远程文件]
 * @param  [type] $url      [远程地址]
 * @param  [type] $savename [保存本地文件名]
 * @return [type]           [description]
 */
function curl_download($url,$savename){
	$fp = fopen($savename, 'w');
	$ch = curl_init($url);
	curl_setopt_array($ch, [
		CURLOPT_FILE => $fp,
		CURLOPT_HEADER => 0
	]);
	curl_exec($ch);
	curl_close($ch);
	fclose($fp);
}

curl_download('http://httpbin.org/image/png','./down.png');
```

运行结果,运行后在代码目录会下载`down.png`图片


### 实现一个cURL类

这样的cURL使用比较麻烦,我们可以自己实现需要的curl操作类(这里只是简单演示一下,推荐一个比较齐全的CURL操作库[A Chainable, REST Friendly, PHP HTTP Client. A sane alternative to cURL](https://github.com/nategood/httpful))


```php

//1.构造一个简单的 get 请求,抓取 http://www.example.com/ 的页面内容
// echo Curl::get('http://www.example.com/')->send();
//2.构造一个简单的 post 请求,提交username和age到指定页面
// print_r( Curl::post('http://httpbin.org/post')->setData(['username'=>'vace','age'=>23])->send() );
//3.HTTP 认证连接
// echo Curl::get('http://httpbin.org/basic-auth/vace/passwd')->setAuth('vace','passwd')->send();
//4.使用cURL获取cookies并保存到本地
// echo Curl::get('http://httpbin.org/cookies/set?cookie1=vace')->useCookies('./cookies.log')->send();
//5.下载一张图片到本地
// Curl::get('http://httpbin.org/image/png')->download('./test.png')->send();

class Curl{
	/**
	 * [$allMethod 全部访问方法]
	 * @var [array]
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
	 * [__callStatic 调用方法请求数据]
	 * @param  [type] $method [allMethod key]
	 * @param  [type] $url    [请求url地址]
	 * @return [type]         [Curl对象]
	 */
	public static function __callStatic($method,$url){
		$methods = static::$allMethod;
		if(!array_key_exists($method, $methods)){
			throw new \InvalidArgumentException("Method {$method} not valid HTTP method", 1);	
		}
		return new self($method,$url[0]);
	}

	/**
	 * [$url 请求url]
	 * @var [string]
	 */
	private $url;
	/**
	 * [$method 请求方法]
	 * @var [string]
	 */
	private $method;
	/**
	 * [$headers curl header]
	 * @var [array]
	 */
	private $headers = [];
	/**
	 * [$cookies cookies信息]
	 * @var [array]
	 */
	private $cookies = [];
	/**
	 * [$data 设置数据]
	 * @var [type]
	 */
	private $data = [];

	/**
	 * [$option curl opt 参数]
	 * @var array
	 */
	private $option = [];

	/**
	 * [$auth 认证信息]
	 * @var array
	 */
	private $auth = false;
	/**
	 * [$ch curl_init 句柄]
	 * @var [type]
	 */
	private $ch;
	private function __construct($method,$url){
		$this->url = $url;
		$this->method = $method;
	}

	public function getUrl(){
		return $this->url;
	}

	public function getMethod(){
		return $this->method;
	}

	/**
	 * [setHeader 设置header,(key,value),('key:value')]
	 * @param [type] $key   [header 名称]
	 * @param [type] $value [值]
	 */
	public function setHeader($key,$value=null){
		if(null === $value){
			list($key,$value) = explode(':', $key);
		}
		$this->headers[ strtolower($key) ] = $value;
		return $this;
	}

	/**
	 * [setHeaders 批量设置header]
	 * @param array $headersArr [description]
	 */
	public function setHeaders(array $headersArr = []){
		foreach ($headersArr as $key => $value) {
			$this->setHeader($key,$value);
		}
		return $this;
	}

	/**
	 * [setCookie 设置cookies]
	 * @param [type] $key   [key=value,(key,value)]
	 * @param [type] $value [description]
	 */
	public function setCookie($key,$value=null){
		if(null === $value){
			list($key,$value) = explode('=', $key);
		}
		$this->cookies[ strtolower($key) ] = $value;
		return $this;
	}

	/**
	 * [setCookies 批量设置cookies]
	 * @param array $headersArr [description]
	 */
	public function setCookies(array $headersArr = []){
		foreach ($headersArr as $key => $value) {
			$this->setCookie($key,$value);
		}
		return $this;
	}

	public function setData($data){
		$this->data = array_merge($this->data,$data);
		return $this;
	}

	public function setOption($key,$value){
		$this->option[$key] = $value;
		return $this;
	}

	public function setOptions(array $data = []){
		$this->option = array_merge($this->option,$data);
		return $this;
	}

	public function setAuth($user,$passwd=null){
		if(null === $user){
			list($user,$passwd) = explode(':', $user);
		}
		$this->auth = $user . ':' . $passwd;
		return $this;

	}

	private $cookies_path=false;
	public function useCookies($cookiesPath=''){
		$this->cookies_path = $cookiesPath;
		return $this;
	}

	private $download_file = false;
	public function download($filename){
		$this->download_file = $filename;
		return $this;
	}
	private $json = false;
	public function json(boolean $bool){
		$this->json = $bool;
		return $this;
	}

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







