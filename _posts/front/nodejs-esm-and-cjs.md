---
title: "Node.js 演进过程中，为了同时兼容 CJS 和 ESM 做了哪些工作"
date: 2025-09-29
summary: "Node.js 为了同时支持历史悠久的 CommonJS 与标准化的 ECMAScript Modules，在解析、加载、互操作、包导出、运行时 API、缓存以及可扩展性上做了大量工程与折中。本文从设计原则到实战代码、常见陷阱与迁移策略"
tags: [Node.js, ESM, CommonJS]
---

Node 最初以 CommonJS（`require()` / `module.exports`）为核心，随着标准的演进，ESM（`import`/`export`）成为标准。为了兼容庞大的既有生态（大量 CJS 包）并同时支持标准化 ESM，Node 在实现层同时维护两套加载机制、并实现互操作桥接与包级别的选择，以尽量减小破坏性变更。


## 如何区分模块类型（.mjs / .cjs / .js + `type`）

Node 给出明确的文件/包层级规则，让同一仓库能混用两套模块系统：

* 文件扩展名强制：
  * `.mjs` → 始终按 ESM 解析。
  * `.cjs` → 始终按 CommonJS 解析。
* `.js` 的语义由最近的 `package.json` 的 `"type"` 字段决定：
  * `"type": "module"` 时，`.js` 当作 ESM。
  * 否则（缺省或 `"type": "commonjs"`）`.js` 当作 CJS。
* 包级入口与更细粒度控制用 `exports`、`imports` 字段

**示例 package.json：**

```json
{
  "type": "module",
  "exports": {
    ".": {
      // 入口文件按 ESM 解析 `import pkg from 'pkg'`
      "import": "./dist/index.mjs",
      // 入口文件按 CJS 解析 `const pkg = require('pkg')`
      "require": "./dist/index.cjs"
    }
  }
}
```

## 两个 loader 的差别（运行时语义）

* **加载方式**

  * CJS：同步、即时执行，使用 `require()`，Node 在内部用函数包装（`(function (exports, require, module, __filename, __dirname){ ... })`）来给模块提供常用变量。
  * ESM：规范化、异步的加载（尤其是解析 / 循环依赖处理更严格），`import`/`export` 静态可解析，支持顶层 `await`。

* **全局/上下文变量**

  * CJS：`__dirname`, `__filename`, `require`, `module`, `exports` 可直接使用。
  * ESM：因为没有 wrapper，需使用 `import.meta.url` 代替 `__filename/__dirname`。若需要 `require`，可以用 `createRequire`。

* **解析规则**

  * ESM 更接近 URL 语义，要求显式扩展名（`.js`/`.mjs`/`.cjs`），并有更严格的静态解析要求。CJS 在解析上更灵活（可省略扩展名、目录 `index.js` 等）。

## 互操作（规则、约束、实战代码）

### CJS → 引入 ESM

不能直接用 `require('./esm.mjs')` — 会抛 `ERR_REQUIRE_ESM`。在 CJS 环境中使用 ESM 须使用动态 `import()`（返回 Promise）：

```js
// index.cjs (CommonJS)
(async () => {
  const esm = await import('./lib/esm-only.mjs');
  console.log(esm.default ?? esm); // ESM 的 export
})();
```

### ESM → 引入 CJS

可以直接 `import pkg from 'cjs-package'`。Node 会把 CJS 的 `module.exports` 作为 ESM 的 **default export**，并尝试通过静态分析把常见的命名导出绑定为命名 export（作为便捷），但这只是“启发式”的——并不总是准确。

示例：

```js
// example.mjs (ESM)
import pkg from './sibling.cjs';
console.log(pkg.someProp); // works if sibling.cjs exports { someProp }
```

**注意**：如果 CJS 使用复杂计算/运行时赋值给 `module.exports`，静态分析可能检测不到“命名导出”，这会导致命名导入不可用（推荐使用 default import 或在 CJS 中把命名导出挂到 `module.exports.x = ...` 的显式模式）。

---

### 在 ESM 中动态加载 CJS

```js
// tools.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

function logic() {
    const pkg = require('./legacy.cjs');
    const config = require('./config.json');
}
```

（`createRequire` 适用于需要 `require.resolve`、加载 native addons、或兼容老工具链的场景。）

### 在 CJS 中动态加载 ESM

```js
// entry.cjs
async function run() {
  const mod = await import('./new-esm.mjs');
  mod.doWork();
}
```

## 包发布：`exports` / 条件导出（Dual-package）与策略

* `main` 是历史字段，但已经不足以表示多种入口（ESM vs CJS），所以 Node 支持 `exports` 字段来显式声明包的导入路径（并能做条件分支）。通过 `exports`，包作者可以为 `import` 与 `require` 指定不同入口，例如：`"import": "./dist/index.mjs"`, `"require": "./dist/index.cjs"`。这允许单个包同时支持两种消费者（ESM 与 CJS）。


## 缓存与热重载差异（`require.cache` vs ESM 的缓存）

* CJS 的模块缓存是可以通过 `require.cache` 直接访问与清理的（许多热重载 / 测试场景基于此）。
* ESM 的 loader 有**单独的缓存实现**（基于 URL 语义），`require.cache` 对 ESM 无效（无法直接清理）。要“重新加载”一个 ESM，可以使用动态 import 并通过改变导入的 specifier（比如加 query/fragment）来实现“cache-bust”重新评估。

## Loader hooks（自定义 ESM 加载器）与更深层次的扩展点

Node 提供了模块定制化的能力（loader hooks / customization hooks），允许在 ESM 层面自定义解析与加载行为，例如实现类似 CommonJS 的解析策略、支持从远端加载模块或进行即时转译。历史上这类 API 曾经是实验性的，并随着 Node 版本逐步演进；Node 也提供了 `module.register` / `module.registerHooks` 等 API 来注册同步/异步 hook。注意：这些 hook 主要影响 ESM 加载流程，对直接使用 CJS `require()` 的加载路径影响有限。
