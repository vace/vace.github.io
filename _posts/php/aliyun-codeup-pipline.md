---
title: "阿里云云效构建CI/CD持续集成流水线体验"
date: 2021-12-20
summary: "详解如何使用阿里云云效CodeUp创建代码仓库并构建持续集成流水线，包括仓库创建、公钥配置、代码同步及流水线配置的完整实践指南。"
tags: [DevOps, CI/CD, Aliyun, Git]
---

## 新建代码库

![](https://h5.ahmq.net/res/mweb/2025-04/21_17452376071333.jpg?x-oss-process=style/mweb-image)

## 添加管理代码的公钥

![](https://h5.ahmq.net/res/mweb/2025-04/21_17452376071357.jpg?x-oss-process=style/mweb-image)

## 克隆或导入仓库

```sh tab="克隆新仓库"
git clone https://codeup.aliyun.com/xxx.git
cd valentin-pvsol-design
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master
```

```sh tab="导入现有项目"
cd existing_folder
git init
git remote add origin https://codeup.aliyun.com/xxx.git
git add .
git commit
git push -u origin master
```

## 创建流水线

![](https://h5.ahmq.net/res/mweb/2025-04/21_17452376071373.jpg?x-oss-process=style/mweb-image)
![](https://h5.ahmq.net/res/mweb/2025-04/21_17452376071386.jpg?x-oss-process=style/mweb-image)
