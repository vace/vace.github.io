---
title: "在 Docker 容器中调用宿主机 Docker 的方案（Docker in Docker）"
date: 2025-11-23
summary: "详细介绍在 Docker 容器中调用宿主机 Docker 的完整实践方案，包括核心原理、轻量化安装、实际使用场景和安全考虑。"
tags: [Docker, DevOps, CI/CD, Container]
---

在容器化架构中，我们经常需要在一个业务容器内部执行宿主机的 `Docker` 命令，用来完成构建任务、运行临时容器、生成构建产物等。比如：

* 后端服务需要调用一个打包镜像完成 `Android/iOS` 构建
* `CI` 系统需要在隔离环境中执行容器命令
* 某些业务逻辑需要动态运行容器执行任务

然而，在实现这个需求时，遇到一系列问题，如找不到 `docker` 命令、权限异常、构建环境污染、镜像体积过大、安装速度极慢……

## 核心原理：挂载 docker.sock 即可控制宿主机 Docker

`Docker` 采用 `C/S` 架构：

<Callout type="info" title="Docker 架构组件">
| 组件              | 解释                                       |
| --------------- | ---------------------------------------- |
| **dockerd**     | Docker 守护进程（服务端），实际执行 run/pull/build 等操作 |
| **docker CLI**  | 客户端命令行，仅负责向 dockerd 发送指令                 |
| **docker.sock** | 进程间通信的 Unix socket（相当于 API 入口）           |
</Callout>

要从容器操作宿主机 Docker，本质就是：

> 让容器内的 `docker CLI` 与宿主机的 `dockerd` 通信

最简单的方式：

```yaml title="docker-compose.yml"
volumes:
  - /var/run/docker.sock:/var/run/docker.sock
```

完成这一步后，容器中的 `docker` 命令实际上控制的是 **宿主机 Docker**。

## 常见误解：挂载 docker.sock ≠ 容器就有 docker 命令

`docker.sock` 只是接口。

要执行：

```bash
docker run ...
```

容器必须安装 **docker 客户端 CLI**，否则根本找不到 `docker` 可执行文件。

所以我们还需要第二步——安装 `docker CLI`。

## 轻量安装 Docker CLI（Alpine 优化版）

如果直接在构建层编写 `apk add docker`，镜像体积会增加（80–100MB） 这会安装：

* `docker daemon`（dockerd）
* `containerd`
* `runc`
* 所有底层组件

但作为客户端，业务可能根本不需要这些。所以我们只需要安装 `docker-cli` 的客户端即可，镜像增加的大小可控制在 10MB 左右。

```dockerfile title="Dockerfile"
RUN apk add --no-cache docker-cli
```

### 如何加快 apk 安装？（国内源）

我们通过 `--no-cache` 避免了索引缓存，但也带来了下载缓慢的问题，每次都要重新下载索引。

可以将默认源改成阿里云或中科大：

```dockerfile tab="阿里云源"
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
```

```dockerfile tab="中科大源"
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
```

效果极其显著，构建从 **数分钟 → 数秒**

## 在容器中执行宿主机 Docker 命令（Node.js 示例）

```typescript title="docker-runner.ts"
const { spawn } = require('child_process');

const child = spawn('docker', [
  'run',
  '--rm',
  '-v', '/host/project:/app',
  'builder-image'
]);

child.stdout.on('data', d => console.log(d.toString()));
child.stderr.on('data', d => console.error(d.toString()));
```

## 实际使用场景

### 场景一：一次性任务容器（自动销毁）

当我们需要执行一些临时任务，比如代码构建、文件转换、数据处理等，任务完成后希望容器自动销毁：

```typescript title="one-time-task.ts"
const { spawn } = require('child_process');

function runOneTimeTask(imageName, command, volumes = []) {
  return new Promise((resolve, reject) => {
    const dockerArgs = [
      'run',
      '--rm',  // 容器退出后自动删除
      ...volumes.flatMap(v => ['-v', v]),
      imageName,
      ...command
    ];

    const child = spawn('docker', dockerArgs);

    child.on('close', (code) => {
      if (code === 0) {
        resolve(`Task completed successfully`);
      } else {
        reject(new Error(`Task failed with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

// 使用示例：PDF 生成任务
await runOneTimeTask(
  'pdf-generator:latest',
  ['generate-pdf', '/app/input.html', '/app/output.pdf'],
  ['/host/documents:/app']
);
```

### 场景二：并发任务管理（取消机制）

在多个任务并发时，我们希望能够取消之前正在运行的任务：

```typescript title="concurrent-task-manager.ts"
class DockerTaskManager {
  private runningContainers = new Map<string, string>(); // taskId -> containerId

  async runTask(taskId: string, imageName: string, command: string[]) {
    // 取消之前的同类任务
    await this.cancelTask(taskId);

    return new Promise((resolve, reject) => {
      // 启动新容器
      const dockerArgs = ['run', '--rm', '-d', imageName, ...command];
      const child = spawn('docker', dockerArgs);

      let containerId = '';
      child.stdout.on('data', (data) => {
        containerId = data.toString().trim();
        this.runningContainers.set(taskId, containerId);
      });

      child.on('close', (code) => {
        this.runningContainers.delete(taskId);
        if (code === 0) resolve(containerId);
        else reject(new Error(`Failed to start container: ${code}`));
      });
    });
  }

  async cancelTask(taskId: string) {
    const containerId = this.runningContainers.get(taskId);
    if (containerId) {
      try {
        // 停止并删除容器
        await this.execDocker(['stop', containerId]);
        await this.execDocker(['rm', containerId]);
        this.runningContainers.delete(taskId);
        console.log(`Cancelled task: ${taskId}`);
      } catch (error) {
        console.error(`Failed to cancel task ${taskId}:`, error);
      }
    }
  }

  private execDocker(args: string[]) {
    return new Promise((resolve, reject) => {
      const child = spawn('docker', args);
      child.on('close', (code) => {
        if (code === 0) resolve(null);
        else reject(new Error(`Docker command failed: ${args.join(' ')}`));
      });
    });
  }
}

// 使用示例
const taskManager = new DockerTaskManager();

// 启动构建任务
await taskManager.runTask('build-android', 'android-builder', ['./gradlew', 'build']);

// 如果用户触发了新的构建，会自动取消上一个
await taskManager.runTask('build-android', 'android-builder', ['./gradlew', 'build']);
```

### 场景三：参数化多构建任务

根据不同参数执行多个构建任务，比如同时构建多个平台的应用：

```typescript title="multi-build-manager.ts"
interface BuildConfig {
  platform: string;
  image: string;
  command: string[];
  volumes: string[];
  env?: { [key: string]: string };
}

class MultiBuildManager {
  async buildMultiplePlatforms(configs: BuildConfig[]) {
    const buildPromises = configs.map(config => this.buildPlatform(config));

    try {
      const results = await Promise.all(buildPromises);
      return results;
    } catch (error) {
      console.error('One or more builds failed:', error);
      throw error;
    }
  }

  private buildPlatform(config: BuildConfig): Promise<string> {
    return new Promise((resolve, reject) => {
      const dockerArgs = [
        'run',
        '--rm',
        '--name', `build-${config.platform}-${Date.now()}`,
        ...config.volumes.flatMap(v => ['-v', v]),
      ];

      // 添加环境变量
      if (config.env) {
        Object.entries(config.env).forEach(([key, value]) => {
          dockerArgs.push('-e', `${key}=${value}`);
        });
      }

      dockerArgs.push(config.image, ...config.command);

      console.log(`Starting build for ${config.platform}...`);
      const child = spawn('docker', dockerArgs);

      let output = '';
      child.stdout.on('data', (data) => {
        output += data.toString();
        console.log(`[${config.platform}] ${data.toString().trim()}`);
      });

      child.stderr.on('data', (data) => {
        console.error(`[${config.platform}] ${data.toString().trim()}`);
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Build completed for ${config.platform}`);
          resolve(output);
        } else {
          reject(new Error(`❌ Build failed for ${config.platform} with code ${code}`));
        }
      });
    });
  }
}

// 使用示例：同时构建多个平台
const buildManager = new MultiBuildManager();

const buildConfigs: BuildConfig[] = [
  {
    platform: 'android',
    image: 'android-builder:latest',
    command: ['./gradlew', 'assembleRelease'],
    volumes: ['/host/project:/app', '/host/output:/output'],
    env: { PLATFORM: 'android', BUILD_TYPE: 'release' }
  },
  {
    platform: 'ios',
    image: 'ios-builder:latest',
    command: ['xcodebuild', '-workspace', 'App.xcworkspace', '-scheme', 'App', 'archive'],
    volumes: ['/host/project:/app', '/host/output:/output'],
    env: { PLATFORM: 'ios', BUILD_TYPE: 'release' }
  },
  {
    platform: 'web',
    image: 'node:18-alpine',
    command: ['npm', 'run', 'build'],
    volumes: ['/host/project:/app', '/host/output:/output'],
    env: { NODE_ENV: 'production' }
  }
];

try {
  await buildManager.buildMultiplePlatforms(buildConfigs);
  console.log('🎉 All platforms built successfully!');
} catch (error) {
  console.error('Build process failed:', error);
}
```

### 场景四：后台执行任务管理（含日志、状态查询、停止等）

对于复杂任务，我们希望有一个服务来管理这些 Docker 任务，支持启动、停止、查询状态和日志等功能：

```typescript title="docker-service.ts"
import { spawn, ChildProcess } from 'node:child_process';
import { v4 as uuidv4 } from 'uuid';

export interface DockerTask {
  id: string;
  command: string;
  args: string[];
  status: 'running' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
  logs: string[];
  process?: ChildProcess;
  exitCode?: number | null;
}

export class DockerService {
  private tasks: Map<string, DockerTask> = new Map();

  /**
   * 运行一个新的 Docker 任务
   * @param command Docker 命令 (e.g., 'run')
   * @param args 参数列表
   * @param options spawn 选项
   * @returns 任务 ID
   */
  public runTask(command: string, args: string[], options: any = {}): string {
    const taskId = uuidv4();

    const task: DockerTask = {
      id: taskId,
      command,
      args,
      status: 'running',
      startTime: Date.now(),
      logs: []
    };

    const runProcess = spawn('docker', [command, ...args], {
      ...options,
      detached: true
    });

    task.process = runProcess;

    // 收集日志
    if (runProcess.stdout) {
      runProcess.stdout.on('data', (data) => {
        const log = data.toString();
        task.logs.push(log);
      });
    }

    if (runProcess.stderr) {
      runProcess.stderr.on('data', (data) => {
        const log = data.toString();
        task.logs.push(log);
      });
    }

    // 监听结束
    runProcess.on('close', (code) => {
      task.status = code === 0 ? 'completed' : 'failed';
      task.endTime = Date.now();
      task.exitCode = code;
      task.process = undefined; // 清理 process 引用
    });

    runProcess.on('error', (err) => {
      task.status = 'failed';
      task.logs.push(`Process error: ${err.message}`);
      task.endTime = Date.now();
      task.process = undefined;
    });

    // 让进程在后台运行
    runProcess.unref();

    this.tasks.set(taskId, task);
    return taskId;
  }

  /**
   * 停止任务
   * @param taskId 任务 ID
   */
  public stopTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (task && task.process && task.status === 'running') {
      try {
        if (task.process.pid) {
          process.kill(-task.process.pid); // 尝试 kill 进程组
        } else {
          task.process.kill();
        }
        task.status = 'failed'; // 被强行停止视为 failed 或者可以加个 stopped 状态
        task.logs.push('Task stopped by user.');
        return true;
      } catch (e) {
        console.error(`Failed to stop task ${taskId}:`, e);
        return false;
      }
    }
    return false;
  }

  /**
   * 获取任务日志
   * @param taskId 任务 ID
   */
  public getTaskLogs(taskId: string): string {
    const task = this.tasks.get(taskId);
    return task ? task.logs.join('') : '';
  }

  /**
   * 获取任务状态
   * @param taskId 任务 ID
   */
  public getTaskStatus(taskId: string): DockerTask | null {
    const task = this.tasks.get(taskId);
    if (!task) return null;

    // 返回不带 process 对象的副本，避免循环引用等问题
    const { process, ...taskInfo } = task;
    return taskInfo as DockerTask;
  }

  /**
   * 删除任务
   */
  public deleteTask(taskId: string): boolean {
    this.tasks.delete(taskId);
    return true;
  }
}

export const dockerService = new DockerService();

// 使用示例
const taskId = dockerService.runTask('run', ['--rm', 'alpine', 'echo', 'Hello, Docker in Docker!']);
console.log(`Started Docker task with ID: ${taskId}`);

setTimeout(() => {
  const status = dockerService.getTaskStatus(taskId);
  const logs = dockerService.getTaskLogs(taskId);
  console.log(`Task Status: ${JSON.stringify(status, null, 2)}`);
  console.log(`Task Logs:\n${logs}`);
}, 3000);

```

## 为什么要用"构建镜像"来执行临时任务？

<Cards>
  <Card title="典型使用场景">
    Android Cordova 构建、ffmpeg 转码、PDF 生成、OCR 识别、AI 模型推理、大型依赖任务
  </Card>
  <Card title="带来的优势">
    构建环境独立、稳定可复现、维护简单、不影响主服务镜像体积
  </Card>
</Cards>

这些步骤往往：

* 依赖复杂
* 容易污染主业务容器
* 版本变化频繁
* 需要在隔离环境执行

一个专用的 `build` 镜像是现代 `DevOps` 的标准方式。

## docker.sock 安全风险（重要）

<Callout type="error" title="安全警告">
挂载 `docker.sock` 等于：

**给容器 root 权限控制宿主机所有 Docker 功能**

这本质上等同于**宿主机 root 权限**
</Callout>

安全上：

* 不允许不可信容器挂载 `docker.sock`
* 不允许公网暴露
* 尽量只给可信后端使用
* 可通过 `docker-socket-proxy` 做访问权限隔离
