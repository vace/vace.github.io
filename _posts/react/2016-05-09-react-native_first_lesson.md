---
layout: post
title:  react-native 需要了解的一些知识点
categories: [前端]
tags: [react,react-native,ios]
---

### 介绍
React Native是伟大的互联网公司Facebook与2015年9月15日发布的，该可以让我们广大开发者使用JavaScript和React开发我们的应用，该提倡组件化开发，也就是说React Native给我们提供一个个封装好的组件让开发者来进行使用，甚至我们可以相关嵌套形成新的组件。使用React Native我们可以维护多种平台(Web,Android和IOS)的同一份业务逻辑核心代码来创建原生应用。现阶段Web APP的的体验还是无法达到Native APP的体验，所以这边fackbook更加强调的是learn once,write everywhere，应用前端我们使用js和React来开发不同平台的UI，下层核心模块编写复用的业务逻辑代码，提供应用开发效率。


--------

- [React-用于构建用户界面的JavaScript库](#react-用于构建用户界面的javascript库)
- [Flexbox布局](#flexbox布局)
- [组件的生命周期](#组件的生命周期)
- [Navigator](#navigator)
- [react-native与原生交互](#react-native与原生交互)
- [ES6与ES5](#es6与es5)
- [Promise](#promise)
- [fetch](#fetch)
- [npm](#npm)
- [资源收集](#资源收集)

### React-用于构建用户界面的JavaScript库


React是作为MVC中V存在的，React有一个JSX的编译器，JSX 让你可以用 HTML 语法去写 JavaScript 函数调用。

举例JSX是以下写法：

```html
<div>
     <MyLabel  text={TextLabel} />
     <MyTextfield />
     <MyButton textlabel='OK' />
</div>
```html

如果不经过JSX转化，你就必须用下面JavaScript的写法：

```javascript
React.createElement("div", null, 
     React.createElement(MyLabel, {text: TextLabel}), 
     React.createElement(MyTextfield, null), 
     React.createElement(MyButton, {textlabel: "OK"}))
```

其实如果是写界面，JSX的XML风格就看起来比JavaScript人性化了。

React 可以渲染 HTML 标签 (strings) 或 React 组件 (classes)，React 的 JSX 里约定分别使用首字母大、小写来区分本地组件的类和 HTML 标签。

React 使用 Virtual DOM 来渲染 UI，当组件状态 state 有更改的时候，React 会自动调用组件的 render 方法重新渲染整个组件的 UI。

React之所以快，就是因为没有直接操作DOM，组件 DOM 结构就是映射到这个虚拟 DOM 上，React 在这个虚拟 DOM 上实现了一个 diff 算法，当要更新组件的时候，会通过 diff 寻找到要变更的 DOM 节点，再把这个修改更新到浏览器实际的 DOM 节点上，所以实际上不是真的渲染整个 DOM 树。这个虚拟 DOM 是一个纯粹的 JS 数据结构，所以性能会比原生 DOM 快很多。

React 操作具体可以看下图：

![](http://www.ibm.com/developerworks/cn/web/wa-react-intro/figure1.png)

Flux是Facebook用来构建用户端的web应用的应用程序体系架构。它通过利用数据的单向流动为React的可复用的视图组件提供了补充。Flux应用主要包括三部分：dispatcher、store和views（React components）,dispatcher处理动作分发，维护Store之间的依赖关系，store是数据和逻辑部分，views是React组件，这一层可以看作controller-views,作为视图同时响应用户交互，最后其实还有一个action部分，提供dispatcher传递数据给store

![](http://facebook.github.io/flux/img/flux-simple-f8-diagram-explained-1300w.png)


参考链接：

[React-中文文档](http://reactjs.cn/react/index.html)

[React：创建可维护、高性能的 UI 组件](http://www.ibm.com/developerworks/cn/web/wa-react-intro/)

[极客学院-React 入门教程](http://wiki.jikexueyuan.com/project/react-tutorial/)

### Flexbox布局


Flex布局主要思想是让容器有能力让其子项目能够改变其宽度、高度(甚至顺序)，以最佳方式填充可用空间（主要是为了适应所有类型的显示设备和屏幕大小）。

基本上，伸缩项目是沿着主轴（main axis），从主轴起点（main-start）到主轴终点（main-end）或者沿着侧轴（cross axis），从侧轴起点（cross-start）到侧轴终点（cross-end）排列。

这里可以看一下flexbox的几个主要属性

`flex-direction`（适用于伸缩容器，也就是伸缩项目的父元素）

这个主要用来创建主轴，从而定义了伸缩项目放置在伸缩容器的方向。

`flex-direction: row | row-reverse | column | column-reverse	`

flex-wrap(适用于伸缩容器)
这个主要用来定义伸缩容器里是单行还是多行显示，侧轴的方向决定了新行堆放的方向。

`flex-wrap: nowrap | wrap | wrap-reverse`


`justify-content`（适用于伸缩容器）

这个是用来定义伸缩项目沿着主轴线的对齐方式。当一行上的所有伸缩项目都不能伸缩或可伸缩但是已经达到其最大长度时，这一属性才会对多余的空间进行分配。

`justify-content: flex-start | flex-end | center | space-between | space-around	`


![](https://cdn.css-tricks.com/wp-content/uploads/2013/04/justify-content.svg)

`align-item`（适用于伸缩容器）

这个主要用来定义伸缩项目可以在伸缩容器的当前行的侧轴上对齐方式。可以把他想像成侧轴（垂直于主轴）的“justify-content”。

`align-items: flex-start | flex-end | center | baseline | stretch`

![](https://cdn.css-tricks.com/wp-content/uploads/2013/04/align-content.svg)

`align-content`(适用于伸缩容器)

这个属性主要是伸缩容器多行是主轴的对齐方式


`align-content: flex-start | flex-end | center | space-between | space-around | stretch	`



![](https://cdn.css-tricks.com/wp-content/uploads/2014/05/align-items.svg)

参考链接：

[一个完整的Flexbox指南](http://www.w3cplus.com/css3/a-guide-to-flexbox.html)





### 组件的生命周期


React组件的生命周期如下图：

![](http://7rf9ir.com1.z0.glb.clouddn.com/3-3-component-lifecycle.jpg)


所以组件生命周期就是有三个阶段：

实例化：当首次使用组件类时

存在期：当实例已经生成，修改属性时

销毁期：当组件卸载消亡时


参考链接：


[React Native 中组件的生命周期](http://www.race604.com/react-native-component-lifecycle/)


### Navigator


Navigator和NavigatorIOS都可以用来管理应用中“场景”的导航（也可以称作屏幕）。导航器建立了一个路由栈，用来弹出，推入或者替换路由状态。主要的区别在于NavigatorIOS使用了iOS中的UINavigationController类，而Navigator则完全用js重写了一个类似功能的React组件。

关于Navigator，可以看一下下面的示例：
```javascript
// index.ios.js

var {
    View,
    Navigator
} = React;
var FirstPageComponent = require('./FirstPageComponent');

var SampleComponent = React.createClass({
    render: function() {
        var defaultName = 'FirstPageComponent';
        var defaultComponent = FirstPageComponent;
        return (
        <Navigator
          initialRoute={{ name: defaultName, component: defaultComponent }}
          configureScene={() => {
            return Navigator.SceneConfigs.VerticalDownSwipeJump;
          }}
          renderScene={(route, navigator) => {
            let Component = route.component;
            if(route.component) {
              return <Component {...route.params} navigator={navigator} />
            }
          }} />
        );

    }
});
```

`initialRoute={{ name: defaultName, component: defaultComponent }}`这个指定了默认的页面，也就是启动app之后会看到界面的第一屏。 需要填写两个参数: name 跟 component。

configureScene 这个是页面之间跳转时候的动画，具体有哪些？可以看这个目录下，有源代码的: node_modules/react-native/Libraries/CustomComponents/Navigator/NavigatorSceneConfigs.js

renderScene,我们先看到回调里的两个参数:route, navigator。route里其实就是我们传递的name,component。navigator是一个Navigator的对象，这里是返回route.component组件，然后navigator作为props传递给了这个component，我们可以在FirstPageComponent里面通过props.navigator拿到。

```javascript
//FirstPageComponent.js
var {
    View,
    Text,
    TouchableOpacity
} = React;

var SecondPageComponent = require('./SecondPageComponent');

var FirstPageComponent = React.create({
    getInitialState: function() {
        return {
            id: 2,
        };
    },

    componentDidMount: function() {
    },

    _pressButton: function() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'SecondPageComponent',
                component: SecondPageComponent,
                //这里多出了一个 params 其实来自于Navigator 里的一个方法的参数...
                params: {
                    id: this.state.id
                }
            });
        }
    },

    render: function() {
        return (
            <View>
                <TouchableOpacity onPress={this._pressButton}>
                    <Text>点我跳转并传递id</Text>
                </TouchableOpacity>
            </View>
        );
    }
});

```

在index.ios.js里面有

```javascript
            return <Component {...route.params} navigator={navigator} />

```

"..."就是把route.params每个key作为props的一个属性，所以在FirstPageComponent.js设置的params值，将在它push到的页面接收到。

```javascript
//SecondPageComponent.js
var {
    View,
    Text,
    TouchableOpacity,
} = React;

var FirstPageComponent = require('./FirstPageComponent');

var SecondPageComponent = React.create({
    getInitialState: function() {
        return {
            id: null
        };
    },
    componentDidMount: function() {
        //这里获取从FirstPageComponent传递过来的参数: id
        this.setState({
            id: this.props.id
        });
    },
    _pressButton: function() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    },
    render: function() {
        return (
            <View>
                <Text>获得的参数: id={ this.state.id }</Text>
                <TouchableOpacity onPress={this._pressButton}>
                    <Text>点我跳回去</Text>
                </TouchableOpacity>
            </View>
        );
    }
});
```

参考链接：


[新手理解Navigator的教程](http://bbs.reactnative.cn/topic/20/%E6%96%B0%E6%89%8B%E7%90%86%E8%A7%A3navigator%E7%9A%84%E6%95%99%E7%A8%8B) 对于Navigator讲解的特别详细


### react-native与原生交互

在React Native中，一个“原生模块”就是一个实现了“RCTBridgeModule”协议的Objective-C类，其中RCT是ReaCT的缩写。

为了实现RCTBridgeModule协议，你的类需要包含RCT_EXPORT_MODULE()宏。这个宏也可以添加一个参数用来指定在Javascript中访问这个模块的名字。如果你不指定，默认就会使用这个Objective-C类的名字。

JS可以调用Native的方法，
Native代码：

```c
RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location (RCTResponseSenderBlock)callback)
{
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
  NSArray *events = ...
  callback(@[[NSNull null], events]);
}
```

JS调用如下

```javascript
var CalendarManager = require('react-native').NativeModules.CalendarManager;
CalendarManager.addEvent('Birthday Party', '4 Privet Drive, Surrey',(error,events) => {
        if (error) {
            alert(error)
        }else{
           alert(events)
        };
});
```

当然Native也可以调用JS
native调用

```c
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@implementation CalendarManager

@synthesize bridge = _bridge;

- (void)calendarEventReminderReceived:(NSNotification *)notification
{
  NSString *eventName = notification.userInfo[@"name"];
  [self.bridge.eventDispatcher sendAppEventWithName:@"EventReminder"
                                               body:@{@"name": eventName}];
}

@end
```

在JS中订阅该事件

```javascript
var { NativeAppEventEmitter } = require('react-native');

var subscription = NativeAppEventEmitter.addListener(
  'EventReminder',
  (reminder) => console.log(reminder.name)
);
...
// 千万不要忘记忘记取消订阅, 通常在componentWillUnmount函数中实现。
subscription.remove();
```

基于上面的规则，react-native对很多原生模块进行了封装，比如UIView，他们实现RCTViewManager类，RCTViewManager实现了协议RCTBridgeModule，这样JS就可以使用native组件了。

默认的情况下，react-native只注册一个RCTRootView，


```
RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"CommunicateNativeDemo"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
```

```javascript
AppRegistry.registerComponent('CommunicateNativeDemo', () => CommunicateNativeDemo);
```

上面代码中注册的RCTRootView就是整个程序的入口，当然如果你有多个入口或者其他方面的需求，也可以注册多个，不native的不同地方使用JS模块。


```javascript
AppRegistry.registerComponent('FirstView', () => CommunicateNativeDemo);
AppRegistry.registerComponent('SecondView', () => CommunicateNativeDemo);
AppRegistry.registerComponent('ThirdView', () => CommunicateNativeDemo);
```

然后把这三个组件通过RCTRootView加载到原生上

```javascript
- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.title = @"First View";
    AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:delegate.bridge moduleName:@"FirstView"];
    rootView.frame = CGRectMake(20, 84, [UIScreen mainScreen].bounds.size.width - 40, 200);
    [self.view addSubview:rootView];
}
```


react-native中Obj-C和JavaScript通信原理简单说一下，和我们经常用的bridge差不多，Obj-C调用JavaScript很简单，可以通过webview的stringByEvaluatingJavaScriptFromString:方法调用JavaScript代码；JavaScript调用Obj-C，则是通过web view的代理方法shouldStartLoadWithRequest：来接收JavaScript的网络请求从而实现调用。

### ES6与ES5

ECMAScript 是 JavaScript 语言的国际标准，JavaScript 是 ECMAScript 的实现。ECMAScript 5和ECMAScript 6分别是2009年和2015年发布的，下面列出一些主要的ES6与ES5的不同写法。

###### 引用

在ES5里，如果使用CommonJS标准，引入React包基本通过require进行，代码类似这样：

```javascript
//ES5
var React = require("react-native");
var {
    Image,
    Text,
    PropTypes
} = React;  //引用不同的React Native组件
```

在ES6里，import写法更为标准

```javascript
//ES6
import React, {
    Image, 
    Text,
    PropTypes
} from 'react-native';
```

###### 导出单个类

在ES5里，要导出一个类给别的模块用，一般通过module.exports来导出


```javascript
//ES5
var MyComponent = React.createClass({
    ...
});
module.exports = MyComponent;
```

在ES6里，通常用export default来实现相同的功能：

```javascript
//ES6
export default class MyComponent extends React.Component{
    ...
}
```

###### 给组件定义方法

给组件定义方法不再用 名字: function()的写法，而是直接用名字()，在方法的最后也不能有逗号了。


```javascript
//ES5 
var Photo = React.createClass({
    componentWillMount: function(){

    },
    render: function() {
        return (
            <Image source={this.props.source} />
        );
    },
});
```

```javascript
//ES6
class Photo extends React.Component {
    componentWillMount() {

    }
    render() {
        return (
            <Image source={this.props.source} />
        );
    }
}
```

###### 定义组件的属性类型和默认属性

在ES5里，属性类型和默认属性分别通过propTypes成员和getDefaultProps方法来实现

```javascript
//ES5 
var Video = React.createClass({
    getDefaultProps: function() {
        return {
            autoPlay: false,
            maxLoops: 10,
        };
    },
    propTypes: {
        autoPlay: React.PropTypes.bool.isRequired,
        maxLoops: React.PropTypes.number.isRequired,
        posterFrameSrc: React.PropTypes.string.isRequired,
        videoSrc: React.PropTypes.string.isRequired,
    },
    render: function() {
        return (
            <View />
        );
    },
});

```

在ES6里，可以统一使用static成员来实现

```javascript
//ES6
class Video extends React.Component {
    static defaultProps = {
        autoPlay: false,
        maxLoops: 10,
    };  // 注意这里有分号
    static propTypes = {
        autoPlay: React.PropTypes.bool.isRequired,
        maxLoops: React.PropTypes.number.isRequired,
        posterFrameSrc: React.PropTypes.string.isRequired,
        videoSrc: React.PropTypes.string.isRequired,
    };  // 注意这里有分号
    render() {
        return (
            <View />
        );
    } // 注意这里既没有分号也没有逗号
}
```

###### 初始化state


```javascript
//ES5 
var Video = React.createClass({
    getInitialState: function() {
        return {
            loopsRemaining: this.props.maxLoops,
        };
    },
})
```

ES6下，有两种写法：



```javascript
//ES6
class Video extends React.Component {
    state = {
        loopsRemaining: this.props.maxLoops,
    }
}
```

不过我们推荐更易理解的在构造函数中初始化（这样你还可以根据需要做一些计算）：



```javascript
//ES6
class Video extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loopsRemaining: this.props.maxLoops,
        };
    }
}
```

###### 把方法作为回调提供

在JS中，this指的是，调用函数的那个对象。在ES5下，React.createClass会把所有的方法都bind一遍，这样可以提交到任意的地方作为回调函数，而this不会变化。

```javascript
//ES5
var PostInfo = React.createClass({
    handleOptionsButtonClick: function(e) {
        // Here, 'this' refers to the component instance.
        this.setState({showOptionsModal: true});
    },
    render: function(){
        return (
            <TouchableHighlight onPress={this.handleOptionsButtonClick}>
                <Text>{this.props.label}</Text>
            </TouchableHighlight>
        )
    },
});

```


在ES6下，你需要通过bind来绑定this引用，或者使用箭头函数（它会绑定当前scope的this引用）来调用


```javascript
//ES6
class PostInfo extends React.Component
{
    handleOptionsButtonClick(e){
        this.setState({showOptionsModal: true});
    }
    render(){
        return (
            <TouchableHighlight 
                onPress={this.handleOptionsButtonClick.bind(this)}
                onPress={e=>this.handleOptionsButtonClick(e)}
                >
                <Text>{this.props.label}</Text>
            </TouchableHighlight>
        )
    },
}
```


需要注意的是，不论是bind还是箭头函数，每次被执行都返回的是一个新的函数引用，因此如果你还需要函数的引用去做一些别的事情（譬如卸载监听器），那么你必须自己保存这个引用



```javascript
// 错误的做法
class PauseMenu extends React.Component{
    componentWillMount(){
        AppStateIOS.addEventListener('change', this.onAppPaused.bind(this));
    }
    componentDidUnmount(){
        AppStateIOS.removeEventListener('change', this.onAppPaused.bind(this));
    }
    onAppPaused(event){
    }
}

```


```javascript
// 正确的做法
class PauseMenu extends React.Component{
    constructor(props){
        super(props);
        this._onAppPaused = this.onAppPaused.bind(this);
    }
    componentWillMount(){
        AppStateIOS.addEventListener('change', this._onAppPaused);
    }
    componentDidUnmount(){
        AppStateIOS.removeEventListener('change', this._onAppPaused);
    }
    onAppPaused(event){
    }
}
```

当然你也可以这样做

```javascript
// 正确的做法
class PauseMenu extends React.Component{
    componentWillMount(){
        AppStateIOS.addEventListener('change', this.onAppPaused);
    }
    componentDidUnmount(){
        AppStateIOS.removeEventListener('change', this.onAppPaused);
    }
    onAppPaused = (event) => {
        //把方法直接作为一个arrow function的属性来定义，初始化的时候就绑定好了this指针
    }
}
```


参考链接：


[React/React Native 的ES5 ES6写法对照表
](http://bbs.reactnative.cn/topic/15/react-react-native-%E7%9A%84es5-es6%E5%86%99%E6%B3%95%E5%AF%B9%E7%85%A7%E8%A1%A8)


###Promise

其实已经有一些第三方库实现了 Promise 的功能：Q、when、WinJS、RSVP.js，这些库和 JavaScript 原生 Promise 都遵守一个通用的、标准化的规范：CommonJS组织制定的异步模式编程规范Promises/A+，jQuery 有个类似的方法叫 Deferred，但不兼容 Promises/A+ 规范，于是会有点小问题，使用需谨慎。jQuery 还有一个 Promise 类型，它其实是 Deferred 的缩减版，所以也有同样问题。

JavaScript是从ES6提供Promise对象的，这里简单讲一下原生的Promise。


Promise 对象代表一个异步操作，有三种状态：Pending（进行中）、Resolved（已完成，又称 Fulfilled）和 Rejected（已失败）。Promise 对象的状态改变，只有两种可能：从 Pending 变为 Resolved 和从 Pending 变为 Rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果。就算改变已经发生了，你再对 Promise 对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。


```javascript
var promise = new Promise(function(resolve, reject) {
 if (/* 异步操作成功 */){
 resolve(value);
 } else {
 reject(error);
 }
});

promise.then(function(value) {
 // success
}, function(value) {
 // failure
});
```


Promise很好的解决了异步调用的问题，但是ES7 中有了更加标准的解决方案，新增了 async/await 两个关键词。async 可以声明一个异步函数，此函数需要返回一个 Promise 对象。await 可以等待一个 Promise 对象 resolve，并拿到结果。

async/await 究竟是怎么解决异步调用的写法呢？简单来说，就是将异步操作用同步的写法来写。先来看下最基本的语法（ES7 代码片段）：

```javascript
const f = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123);
    }, 2000);
  });
};

const testAsync = async () => {
  const t = await f();
  console.log(t);
};

testAsync();
```


对比 Promise


```javascript
const f = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123);
    }, 2000);
  });
};

const testAsync = () => {
  f().then((t) => {
    console.log(t);
  });
};

testAsync();
```


关于异步编程，JS里面还另一种访问就是RxJS，Reactive Programming，RP是什么，RP是针对异步数据流的编程，一定程度而言，RP并不算新的概念。Event Bus、点击事件都是异步流。Rx最近比较流行，下次有时间再看吧！

参考链接：


[JavaScript Promises](http://www.html5rocks.com/zh/tutorials/es6/promises/)

[Javascript 中的神器——Promise](http://www.jianshu.com/p/063f7e490e9a)

[JavaScript ES7 中使用 async/await 解决回调函数嵌套问题](http://segmentfault.com/a/1190000002566697)

[「大概可能也许是」目前最好的 JavaScript 异步方案 async/await](https://blog.leancloud.cn/3910/?utm_source=tuicool&utm_medium=referral)

[RxJS 教程](https://segmentfault.com/a/1190000004293922)

###fetch



JavaScript很长时间通过XMLHttpRequest来执行异步网络请求，XMLHttpRequest是基于事件的。[fetch](https://github.com/github/fetch)则是通过Promise来实现的，fetch的返回值是一个Promise对象



```javascript
fetch('https://mywebsite.com/endpoint/', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue',
  })
})
```


如果要异步操作的话

```javascript
fetch('https://mywebsite.com/endpoint.php')
  .then((response) => response.text())
  .then((responseText) => {
    console.log(responseText);
  })
  .catch((error) => {
    console.warn(error);
  });
```


使用ES7的async/await语法来发起一个异步调用


```javascript
async getUsersFromApi() {
  try {
    let response = await fetch('https://mywebsite.com/endpoint/');
    return response.users;
  } catch(error) {
    throw error;
  }
}
```


ES6中还有生成器（Generator），promise 和生成器（Generator）为开发者进行异步编程带来了极大便利。

生成器函数其实是基于迭代器实现的，并且有如下的结构：


```javascript
function *myIterator() {
    while(condition) {
        yield value;    
    }   
}
```


yield关键字负责返回结果，它会暂停迭代器函数的执行直到它被再一次的调用。它也会记住函数的状态， 而不是在下次执行的时候重新运行一切，它能够有效的记住上一次暂停的地方。

将Fetch API和生成器组合起来使用的一个场景是长轮询。 长轮询是一种通过客户端不断发送请求给服务器直到获得响应的技术。生成器可以用于这样的场景来不断的yielding响应直到响应包含数据。 

现在让我们编写生成器函数来不断的调用这个API，每次迭代会返回一个Promise对象。


```javascript
    function *pollForWeatherInfo() {
        while(true) {
            yield fetch('/api/currentWeather', {
                method: 'get'   
            }).then(d => d.json()); 
        }   
    }
```


我们需要一个函数来不断的调用这个函数，并且检查每次返回的Promise是否存在天气信息。 可以使用一个在下一次迭代时调用的递归函数来实现，并且只在发现了从服务器返回的值的时候才暂停这一过程。 下面的代码展示了上述过程的实现


```javascript
function runPolling(generator){
    if(!generator){
        generator = pollForWeatherInfo();
    }

    var p = generator.next();
    p.value.then(function(d){
        if(!d.temperature){
            runPolling(generator);
        } else {
            console.log(d);
        }
    });
}

runPolling();
```


参考链接：

[示例代码源码-FetchAPI-Generators](https://github.com/sravikiran/FetchAPI-Generators)

[使用Fetch API和ES6生成器来构建异步API](http://wwsun.github.io/posts/async-api-using-fetch-and-generators.html)


### npm
react-native开发环境需要使用node.js,npm是Node.js默认的模块管理器，是一个命令行下的软件，用来安装和管理node模块。

Node模块采用npm install命令安装。每个模块可以“全局安装”，也可以“本地安装”。两者的差异是模块的安装位置，以及调用方法。

“全局安装”指的是将一个模块直接下载到Node的安装目录中，各个项目都可以调用。“本地安装”指的是将一个模块下载到当前目录的node_modules子目录，然后只有在当前目录和它的子目录之中，才能调用这个模块。一般来说，全局安装只适用于工具模块，比如npm和grunt。

默认情况下，npm install命令是“本地安装”某个模块。

```
$ npm install <package name>
$ npm install git://github.com/package/path.git
$ npm install git://github.com/package/path.git#0.1.0
$ npm install sax@latest
$ npm install sax@0.1.1
$ npm install sax@">=0.1.0 <0.2.0"

```


使用global参数，可以“全局安装”某个模块。global参数可以被简化成g参数。

```
$ sudo npm install -global [package name]
$ sudo npm install -g [package name]
```


--save：模块名将被添加到packages.json文件的dependencies，可以简化为参数-S。
--save-dev: 模块名将被添加到packages.json文件的devDependencies，可以简化为参数-D。

```
$ npm install sax --save
$ npm install node-tap --save-dev
 或者
$ npm install sax -S
$ npm install node-tap -D
```

npm install默认会安装dependencies字段和devDependencies字段中的所有模块，如果使用production参数，可以只安装dependencies字段的模块。

```
$ npm install --production

```


dependencies是项目中依赖的模块，如果你想要开发自己的npm模块，如果有人要使用，那么他们可能不需要你开发使用的外部测试或者文档框架。在这种情况下，最好将这些附属的项目列在devDependencies中。

参考链接：

[npm模块管理器](http://javascript.ruanyifeng.com/nodejs/npm.html)

[npm的package.json中文文档](https://github.com/ericdum/mujiang.info/issues/6)

[react-native组件库](https://js.coach/react-native/)



### 资源收集

- [江清清的React Native专题](http://www.lcode.org/react-native/)
- [稀土掘金的React Native专题](http://gold.xitu.io/#/tag/React%20Native)
- [React-Native学习指南](https://github.com/ele828/react-native-guide)
- [awesome-react-native](https://github.com/jondot/awesome-react-native)
- [reactnative 组件](https://js.coach/)
- [阮一峰的es6资料](http://es6.ruanyifeng.com)
- [React-Native入门指南](https://github.com/vczero/react-native-lesson)


部分转载:https://github.com/coderyi/blog/blob/master/articles/2016/0122_react-native_first_lesson.md
[coderyi](https://github.com/coderyi)