---
title: "React 中受控和非受控表单的区别及应用场景"
date: 2021-11-06
summary: "详细解析React中受控组件与非受控组件的实现原理、优缺点对比及使用场景，帮助开发者选择适合项目需求的表单处理模式"
tags: [React, 前端, 组件]
---

## 表单处理的两种方式

在 React 应用中，处理表单输入有两种基本方式：受控组件（Controlled Components）和非受控组件（Uncontrolled Components）。这两种模式各有优缺点，适用于不同的场景。许多开发者对何时使用哪种模式感到困惑，本文将详细解析二者的区别及应用场景。

## 受控组件 vs 非受控组件

**受控组件**是由 React 控制并管理其状态的表单元素。当用户与表单交互时：
- 输入值存储在 React 的 `state` 中
- 通过 `onChange` 事件更新状态
- 表单显示的值由 React 的 `state` 决定

**非受控组件**则更接近传统 HTML 表单元素，其状态由 DOM 自身管理：
- React 不跟踪组件内部状态
- 需要时通过引用（`ref`）获取 DOM 元素的值
- 更简单但功能相对有限

## 非受控组件详解

非受控组件让 DOM 处理大部分表单数据，仅在需要时（如表单提交）才读取值：

```jsx
function UncontrolledForm() {
  // 创建引用以访问 DOM 节点
  const inputRef = React.useRef();
  
  const handleSubmit = (event) => {
    event.preventDefault();
    // 直接从 DOM 读取值
    alert('用户名: ' + inputRef.current.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">用户名:</label>
        <input 
          type="text" 
          id="username" 
          ref={inputRef} 
          defaultValue="请输入用户名" 
        />
      </div>
      <button type="submit">提交</button>
    </form>
  );
}
```

### 设置默认值

非受控组件可以设置初始默认值，但后续不由 React 控制更新：

```jsx
<input defaultValue="默认文本" type="text" ref={inputRef} />
```

各表单元素的默认值属性：

| 元素 | 默认值属性 |
| :--- | :---: |
| `<input type="text">` | `defaultValue` |
| `<input type="checkbox">` | `defaultChecked` |
| `<input type="radio">` | `defaultChecked` |
| `<textarea>` | `defaultValue` |
| `<select>` | `defaultValue` |

## 受控组件详解

受控组件将表单数据托管给 React 组件的 `state`，使 React 成为"单一数据源"：

```jsx
function ControlledForm() {
  const [name, setName] = React.useState('');
  
  const handleChange = (event) => {
    setName(event.target.value);
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    alert('提交的用户名: ' + name);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">用户名:</label>
        <input 
          type="text" 
          id="name" 
          value={name} 
          onChange={handleChange} 
          placeholder="请输入用户名"
        />
      </div>
      <button type="submit">提交</button>
    </form>
  );
}
```

### 实现原理

受控组件的工作流程：

1. 初始状态设置 - `useState('')`
2. 用户输入字符 'a' - 触发 `onChange` - `setName('a')`
3. React 重新渲染，input 显示 'a'
4. 用户继续输入 'b' - 触发 `onChange` - `setName('ab')`
5. 再次重新渲染，input 显示 'ab'

> 这种方式使数据流非常清晰，并且使实时表单验证、条件禁用按钮等功能变得简单。

## 各类表单元素的受控实现

不同类型的表单元素有不同的受控属性和事件处理方式：

| 元素 | 值属性 | 变更回调 | 回调中获取新值 |
| :--- | :---: | :---: | :---: |
| `<input type="text">` | `value="string"` | `onChange` | `event.target.value` |
| `<input type="checkbox">` | `checked={boolean}` | `onChange` | `event.target.checked` |
| `<input type="radio">` | `checked={boolean}` | `onChange` | `event.target.checked` |
| `<textarea>` | `value="string"` | `onChange` | `event.target.value` |
| `<select>` | `value="option value"` | `onChange` | `event.target.value` |

## 文件输入处理

文件输入在 React 中是一个例外情况：

```jsx
<input type="file" />
```

⚠️ `<input type="file">` 在 React 中始终是非受控组件，因为其值只能由用户设置，不能通过程序控制。处理文件上传时，通常使用 `ref` 和 FormData API：

```jsx
function FileUploadForm() {
  const fileInput = React.useRef();
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const file = fileInput.current.files[0];
    // 处理文件上传逻辑
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={fileInput} />
      <button type="submit">上传</button>
    </form>
  );
}
```

## 选择指南

根据以下特性需求选择合适的表单控制模式：

| 需求特性 | 非受控组件 | 受控组件 |
| :--- | :---: | :---: |
| 一次性获取值（如提交时） | ✅ | ✅ |
| 提交时验证 | ✅ | ✅ |
| 实时表单验证 | ❌ | ✅ |
| 根据条件禁用提交按钮 | ❌ | ✅ |
| 强制输入特定格式 | ❌ | ✅ |
| 一个数据绑定多个输入 | ❌ | ✅ |
| 动态表单字段 | ❌ | ✅ |
| 实现简单度 | ✅ | ❌ |
| 性能（适用于大型表单） | ✅ | ❌ |

## 经验总结

1. **简单表单**：如果只在提交时需要表单数据，使用非受控组件更简单
2. **复杂交互**：如果需要实时验证或动态字段，使用受控组件
3. **混合使用**：在同一表单中，可以混合使用受控和非受控元素
4. **性能考量**：对于特别大的表单，考虑使用非受控组件减少重渲染

> 根据项目需求和复杂度选择合适的表单处理方式，能大幅提升开发效率和用户体验。

## 参考资源

- [React 官方文档 - 表单](https://zh-hans.reactjs.org/docs/forms.html)
- [React 官方文档 - 事件系统](https://zh-hans.reactjs.org/docs/events.html)
- [Controlled and uncontrolled form inputs in React](https://goshacmd.com/controlled-vs-uncontrolled-inputs-react/)
