---
layout: post
title:  和一群聊天机器人一起聊天吧
categories: [前端]
tags: [javascript,vue,webpack,typescript,less]
---

> 目前有很多机器人聊天的接口,如果做个小玩具拉上三五机器人,自己再偶尔插嘴,那么会聊出什么样搞笑的对话呢,本程序只涉及前端开发,机器人聊天可以用市面上一些机器人聊天的接口实现- -.

## 结果展示

![结果展示]({{ site.image }}/project/js-project-main2.jpeg)

## 前期构思
很简单,我们希望这款应用具备以下功能

* 拉机器人进入讨论组
* 踢出机器人
* 机器人能根据当前聊天信息做出回复
* 我也能参与聊天
* 简单的实现一些特殊功能,表情(TODO)
* 有个不错的界面(0_0 我这个聊天的UI,是照着MAC上的QQ裸切的...😄)

## 实现

## 文件结构

```java
.
├── README.md
├── dist  # 程序打包记录
├── index.html # 应用入口
├── node_modules
├── package.json
├── src # 应用目录
│   ├── app.vue
│   ├── assets # 静态资源
│   ├── brick # 聊天窗口组件
│   │   ├── friend.vue # 好友栏
│   │   ├── message.vue # 消息栏
│   │   └── status.vue # 状态栏
│   ├── main.js # 入口
│   └── model # 聊天数据model
│       └── message.ts # 消息管理
├── tsconfig.json # typescript 配置文件
└── webpack.config.js # webpack 配置文件
```

### 应用基本结构
分析应用我们发现其实主要分为三个部分,
左侧状态栏,中间好友管理,右侧聊天窗口,那么我们希望的应用应该是这样的:

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

### 我们需要的一些数据模型

#### 约定数据类型

* 消息类型

```typescript
enum MSG_TYPE { 
	USER,  // 我的消息
	REBOT, // 机器人消息
	NOTIFY, // 通知消息
	SYSTEM,  //系统消息
	SHAKE,  // 抖动消息
	IMAGE , // 图片消息
	FACE  //表情消息
};
```
* 消息结构

```typescript
interface MessageContent{
	// 消息唯一编号
	id:number,
	// 发送者id
	uid:number,
	// 消息类型
	type:number,
	// 发送人名字
	name:string,
	// 发送时间
	time:Date,
	// 发送者头像
	head:string,
	// 发送内容
	content:string
}
```

* 聊天参与者结构

```typescript
interface UserStruct{
	//用户编号
	uid:number,
	//用户名称
	name:string,
	//用户类型
	type:number,
	//用户头像
	head:string,
	//用户消息统计
	count:number,
	//用户加入时间
	enter:Date,
	//用户离开时间
	leave:Date
}

```

#### 讨论组成员基类
对于讨论组内每个成员都继承的基类

```typescript
class Talker{
	public user: UserStruct;
	
	/**
	 * [constructor 构造方法]
	 * @param  {[type]}  name:string     [讨论者名字]
	 * @param  {Boolean} isRebot:boolean [是否为机器人]
	 * @return {[Talker]}                  [Talker]
	 */
	public constructor(name:string,isRobot:boolean=false){}

	/**
	 * [speak 说话]
	 * @param {string} content [说的内容]
	 */
	public speak(content:string){}

	/**
	 * [newmsg 新消息]
	 * @param {number} type    [消息类型]
	 * @param {string} content [消息内容]
	 */
	protected newmsg(type:number,content:string){}
	/**
	 * [用户进入加入聊天室]
	 */
	public enter(){}
	/**
	 * [leave 用户离开房间]
	 */
	public leave(){}
	// 获取用户Uid
	private get uid():number{}
```

#### 创造机器人们
机器人比较简单,只需要继承`Talker`的全部方法就可以了

```typescript
class Rebot extends Talker{
	/**
	 * [constructor 创造机器人]
	 * @param  {[type]} robotName:string [机器人名称]
	 * @return {[type]}                  [description]
	 */
	public constructor(robotName:string){
		super(robotName,true);
	}

}
```

#### 创造我

对于一个聊天应用来说,我其实只有一个,所以我们继承`Talker`实现一个简单的单例模式吧,这个我由于开了会员具有一些特殊功能,发表情,发图片之类的,所以有一些扩展方法

````typescript
class User extends Talker{
	/**
	 * [constructor 创建自己]
	 * @return {[type]} [description]
	 */
	public constructor(){
		super('我');
	}
	
	/**
	 * [send 发送特殊消息]
	 * @param  {[type]} type:number [消息类型]
	 */
	public send(type:number){}

	private static _instance: User;
	/**
	 * 单例模式获取实例
	 */
	public static getInstance():User{}
}
````

#### 管理消息 `Message` 

这个比较长建议大家直接去看源码吧,主要是收集模型中的消息和好友并且对外输出

#### 聊天开局,创建一些机器人

```javascript
//创建自己
var me = Message.markUser();
//创建三名机器人
var robots = [
  Message.markRebot('哆啦A梦'),
  Message.markRebot('野比大雄'),
  Message.markRebot('源静香'),
  Message.markRebot('骨川小夫')
];
```

### 给每个栏目绑定一些数据

上面的模型建立之后,把Message中的数据使用Vue绑定到视图上就可以啦

```javascript
export default{
	//提供数据
   data () {
    return {
      user:me.user, // 我
      friends: Message.friends,//好友列表
      messages:Message.messages, //消息列表
      message_type:MSG_TYPE, //消息类型
      inputing:Message.inpitingUserInfo //当前输入者,TODO
    }
    //监听一些子组件的事件
    events:{
      /**
       * [speak 我说话]
       * @param  {[type]} msg [消息内容]
       */
      speak:function(msg){
        me.speak(msg);
      },
      /**
       * [send 我发送特殊消息]
       * @param  {[type]} type [消息类型]
       */
      send:function(type){
        me.send(type);
      },
      /**
       * [leave 某个用户离开房间或者被踢出]
       * @param  {[type]} uid [用户唯一编号]
       */
      leave:function(uid){
        Message.leaveRebot(uid);
      },
      /**
       * [createRebot 创建一个新的机器人]
       * @param  {[type]} name [机器人名称]
       */
      createRebot:function(name){
        Message.markRebot(name);
      }
    },
  },
}
```

接下来,我们要的基本结构就出来咯


```html
<div class="chat-app">
	  <!-- 绑定自己数据信息 -->
      <status-box :user="user"></status-box>
      <!-- 绑定好友列表 -->
      <friend-box :friends="friends"></friend-box>
      <!-- 绑定消息和消息类型 -->
      <message-box :inputing="inputing" :messages="messages" :type="message_type"></message-box>
</div>
```

最后分别实现`status-box`,`friend-box`,`message-box`的一些数据绑定就ok咯.这三部分比较简单,可以自行查看源码


### 实现自动对话机制

这个机制目前比较简单,说一下基本原理吧

1.在Message内部实现一个周期为200ms,检测是否到下一个发言周期

```typescript
this._intvalid = setInterval(() => {
	var _time: number = Date.now();
	if (this._nextreply >= 0 && this._nextreply < _time) {
		//触发回复消息
		this.robotReply();
		//设置下次交流时间
		this._nextreply = _time + this._replyinterval;
	}
},200);
```


2. 如果满足发言条件,从消息列表拿到最后一条消息,通过ajax发送消息

```typescript
let lastmsg:string = Message.messages[Message.messages.length-1].content;
```

3. 每次发言成功后,重置发言周期,并且切换下次回答的机器人(切换条件为不能为自己,即不能自己接自己的话)


详细信息可以看演示版

<div class="col-md-6 col-xs-12">
<div class="box-project" style="margin-top: 100px;">
	<div class="cover">
		<a href="http://www.5u55.cn/a/robotChatter/" class="link">
			<img src="{{site.image}}/project/js-project-main2.jpeg" alt="">
		</a>
		<p>
			<span>webpack</span>
			<span>typescript</span>
			<span>vue</span>
		</p>
	</div>
	<p class="description">
		查看演示...
	</p>
	<p class="footer">
	机器人讨论组~
		<span class="todo">
			<a href="https://github.com/vace/robotChatter" class="github"><i class="icon">&#xe60d;</i></a>
			<a href="http://www.5u55.cn/a/robotChatter/" class="github"><i class="icon">&#xe628;</i></a>
		</span>
	</p>
</div>
</div>

<div class="clearfix"></div>







