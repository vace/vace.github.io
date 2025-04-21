---
date: 2020-06-26
title:  写markdown时图片直传ali oss问题
summary:  使用vscode插件picgo，直接将图片上传到阿里云oss中，粘贴到markdown中
tags: [VSCode, mdx]
---

我的博客和一些文档资料，通常都使用markdown写的，每次遇到图片上传，都需要传到`oss`中，再拿路径贴到文档中，十分麻烦，也尝试过`图床`，自动同步之类的工具，差强人意。

我的期望目标是，截图或者选中图片后，在markdown中`ctrl+v`就能粘贴为`![filename](url)的格式`，后来我找到了`vs-picgo`这款插件，只能说万分满意。

## 插件安装

vscode插件中直接搜索`picgo`即可，安装完成后配置（我这里已上传阿里云oss为例）。

![20211117013303-2021-11-17](https://h5.ahmq.net/res/hosting/20211117013303-2021-11-17.png)

## OSS配置

为了安全起见，开通后oss后，设置一个子账号

设置子账号时一定要记下：`AccessKey ID`和`AccessKey Secret`哦

![20211117013659-2021-11-17](https://h5.ahmq.net/res/hosting/20211117013659-2021-11-17.png)

前往oss中进行设置

![20211117013551-2021-11-17](https://h5.ahmq.net/res/hosting/20211117013551-2021-11-17.png)

配置写入权限，指定目录

![20211117013519-2021-11-17](https://h5.ahmq.net/res/hosting/20211117013519-2021-11-17.png)

配置`picgo`

- `Access Key ID`和`Access Key Secret`是我们之前存的用户字符串
- `Area`是我们的地域（英文），在我们的阿里云bucket概览中可以看到，Endpoint（地域节点）如oss-cn-beijing
- `Bucket` 使我们创建的bucket名称
- `Custom Url` 是我们阿里云bucket概览中的bucket域名
- `Path` 是上面指定的上传目录


## 使用

<Accordions>
  <Accordion title="从剪切板中上传图片">
    <img src="https://i.loli.net/2019/04/09/5cac17d2d2265.gif" alt="clipboard.gif" />
  </Accordion>
  <Accordion title="从资源管理器中上传图片">
    <img src="https://i.loli.net/2019/04/09/5cac17eea0d65.gif" alt="explorer.gif" />
  </Accordion>
  <Accordion title="从vscode输入中上传图片">
    <img src="https://i.loli.net/2019/04/09/5cac17fe52a86.gif" alt="input box.gif" />
  </Accordion>
  <Accordion title="使用自定义文件名上传图片 <code>文件名</code>">
    <img src="https://i.loli.net/2019/04/09/5cac180fb1dc7.gif" alt="selection.gif" />
    <b>注意，这些字符: <code>\$</code>, <code>:</code>, <code>/</code>, <code>?</code> 和换行符将会被忽略 </b>
  </Accordion>
</Accordions>

## 快捷键

**你可以改变所有下面的快捷键**

| 系统           | 从剪贴板上传图像              | 从资源管理器中上传图片                  | 输入框上传图像             |
| ------------ | ----------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| Windows/Unix | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>U</kbd> | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>E</kbd> | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>O</kbd> |
| OsX          | <kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>U</kbd>  | <kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>E</kbd>  | <kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>O</kbd>  |
