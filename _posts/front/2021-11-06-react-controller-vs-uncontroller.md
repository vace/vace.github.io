---
layout: post
title:  React 中受控和非受控的表单的区别以及场景
categories: [前端]
tags: [javascript,react]
---

React 有两种不同的方式来处理表单输入。

如果一个 input 表单元素的值是由 React 控制，就其称为受控组件。当用户将数据输入到受控组件时，会触发修改状态的事件处理器，这时由你的代码来决定此输入是否有效（如果有效就使用更新后的值重新渲染）。如果不重新渲染，则表单元素将保持不变。

一个非受控组件，就像是运行在 React 体系之外的表单元素。当用户将数据输入到表单字段（例如 input，dropdown 等）时，React 不需要做任何事情就可以映射更新后的信息。然而，这也意味着，你无法强制给这个表单字段设置一个特定值。

在很多文章中说不应该使用`setState`或`ref`，甚至有些理论自相矛盾，很难理解如何正确的处理react中的表单，甚至没有相对统一的标准。

到底应该怎么做表单呢？毕竟表单是许多web应用程度的核心，然而在`react`中处理表单，总有些不舒服，比如受控模式（`controlled`）和非受控模式（`uncontrolled`）的使用场景区别。

#### 非受控模式（uncontrolled）

不受控输入和传统的HTML表单差不多，在提交或者使用时再去读取他的值，例如：

```jsx
class Form extends Component {
  constructor (props) {
    super(props)
    this.input = React.createRef()
  }
  onSubmitClick: () => {
    alert(this.input.current.value)
  }

  render () {
    return (
      <div>
        <input type="text" ref={this.input} />
        <button onClick={this.onSubmitClick}>登陆用户</button>
      </div>
    )
  }
}

```

换句话说，必须在需要的时候，从dom中读取出字段值，比如提交表单的时候，这是实现表单输入的最简单方法，不过这个功能，在一些场景中可能不太合适，所以接下来我们看看受控模式下的表单。

**注意：在非受控组件中，经常期望赋予组件一个初始值，但是后续不去更新，这种情况下可指定一个`defaultValue`，在一个组件已经挂载之后，是更新defaultValue的值，不会造成dom上的任何更新**

```jsx
function AppRender () {
  const input = React.createRef()
  const onHandleSubmit = () => {
    alert(input.current.value)
  }
  return (
    <form onSubmit={onHandleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}
```

| 元素	| 默认值 |
| :--  | :---:  |
| `<input type="checkbox">` | `defaultChecked` |
| `<input type="radio">` | `defaultChecked` |
| `<input>` | `defaultValue` |
| `<textarea>` | `defaultValue` |
| `<select>` | `defaultValue` |

#### 受控模式（controlled）

一个受控输入组件会接收当前的值作为`prop`，使用回调函数改变这个值，或者说是一种更`react`的方式。

```jsx
<input value={someValue} onChange={onHandleChange}>
```

通常表单输入的值会保存在当前组件的`state`上，也可以在另外的组件`state`上，甚至是`redux`之类的单独状态存储器中。

```jsx
class Form extends Components {
  constructor (props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  onHandleName (e) {
    this.setState({ name: event.target.value  })
  }

  render () {
    return (
      <div>
        <input
          type="text"
          value={this.state.name}
          onChange={this.onHandleName}
        />
      </div>
    )
  }
}
```

👆🏻上面的案例中每次输入新的字符是，都会实时通过`onChange`更新`state`，

- 从一个空字符串开始 - `state = {name: ''}`
- 输入a时，`value="a"` - `setState({ name: 'a' })`
- 输入b时，`value="ab"` - `setState({ name: 'ab' })`

这种流程会将表单值的变更推送到`Form`组件，所以`Form`组件始终具有当前输入的值，这意味着数据`state`和UI`input`始终保持同步，状态为输入提供值，输入要求`Form`更改当前值，这意味着表单组件可以立即响应更改数据，例如：

- 反馈表单状态，如输入验证
- UI状态与输入相关，如未填写必填字段时，禁用按钮
- 强制输入特定格式数据，如手机号、信用卡号的输入

如果应用中不需要这些，那么使用受控组件和非受控组件区别不大。

#### 如何使元素受控？

除了基础的`input`元素，表单还包含其他的各类元素，如`select`和`textarea`，如果通过`prop`设置表单元素的值，则表单将被控制，为受控组件，就是这么简单。

但是不同的表单元素都有不同的属性来设置该值：


| 元素	| value	| 更改回调	| 回调中的新值 |
| :--  | :-----:| :----:  | :----:  |
|`<input type="text" />` |	`value="string"`	| `onChange` |	`event.target.value` |
|`<input type="checkbox" />` |	`checked={boolean}`	| `onChange` |	`event.target.checked` |
|`<input type="radio" />` |	`checked={boolean}`	| `onChange` |	`event.target.checked` |
|`<textarea />` |	`value="string"`	| `onChange` |	`event.target.value` |
|`<select />` |	`value="option value"`	| `onChange` |	`event.target.value` |

#### 文件输入`File`

在 HTML 中，`<input type="file">` 可以让用户选择一个或多个文件上传到服务器，或者通过使用 File API 进行操作。

```html
<input type="file" />
```

在 React 中，`<input type="file" />` 始终是一个非受控组件，因为它的值只能由用户设置，而不能通过代码控制。


#### 总结

受控组件和非受控表单组件都具有有点，应该根据具体场景进行选择，如果UI反馈非常简单，则无需关注这些问题

| 特征 | 不受控制的 | 受控 |
| :--: |:--: |:--: |
| 一次性值（如提交时） | ✅ |	✅ |
| 提交时验证 | ✅ |	✅ |
| 实时数据验证 | ❌ |	✅ |
| 有条件地禁用提交按钮 | ❌ |	✅ |
| 强制输入格式 | ❌ |	✅ |
| 一个数据的多个输入 | ❌ |	✅ |
| 动态输入 | ❌ |	✅ |


#### 总结

[官方 React 文档上的表单页面](https://zh-hans.reactjs.org/docs/forms.html)
[官方 React 文档上的支持事件](https://zh-hans.reactjs.org/docs/events.html)
[Controlled and uncontrolled form inputs in React don't have to be complicated](https://goshacmd.com/controlled-vs-uncontrolled-inputs-react/)

