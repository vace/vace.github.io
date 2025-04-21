---
title: "我的 FFmpeg 常用命令收集"
date: 2023-12-25
summary: "系统整理FFmpeg最常用的视频处理命令，包括媒体流下载、视频压缩、裁剪、缩放、旋转和格式转换，适用于开发者和内容创作者的实用操作手册。"
tags: [FFmpeg, Video, CLI]
---

## FFmpeg 简介

[FFmpeg](https://www.ffmpeg.org/) 是处理音视频的强大开源工具集，支持几乎所有格式的编解码、转换和处理。本文整理了最常用的FFmpeg命令行操作。

## 流媒体下载

### 下载m3u8流媒体

适用于下载视频流并保存为MP4格式：

```sh
ffmpeg -i https://example.com/index.m3u8 -c copy -bsf:a aac_adtstoasc video.mp4
```

<Callout>
参数解析：
- `-c copy` 使用无损复制模式
- `-bsf:a aac_adtstoasc` 将ADTS头转换为ASC，解决某些播放器兼容性问题
</Callout>

## 视频压缩技巧

### 调整帧率压缩

降低视频帧率可有效减小文件大小：

```sh
# 视频压缩为20帧
ffmpeg -i video.mp4 -r 20 out.mp4
```

### 限制文件大小

直接指定输出文件的最大体积：

```sh
# 设置文件最大尺寸为15MB
ffmpeg -i video.mp4 -fs 15MB out.mp4
```

### 调整码率

通过设置视频码率控制质量与大小的平衡：

```sh
# 码率指定为1.5MB/s
ffmpeg -i video.mp4 -b:v 1.5M out.mp4
```

<Callout type="info">
码率说明：
- `-b:v` 指定视频的码率
- `-b:a` 指定音频的码率
- 值如`1.5M`表示1.5Mb/s的比特率
</Callout>

## 视频裁剪

从视频中提取特定时间段：

```sh
ffmpeg -ss 01:00:00 -t 01:00:06 -i video.mp4 -vcodec copy -acodec copy out.mp4
```

参数说明：
- `-ss` 指定开始时间点
- `-t` 指定需要的持续时长
- `-vcodec copy -acodec copy` 无损复制视频和音频流

## 视频缩放

### 按比例缩放

```sh
# 宽度750，高度自适应
ffmpeg -i video.mp4 -vf scale=750:-1 out.mp4
```

### 指定宽高缩放

```sh
# 宽度750，高度为1280
ffmpeg -i video.mp4 -vf scale=750:1280 out.mp4
```

## 视频旋转

### 视频翻转

```sh
# 垂直翻转（上下颠倒）
ffmpeg -i video.mp4 -vf "vflip" out.mp4

# 水平翻转（左右镜像）
ffmpeg -i video.mp4 -vf "hflip" out.mp4
```

### 角度旋转

```sh
# 顺时针旋转90度
ffmpeg -i video.mp4 -vf "transpose=1" output.mp4

# 逆时针旋转90度
ffmpeg -i video.mp4 -vf "transpose=2" output.mp4

# 顺时针旋转90度后并垂直翻转
ffmpeg -i video.mp4 -vf "transpose=3" output.mp4

# 旋转45度
ffmpeg -i video.mp4 -vf "rotate=PI/4" output.mp4
```

<Callout type="info">
`transpose`参数值含义：
- 0: 逆时针旋转90度并垂直翻转
- 1: 顺时针旋转90度
- 2: 逆时针旋转90度
- 3: 顺时针旋转90度后并垂直翻转
</Callout>

## 格式转换

### 提取视频缩略图

```sh
# 提取视频第一帧作为缩略图
ffmpeg -i vid_max1.mp4 -ss 0 -vframes 1 vid1.jpg
```

### 视频转WEBP动图

```sh
ffmpeg -i ./input.mp4 -vcodec libwebp -filter:v fps=fps=12 -lossless 0 \
  -compression_level 3 -q:v 60 -loop 1 -preset picture -an -s 720:1280 output.webp
```

## 参考资料

- [FFmpeg官方文档](https://www.ffmpeg.org/ffmpeg-devices.html)
- [FFmpeg常用命令](https://www.jianshu.com/p/4178472bea67)