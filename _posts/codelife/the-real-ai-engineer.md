---
title: "AI 编程助手发展历程记录"
date: 2025-04-24
summary: "本文梳理了 AI 编程助手的五个发展阶段，从最初的代码补全功能到现代智能代理模式，详细分析了每个阶段的特点、能力边界和对开发者工作方式的改变。"
tags: [AI, Agent]
---

## AI 编程助手的演进之路

作为一名开发者，见证了 AI 编程助手从简单补全到智能Agent的快速发展。

### 第一阶段：局部补全 Copilot

2021 年，GitHub 发布了 Copilot，它能在你敲代码时给出自动补全建议，能节省重复敲代码的时间，自动完成简单的代码片段。

![GitHub Copilot 自动补全功能](https://h5.ahmq.net/res/mweb/2025-04/24_17454867708817.jpg?x-oss-process=style/mweb-image)

这一阶段就像给你一个打字助手：你写一句，AI 猜下一句。方便快捷，但只能帮忙"猜"代码。你需要写更好的给功能进行命名和注释，才能让 AI 理解你的意图。

### 第二阶段：对话式辅助（Chat）

AI 聊天助手出现后，你可以用自然语言和它对话，比如"帮我写一个简单的`Express Web Server`"。

![AI 聊天助手对话式编程](https://h5.ahmq.net/res/mweb/2025-04/24_17454867708834.jpg?x-oss-process=style/mweb-image)

现在它能生成完整的小功能或模块了，你提需求，它给一些答案，但生成的代码你还需要进一步审查调整，也不能理解其他文件中的配置。

### 第三阶段：AI 编辑模式（Edit）

为了解决复制粘贴的麻烦，编辑模式应运而生。

![AI 编辑模式直接修改代码](https://h5.ahmq.net/res/mweb/2025-04/24_17454867708842.jpg?x-oss-process=style/mweb-image)

现在它可以直接在你的项目文件里增删改，并清晰对比改动位置，仍需要确认每次改动。

### 第四阶段：智能体时代（Agent）

Agent 模式是真正的飞跃。AI 拥有"自主执行任务"的能力，能感知环境、调用工具、记住偏好，并自己规划多步流程，比如我想给某个组件编写一个单元测试，它会自行检测项目环境、是否需要安装依赖、生成测试文件和代码、遇到失败尝试自我修复。

![Copilot 智能代理模式](https://h5.ahmq.net/res/mweb/2025-04/24_17454867708853.webp)

<Callout title="智能代理的工作流程">
1. 理解用户任务需求
2. 分析项目结构和环境
3. 规划执行步骤
4. 自主调用工具完成任务
5. 遇到错误时自我修复
</Callout>

整个过程像一个实习工程师：主动搞定一切，只要你确认即可。它能深度理解项目结构和依赖，包括你的编码习惯和偏好。现在你能交给它一些繁琐任务，你负责审查和把关了。此时AI还是局限于项目自身，缺乏调用外部工具和访问私有资源的能力，比如生成数据库表结构、调用API等任务。

### 第五阶段：Agent + MCP

为了让 Agent 更好地调用各种外部工具，需要统一接入标准。Anthropic 在 2024 年提出 MCP 协议：

- 外部应用只需实现 MCP 接口，无需为每个模型写接入代码
- AI 通过 MCP 服务安全地访问私有资源

你可以快速安装第三方 MCP 服务，让 Agent 可以访问公司内网、Figma、执行文件操作、访问数据库等。

![MCP 协议扩展 AI 能力边界](https://h5.ahmq.net/res/mweb/2025-04/24_17454867708868.jpg?x-oss-process=style/mweb-image)

<Cards>
  <Card title="Model Context Protocol">
    MCP 是一种标准化协议，允许 AI 模型安全地与外部工具和服务交互
  </Card>
  <Card title="扩展 AI 能力边界">
    通过 MCP，AI 可以访问企业内部资源、执行复杂操作，突破原有限制
  </Card>
</Cards>

### MCP 的一些核心概念

MCP 是一个开放协议，用于标准化应用程序向大语言模型（LLM）提供上下文的方式。你可以把 MCP 想象成 AI 应用程序的 USB-C 接口。就像 USB-C 为各种设备与外设之间的连接提供了统一标准一样。

```ts tab="Mcp Server"
// McpServer 是 MCP 协议的核心接口。它负责连接管理、协议合规性和消息路由：
const server = new McpServer({
  name: "My App",
  version: "1.0.0"
});
```

```ts tab="Mcp Static Resource"
// 资源是您向其公开数据的方式。它们类似于 REST API 中的 GET 端点 - 它们只提供数据
server.resource(
  "config",
  "config://app",
  async (uri) => ({ contents: [{ uri: uri.href, text: "App configuration here" }] })
)
```

```ts tab="Mcp Dynamic Resource"
// 动态资源允许您根据请求参数动态生成数据。
server.resource(
  "user-profile",
  new ResourceTemplate("users://{userId}/profile", { list: undefined }),
  async (uri, { userId }) => ({ contents: [{ uri: uri.href, text: `Profile data for user ${userId}`}]})
);
```

```ts tab="Mcp Tools"
// 工具允许您通过服务器执行操作。与资源不同，工具需要执行计算并产生副作用：
server.tool(
  "fetch-weather",
  { city: z.string() },
  async ({ city }) => {
    const response = await fetch(`https://api.weather.com/${city}`);
    const data = await response.text();
    return { content: [{ type: "text", text: data }] }
  }
)
```

```ts tab="Mcp Prompts"
// 提示是可重复使用的模板，可帮助您有效地与服务器交互：
server.prompt(
  "review-code",
  { code: z.string() },
  ({ code }) => ({
    messages: [{ role: "user", content: { type: "text", text: `Please review this code:\n\n${code}` } }]
  })
);
```

## 结语

现阶段 AI 可以大幅提升效率，然而质量和安全，依然需要有经验的工程师全程监督。

AI 仍然在高速迭代和发展，也许不久的将来就会出现真正的AI工程师，到时候工程师的角色会发生怎样的变化呢？
