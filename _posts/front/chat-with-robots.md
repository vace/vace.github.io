---
title: "和一群聊天机器人一起聊天吧"
date: 2015-12-31
summary: "通过纯前端技术实现多机器人聊天应用，整合各聊天机器人接口，创建让机器人自动对话的有趣互动界面，附Vue组件实现细节。"
tags: [Vue, TypeScript]
---

> 想象一下，如果将市面上各种聊天机器人接口整合到一起，创建一个小应用让多个机器人互相对话，自己偶尔插嘴，会产生什么样的有趣对话？本文将介绍如何纯前端实现这个有趣的小玩具。

## 效果展示

![聊天机器人效果展示](https://h5.ahmq.net/res/myblog/assets/images/project/js-project-main2.jpeg)

## 功能需求

这款应用的核心功能包括：

* 将机器人添加到讨论组
* 移除机器人
* 机器人能够根据聊天内容作出回复
* 用户可以参与聊天
* 支持表情等特殊功能（计划中）
* 友好的用户界面（UI参考了Mac版QQ的设计 😄）

## 实现细节

### 项目结构

```
.
├── README.md
├── dist                # 打包输出目录
├── index.html          # 应用入口
├── node_modules
├── package.json
├── src                 # 源代码目录
│   ├── app.vue
│   ├── assets          # 静态资源
│   ├── brick           # 聊天窗口组件
│   │   ├── friend.vue  # 好友列表组件
│   │   ├── message.vue # 消息区域组件
│   │   └── status.vue  # 状态栏组件
│   ├── main.js         # 入口文件
│   └── model           # 数据模型
│       └── message.ts  # 消息管理
├── tsconfig.json       # TypeScript配置
└── webpack.config.js   # Webpack配置
```

### 应用基本结构

分析应用后，我们可以将界面划分为三个主要部分：左侧状态栏、中间好友管理区域和右侧聊天窗口。基本结构如下：

```html
<div class="chat-app">
	<!-- 状态栏 -->
	<status-box></status-box>
	<!-- 好友栏 -->
	<friend-box></friend-box>
	<!-- 消息栏 -->
	<message-box></message-box>
</div>
```

### 数据模型设计

#### 消息类型定义

```typescript
enum MSG_TYPE { 
	USER,    // 用户消息
	REBOT,   // 机器人消息
	NOTIFY,  // 通知消息
	SYSTEM,  // 系统消息
	SHAKE,   // 抖动消息
	IMAGE,   // 图片消息
	FACE     // 表情消息
};
```

#### 消息结构

```typescript
interface MessageContent {
	id: number,      // 消息唯一编号
	uid: number,     // 发送者id
	type: number,    // 消息类型
	name: string,    // 发送者名称
	time: Date,      // 发送时间
	head: string,    // 发送者头像
	content: string  // 消息内容
}
```

#### 用户结构

```typescript
interface UserStruct {
	uid: number,     // 用户编号
	name: string,    // 用户名称
	type: number,    // 用户类型
	head: string,    // 用户头像
	count: number,   // 消息统计
	enter: Date,     // 加入时间
	leave: Date      // 离开时间
}
```

### 核心类实现

#### 基础聊天者类

所有聊天参与者（用户和机器人）都继承自这个基类：

```typescript
class Talker {
	public user: UserStruct;
	
	/**
	 * 构造方法
	 * @param  {string} name      聊天者名称
	 * @param  {boolean} isRobot  是否为机器人
	 * @return {Talker}           Talker实例
	 */
	public constructor(name: string, isRobot: boolean = false) {}

	/**
	 * 发送消息
	 * @param {string} content 消息内容
	 */
	public speak(content: string) {}

	/**
	 * 创建新消息
	 * @param {number} type    消息类型
	 * @param {string} content 消息内容
	 */
	protected newmsg(type: number, content: string) {}
	
	/**
	 * 用户进入聊天室
	 */
	public enter() {}
	
	/**
	 * 用户离开房间
	 */
	public leave() {}
	
	// 获取用户ID
	private get uid(): number {}
}
```

#### 机器人类

机器人类继承自基础聊天者类：

```typescript
class Rebot extends Talker {
	/**
	 * 创建机器人实例
	 * @param {string} robotName 机器人名称
	 */
	public constructor(robotName: string) {
		super(robotName, true);
	}
}
```

#### 用户类

用户类采用单例模式，并扩展了一些特殊功能：

```typescript
class User extends Talker {
	/**
	 * 创建用户实例
	 */
	public constructor() {
		super('我');
	}
	
	/**
	 * 发送特殊类型消息
	 * @param {number} type 消息类型
	 */
	public send(type: number) {}

	private static _instance: User;
	
	/**
	 * 获取用户单例
	 */
	public static getInstance(): User {}
}
```

#### 消息管理器

`Message` 类负责管理所有消息和用户，是应用的核心部分。由于代码较长，可以参考源码查看完整实现。

### 初始化聊天

```javascript
// 创建用户
var me = Message.markUser();

// 创建初始机器人
var robots = [
	Message.markRebot('哆啦A梦'),
	Message.markRebot('野比大雄'),
	Message.markRebot('源静香'),
	Message.markRebot('骨川小夫')
];
```

### Vue组件数据绑定

将数据模型与Vue组件绑定：

```javascript
export default {
	 data () {
	return {
		user: me.user,                  // 当前用户
		friends: Message.friends,        // 好友列表
		messages: Message.messages,      // 消息列表
		message_type: MSG_TYPE,          // 消息类型枚举
		inputing: Message.inpitingUserInfo // 当前输入状态
	}
	 },
	 events: {
		// 用户发言
		speak: function(msg) {
		me.speak(msg);
		},
		
		// 发送特殊消息
		send: function(type) {
		me.send(type);
		},
		
		// 用户离开
		leave: function(uid) {
		Message.leaveRebot(uid);
		},
		
		// 创建新机器人
		createRebot: function(name) {
		Message.markRebot(name);
		}
	 },
}
```

完整的应用结构：

```html
<div class="chat-app">
	<!-- 状态栏组件 -->
	<status-box :user="user"></status-box>
	<!-- 好友列表组件 -->
	<friend-box :friends="friends"></friend-box>
	<!-- 消息区域组件 -->
	<message-box :inputing="inputing" :messages="messages" :type="message_type"></message-box>
</div>
```

## 机器人自动对话机制

### 定时触发原理

机器人自动对话的实现原理：

1. 在消息管理器中实现一个200ms周期的定时任务，检查是否到达下一个发言时机：

```typescript
this._intvalid = setInterval(() => {
	var _time: number = Date.now();
	if (this._nextreply >= 0 && this._nextreply < _time) {
		// 触发机器人回复
		this.robotReply();
		// 设置下次交流时间
		this._nextreply = _time + this._replyinterval;
	}
}, 200);
```

2. 当满足发言条件时，获取最后一条消息内容并通过API发送请求：

```typescript
let lastmsg: string = Message.messages[Message.messages.length-1].content;
```

3. 每次发言后重置计时器，并选择下一个回复的机器人（确保不是同一个机器人连续回复）

> 通过这种机制，可以让机器人之间自然地交流，同时避免了同一机器人连续发言的尴尬情况，提升了对话的真实感。


## 在线演示

![聊天机器人演示](https://h5.ahmq.net/res/myblog/assets/images/project/js-project-main2.jpeg)

### 技术栈
- webpack
- typescript
- vue

### 相关链接
- [在线体验](https://h5.ahmq.net/res/myblog/demo/vue-rebot-chat/index.html)
- [GitHub 源码](https://github.com/vace/robotChatter)

机器人讨论组 - 一个让多个AI机器人互相聊天的有趣应用
