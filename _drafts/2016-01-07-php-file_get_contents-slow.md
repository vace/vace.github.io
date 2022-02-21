---
layout: post
title:  PHP file_get_contents构造POST请求
categories: [前端]
tags: [javascript,vue,webpack,typescript,less]
---


php 中提供了一个 `file_get_contents` 用于 将整个文件读入一个字符串

```php
string file_get_contents ( 
	string $filename 
	[, bool $use_include_path = false 
	[, resource $context 
	[, int $offset = -1 
	[, int $maxlen ]]]] );
```



```php

$opts = array('http' =>
  array(
    'method'  => 'POST',
    'header'  => "Content-Type: text/xml\r\n".
      "Authorization: Basic ".base64_encode("$https_user:$https_password")."\r\n",
    'content' => $body,
    'timeout' => 60
  )
);
                        
$context  = stream_context_create($opts);
$url = 'https://'.$https_server;
$result = file_get_contents($url, false, $context, -1, 40000);


```