---
title: "Awesome Redux Libraries and Resources"
date: 2017-03-21
summary: "A curated list of Redux libraries and resources covering architecture, utilities, side effects, dev tools, integrations (React, Flux, RxJS, etc.), and learning materials."
tags: [JavaScript, React]
---

`Redux`是`JavaScript`应用程序的状态容器.

- 官方网站： [`devarchy.com/redux`](https://devarchy.com/redux)
- 使用`devarchy`将库添加到目录中

## Code Architecture

- [`redux-schema`](https://github.com/ddsol/redux-schema) - `Redux`的自动操作，缩减器和验证.
- [`redux-tcomb`](https://github.com/gcanti/redux-tcomb) - `Redux`的不可变和类型检查状态和操作.
- [`redux-action-tree`](https://github.com/cerebral/redux-action-tree) - 使用`Redux`运行的脑信号.
- [`redux-elm`](https://github.com/salsita/redux-elm) - `JavaScript`中的`Elm`架构.


## Utilities

- [`redux-orm`](https://github.com/tommikaikkonen/redux-orm) - 小而简单且不可变的`ORM`，用于管理`Redux`存储中的关系数据.
- [`redux-api-middleware`](https://github.com/agraboso/redux-api-middleware) - 用于调用`API`的`Redux`中间件.
- [`redux-ignore`](https://github.com/omnidan/redux-ignore) - 高阶`reducer`忽略`Redux`动作.
- [`redux-modifiers`](https://github.com/calvinfroedge/redux-modifiers) - 用于编写`Redux Reducer`以在各种数据结构上运行的通用函数的集合.
- [`rereduce`](https://github.com/slorber/rereduce) - `Redux`的`Reducer`库.
- [`redux-search`](https://github.com/treasure-data/redux-search) - 用于客户端搜索的`Redux`绑定.
- [`redux-logger`](https://github.com/evgenyrodionov/redux-logger) - `Redux`的`Logger`中间件.
- [`redux-immutable`](https://github.com/gajus/redux-immutable) - `redux-immutable`用于创建与`Immutable.js`状态一起使用的`Redux` `combineReducers`的等效函数.
- [`reselect`](https://github.com/reactjs/reselect) - `Redux`的选择器库.
- [`redux-requests`](https://github.com/idolize/redux-requests) - 使用`Redux` `reducer`管理正在进行的请求，以避免发出重复请求.
- [`redux-undo`](https://github.com/omnidan/redux-undo) - 更高级的`reducer`，用于向`Redux`状态容器添加撤消/重做功能.
- [`redux-bug-reporter`](https://github.com/dtschust/redux-bug-reporter) - `Redux`的Bug报告器和错误播放工具.
- [`redux-transducers`](https://github.com/acdlite/redux-transducers) - `Redux`的`transducer`实用程序.


### Store Persistence

- [`redux-storage`](https://github.com/michaelcontento/redux-storage) - `Redux`的持久层，具有灵活的后端.
- [`redux-persist`](https://github.com/rt2zz/redux-persist) - 坚持和补充`Redux`商店.


### Side Effects

*副作用/异步动作 (`Side Effects`/`Async Actions`)*

- [`redux-saga`](https://github.com/yelouafi/redux-saga) - `Redux`应用程序的替代副作用模型.
- [`redux-promise-middleware`](https://github.com/pburtchaell/redux-promise-middleware) - `Redux`中间件，用于通过条件乐观更新来解决和拒绝`Promise`.
- [`redux-effects`](https://github.com/redux-effects/redux-effects) - 你编写纯函数，`redux-effects`处理其余的函数.
- [`redux-thunk`](https://github.com/gaearon/redux-thunk) - `Redux`的`Thunk`中间件.
- [`redux-connect`](https://github.com/makeomatic/redux-connect) - 提供装饰器来解析`react-router`中的异步`props`，对于在`React`中处理服务器端渲染非常有用.
- [`redux-loop`](https://github.com/redux-loop/redux-loop) - `Elm`效果的端口和`Elm`架构到`Redux`，它允许您自然而纯粹地通过从`reducer`返回它们来对您的效果进行排序.
- [`redux-side-effects`](https://github.com/salsita/redux-side-effects) - `Redux`工具套件，用于在`reducer`内保持所有副作用，同时保持其纯度.
- [`redux-logic`](https://github.com/jeffbski/redux-logic) - 用于组织业务逻辑和动作副作用的`Redux`中间件.
- [`redux-observable`](https://github.com/redux-observable/redux-observable) - 使用“Epics”在`Redux`中实现动作副作用的`RxJS`中间件.
- [`redux-ship`](https://github.com/clarus/redux-ship) - 可组合，可测试和可打字的副作用.


## Code Style

- [`redux-act`](https://github.com/pauldijou/redux-act) - Opinionated lib为`Redux`创建`action`和`reducer`.
- [`redux-crud`](https://github.com/Versent/redux-crud) - `Redux` `CRUD`应用程序的标准`action`和`reducer`集.


## Dev tools / Inspection tools

- [`redux-devtools-inspector`](https://github.com/alexkuz/redux-devtools-inspector) - 另一个`Redux DevTools`监视器.
- [`redux-diff-logger`](https://github.com/fcomb/redux-diff-logger) - `Redux`状态之间的差异记录器.
- [`redux-devtools-chart-monitor`](https://github.com/romseguy/redux-devtools-chart-monitor) - `Redux DevTools`的图表监视器.
- [`redux-devtools`](https://github.com/gaearon/redux-devtools) - 用于`Redux`的`DevTools`，具有热重新加载，动作重放和可自定义的UI.
- [`redux-devtools-dispatch`](https://github.com/YoruNoHikage/redux-devtools-dispatch) - 手动发送您的`action`以测试您的应用是否反应良好.
- [`redux-devtools-dock-monitor`](https://github.com/gaearon/redux-devtools-dock-monitor) - `Redux DevTools`显示器的可调整大小和可移动的底座.
- [`redux-devtools-filterable-log-monitor`](https://github.com/bvaughn/redux-devtools-filterable-log-monitor) - `Redux DevTools`的可过滤树视图监视器.
- [`redux-devtools-log-monitor`](https://github.com/gaearon/redux-devtools-log-monitor) - 具有树视图的`Redux DevTools`的默认监视器.
- [`remote-redux-devtools`](https://github.com/zalmoxisus/remote-redux-devtools) - 远程`Redux DevTools`.


## React Integration

- [`redux-test-recorder`](https://github.com/conorhastings/redux-test-recorder) - `Redux`中间件，通过`UI`交互自动生成`Reducer`测试.
- [`react-redux`](https://github.com/reactjs/react-redux) - `Redux`的官方`React`绑定.
- [`react-easy-universal`](https://github.com/keystonejs/react-easy-universal) - Universal Routing & Rendering with `React` & `Redux` was too hard. Now it's easy.
- [`redux-form-material-ui`](https://github.com/erikras/redux-form-material-ui) - 一组包装器组件，以便于使用带有`Redux Form`的`Material UI`.


### Routing

- [`redux-async-connect`](https://github.com/Rezonans/redux-async-connect) - 它允许您请求异步数据，将它们存储在`Redux`状态并将它们连接到您的`React`组件.
- [`redux-tiny-router`](https://github.com/Agamennon/redux-tiny-router)   - 为`Redux`制作的路由器，适用于通用应用程序. 停止使用路由器作为控制器，它只是状态.
- [`redux-router`](https://github.com/acdlite/redux-router) - `React Router`的`Redux`绑定 - 将您的路由器状态保留在`Redux`存储区中.
- [`react-router-redux`](https://github.com/reactjs/react-router-redux) - 无情的简单绑定，以保持`react-router`和`Redux`同步.
- [`ground-control`](https://github.com/raisemarketplace/ground-control) - `React Router`＆`Redux`的可扩展的`reducer`管理和强大的数据获取功能.


### Forms

- [`redux-form`](https://github.com/erikras/redux-form) - 使用`react-redux`在`Redux`存储中保持表单状态的高阶组件.
- [`react-redux-form`](https://github.com/davidkpiano/react-redux-form) - 使用`Redux`在`React`中轻松创建表单.


### Component State

- [`redux-react-local`](https://github.com/threepointone/redux-react-local) - 通过`Redux`的本地组件状态.
- [`redux-ui`](https://github.com/tonyhb/redux-ui) - `React Redux`的简易UI状态管理.


## Other Integrations


### Flux

- [`redux-actions`](https://github.com/acdlite/redux-actions) - `Redux`的`Flux`标准动作实用程序.
- [`redux-promise`](https://github.com/acdlite/redux-promise) - 适用于`Redux`的`FSA`兼容`Promise`中间件.


### Backbone

- [`backbone-redux`](https://github.com/redbooth/backbone-redux) - Easy way to keep your `Backbone` collections and `Redux` store in sync.


### Falcor

- [`redux-falcor`](https://github.com/ekosz/redux-falcor) - 将`Redux`前端连接到您的`Falcor`后端.


### RxJS

- [`redux-observable`](https://github.com/redux-observable/redux-observable) - 使用“Epics”在`Redux`中实现动作副作用的`RxJS`中间件.
- [`rx-redux`](https://github.com/jas-chen/rx-redux) - 使用`RxJS`重新实现`Redux`.
- [`redux-rx`](https://github.com/acdlite/redux-rx) - `Redux`的`RxJS`实用程序.
- [`redurx`](https://github.com/shiftyp/redurx) - `Redux`'ish Functional State Management using `RxJS`.


### Electron

- [`redux-electron-store`](https://github.com/samiskin/redux-electron-store) - `Redux`存储增强器，允许`Electron`过程之间的自动同步.


### Deku

- [`deku-redux`](https://github.com/troch/deku-redux) - `Deku` v2中`Redux`的绑定.


### Other

- [`redux-rollbar-middleware`](https://github.com/netguru/redux-rollbar-middleware) - `Redux`中间件，它包含`action`中的异常并将它们发送到具有当前状态的`Rollbar`.
- [`kasia`](https://github.com/outlandishideas/kasia) - 针对`WordPress API`的`React Redux`工具集.


## Boilerplate

*锅炉/脚手架/入门套件/发电机/堆叠套装 (`Boilerplate`/`Scaffolding`/`Starter Kits`/`Generators`/`Stack Ensembles`)*

- [`redux-cli`](https://github.com/SpencerCDixon/redux-cli) - 用于更快地构建`Redux` / `React`应用程序的意见`CLI`.
- [`reactuate`](https://github.com/reactuate/reactuate) - `React` / `Redux`堆栈（不是样板工具包）.
- [`react-chrome-extension-boilerplate`](https://github.com/jhen0409/react-chrome-extension-boilerplate) - 用于`Chrome`扩展`React.js`项目的`Boilerplate`.
- [`universal-redux`](https://github.com/bdefore/universal-redux)   - `Npm`包，可让您直接使用通用（同构）渲染编写`React`和`Redux`编码. 如果您愿意，只管理`Express`设置或`Webpack`配置.
- [`generator-react-aspnet-boilerplate`](https://github.com/pauldotknopf/react-aspnet-boilerplate) - 使用`ASP.NET Core 1`构建同构`React`应用程序的起点，利用现有技术.
- [`generator-redux`](https://github.com/banderson/generator-redux) - 用于`Redux`的`CLI`工具：使用`devtools`的下一代功能`Flux` / `React`.
- [`generator-react-webpack-redux`](https://github.com/stylesuxx/generator-react-webpack-redux) - `React Webpack` Generator，包括`Redux`支持.
- [`socrates`](https://github.com/matthewmueller/socrates) - 小型（8kb），包含电池的`Redux`商店，以减少样板并促进良好习惯.


## Miscellaneous

- [`redux-core`](https://github.com/jas-chen/redux-core) - 最小的`Redux`.


## Learning Material

- **`Redux`的概念**

   [`Redux` official documentation](http://redux.js.org/) 在解释`Redux`的核心原则方面做得非常出色.

- **为什么不可变数据结构**

   该 [guide on performance](https://facebook.github.io/react/docs/advanced-performance.html) `React`的官方文档很好地解释了不可变数据结构是什么以及它们为何扮演重要角色.

- **副作用 (`Side Effects`)**

   [`Redux Loop`'s readme](https://github.com/redux-loop/redux-loop) 在`Redux`的上下文中提供了对`Side Effects`的深入了解.

阅读上述材料将为您使用`Redux`编写应用程序提供良好的开端.
如果您对更多内容感到好奇，请查看以下资源.

- **函数式编程 - 基础知识**

   这个 [post](http://jaysoo.ca/2016/01/13/functional-programming-little-ideas/) 在构建`YouTube`即时搜索演示应用程序时，介绍了函数式编程的基本概念.

- **反应式编程 (`Reactive Programming`)**

   这个 [introduction to Reactive Programming](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) 详细解释了反应式编程.

- **函数式编程 - 超越**

   写得好 [article](https://medium.com/@chetcorcos/functional-programming-for-javascript-people-1915d8775504) 讨论了在函数式语言中实现的有趣的计算机科学概念以及它们如何应用于`JavaScript`.

- **`Monads`**

   对`monads`感到好奇吗？ 维基百科给了一个好处 [overview on monads](https://en.wikipedia.org/wiki/Monad_(functional_programming)) 和 [this article](http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html) 通过图形和简单示例更详细地解释了`monads`.


## Community

- [`Reddit`](https://www.reddit.com/r/reduxjs/)
- [`Stack Overflow`](http://stackoverflow.com/questions/tagged/redux)
- [`Discord`](https://discord.gg/0ZcbPKXt5bZ6au5t)
- [`Slack`](http://slack.redux.io/)
- [`Gitter`](https://gitter.im/reactjs/redux)
- [`#rackt` on freenode](https://webchat.freenode.net/)
