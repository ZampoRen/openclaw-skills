# OpenClaw 安装与配置指南

## macOS 安装

### 方式 1：官方一键脚本（最推荐）

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw onboard --install-daemon
```

### 方式 2：npm 安装

```bash
npm install -g openclaw
openclaw onboard --install-daemon
```

## Windows 安装

### 方式 1：PowerShell 一键脚本

以**管理员身份**运行 PowerShell：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
openclaw onboard
```

### 方式 2：WSL2 安装

```powershell
wsl --install
# 重启后
wsl
curl -fsSL https://openclaw.ai/install.sh | bash
```

## 国内模型配置（阿里云百炼）

### 1. 获取 API Key

访问 [阿里云百炼控制台](https://bailian.console.aliyun.com/)

### 2. 配置

编辑 `~/.openclaw/openclaw.json`：

```json
{
  "models": {
    "default": "bailian/qwen3.5-plus"
  }
}
```

### 3. 可用模型

| 模型 | 适用场景 |
|------|----------|
| `bailian/qwen3.5-plus` | 通用对话、写作（默认推荐） |
| `bailian/qwen3.5-turbo` | 快速响应、简单任务 |
| `bailian/qwen-max` | 复杂推理、代码 |

## 价格参考（2026 年 3 月）

| 模型 | 输入 | 输出 |
|------|------|------|
| Qwen3.5-Turbo | ¥0.002/1K | ¥0.006/1K |
| Qwen3.5-Plus | ¥0.004/1K | ¥0.012/1K |
| Qwen-Max | ¥0.04/1K | ¥0.12/1K |

**成本估算：** 一篇 3000 字文章 ≈ 5000 tokens ≈ ¥0.08（Qwen3.5-Plus）

## 快速验证

```bash
openclaw --version
openclaw gateway status
openclaw chat "你好" --model bailian/qwen3.5-plus
```
