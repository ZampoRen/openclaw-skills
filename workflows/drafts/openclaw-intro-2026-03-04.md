# OpenClaw 入门指南：把 AI 装进你的微信/Telegram

> 5 分钟搭建私人 AI 助手，随时随地从手机调用代码能力

---

## 为什么需要 OpenClaw？

想象这个场景：你在地铁上突然想到一个代码问题，掏出手机发消息给 AI 助手，它不仅能回答问题，还能**直接操作你的 GitHub、读写本地文件、运行命令**——这不是科幻，这是 OpenClaw。

**OpenClaw 是什么？**

简单说，它是一个**自托管的 AI 网关**，把你的聊天软件（微信、Telegram、Discord 等）和 AI 编程助手连接起来。你发消息，它调用 AI 处理，然后返回结果——全程在你自己的服务器上运行，数据不经过第三方。

**核心优势：**

| 特性 | 传统 AI Chat | OpenClaw |
|------|-------------|----------|
| 数据隐私 | 云端处理 | 本地运行 |
| 工具能力 | 有限插件 | 完整系统权限 |
| 使用场景 | 必须打开网页 | 任何聊天软件 |
| 成本 | 订阅费 | 只需 API Key |
| 定制化 | 受限 | 完全可控 |

---

## 快速开始：15 分钟上线

### 前置要求

- **Node.js 22+**（检查：`node --version`）
- **一台能联网的机器**（本地电脑/服务器/NAS 都可以）
- **一个 AI Provider 的 API Key**（推荐用 Bailian/Anthropic/OpenAI）

### 第一步：安装 OpenClaw

**macOS / Linux：**

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell)：**

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

安装完成后验证：

```bash
openclaw --version
# 应该输出版本号，例如：openclaw/2026.2.25
```

### 第二步：运行配置向导

```bash
openclaw onboard --install-daemon
```

这个向导会帮你：

1. ✅ 配置 AI Provider 的 API Key
2. ✅ 生成网关认证 Token
3. ✅ 选择要连接的聊天渠道
4. ✅ 自动安装后台服务

**关键配置项说明：**

```json5
// ~/.openclaw/openclaw.json
{
  // AI Provider 配置
  agents: {
    defaults: {
      provider: "bailian",  // 或 "anthropic", "openai"
      model: "qwen3.5-plus" // 推荐用最新模型
    }
  },
  
  // 渠道配置（以 Telegram 为例）
  channels: {
    telegram: {
      enabled: true,
      botToken: "你的 Bot Token",
      dmPolicy: "pairing"  // 首次聊天需要配对确认
    }
  }
}
```

### 第三步：启动网关

如果安装了 daemon，服务应该已经在运行：

```bash
openclaw gateway status
```

看到 `running` 就成功了！

手动启动（调试用）：

```bash
openclaw gateway --port 18789
```

### 第四步：打开控制面板

```bash
openclaw dashboard
```

或者直接访问：http://127.0.0.1:18789/

**控制面板能做什么：**

- 💬 直接在网页聊天（无需配置渠道）
- ⚙️ 查看和修改配置
- 📊 监控会话和用量
- 📱 管理移动设备节点

---

## 连接聊天渠道

### Telegram（推荐，最稳定）

**1. 创建 Bot**

在 Telegram 搜索 `@BotFather`，发送：

```
/newbot
```

按提示设置名字，最后会拿到 Token：

```
123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

**2. 配置 Token**

编辑 `~/.openclaw/openclaw.json`：

```json5
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
      dmPolicy: "pairing"
    }
  }
}
```

**3. 配对第一个聊天**

重启网关：

```bash
openclaw gateway restart
```

在 Telegram 给你的 Bot 发任意消息，然后：

```bash
openclaw pairing list telegram
# 会显示配对码，例如：A7X9K2

openclaw pairing approve telegram A7X9K2
```

配对成功！现在可以给 Bot 发消息了。

**4. 获取你的 Telegram User ID**

配置白名单需要知道你的 User ID：

```bash
# 方法 1：查看网关日志
openclaw logs --follow
# 找到 from.id 字段

# 方法 2：调用 Bot API
curl "https://api.telegram.org/bot<token>/getUpdates"
```

**5. 配置白名单（可选但推荐）**

```json5
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "你的 token",
      dmPolicy: "allowlist",
      allowFrom: ["123456789"]  // 你的 User ID
    }
  }
}
```

### WhatsApp

WhatsApp 配置稍复杂，需要扫码登录：

```bash
openclaw channels login whatsapp
# 会显示二维码，用手机 WhatsApp 扫描
```

扫描后：

```bash
openclaw gateway
```

**注意：** WhatsApp 有封号风险，建议用备用号测试。

### Discord

1. 访问 https://discord.com/developers/applications
2. 创建 Application，添加 Bot
3. 复制 Bot Token
4. 邀请 Bot 到服务器（需要 `Manage Server` 权限）

配置：

```json5
{
  channels: {
    discord: {
      enabled: true,
      botToken: "你的 Discord Bot Token",
      guilds: {
        "*": { requireMention: true }  // 群里需要 @Bot 才响应
      }
    }
  }
}
```

---

## 核心功能演示

### 1. 代码编写和调试

**发送消息：**

```
帮我写一个 Python 脚本，批量重命名当前目录下的 JPG 文件，
按拍摄时间排序，格式为 2024-01-15_001.jpg
```

**AI 会：**

1. 读取目录文件
2. 提取 EXIF 拍摄时间
3. 生成重命名脚本
4. 询问确认后执行

### 2. GitHub 操作

```
查看我最近创建的 PR，有 review 评论的告诉我
```

需要配置 GitHub Token：

```json5
{
  tools: {
    github: {
      token: "ghp_xxxxxxxxxxxx"
    }
  }
}
```

### 3. 文件管理

```
把 ~/Downloads 里所有的 PDF 移动到 ~/Documents/Papers/
并按文件名排序
```

### 4. 定时任务

```
每天早上 9 点检查我的日历和邮件，有重要事项就通知我
```

编辑 `HEARTBEAT.md`：

```markdown
# 每日检查
- [ ] 读取未读邮件（IMAP）
- [ ] 检查今日日历事件
- [ ] 查看天气（如果要出门）
```

### 5. 多会话管理

OpenClaw 自动为每个聊天创建独立会话：

- 你的私聊 → `main` 会话
- 群组 A → 独立会话
- 群组 B → 独立会话

每个会话有独立的记忆和上下文。

---

## 高级配置

### 安全加固

**1. 限制访问来源**

```json5
{
  channels: {
    telegram: {
      allowFrom: ["123456789", "987654321"],  // 只允许特定用户
      groups: {
        "-1001234567890": {  // 特定群组
          groupPolicy: "open",
          requireMention: true
        }
      }
    }
  }
}
```

**2. 群组提及规则**

```json5
{
  messages: {
    groupChat: {
      mentionPatterns: ["@openclaw", "@bot", "/bot"]
    }
  }
}
```

**3. 环境变量（适合 Docker 部署）**

```bash
export OPENCLAW_HOME=/data/openclaw
export TELEGRAM_BOT_TOKEN=123:abc
export ANTHROPIC_API_KEY=sk-ant-xxx
```

### 远程访问

**方案 1：Tailscale（推荐）**

```bash
# 安装 Tailscale
tailscale up

# 获取 Tailscale IP
tailscale ip

# 访问：https://<tailscale-ip>:18789
```

**方案 2：SSH 隧道**

```bash
ssh -L 18789:localhost:18789 user@server
# 本地访问：http://localhost:18789
```

**方案 3：反向代理（Nginx）**

```nginx
server {
    listen 443 ssl;
    server_name openclaw.yourdomain.com;
    
    location / {
        proxy_pass http://127.0.0.1:18789;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 移动端节点

OpenClaw 支持 iOS/Android 节点，可以：

- 📸 访问相机/屏幕
- 📍 获取位置
- 🔔 推送通知
- 📱 执行设备命令

**配对步骤：**

1. 手机安装 OpenClaw App
2. 在 Telegram Bot 输入 `/pair`
3. 获取配对码
4. 在手机 App 输入配对码
5. 在 Telegram 批准：`/pair approve`

---

## 常见问题和避坑指南

### ❌ 问题 1：网关启动失败

**错误信息：** `Port 18789 is already in use`

**解决：**

```bash
# 查看占用端口的进程
lsof -i :18789

# 杀死进程或换端口
openclaw gateway --port 18790
```

### ❌ 问题 2：Telegram Bot 不响应

**检查清单：**

1. Bot Token 是否正确
2. 是否完成配对（`openclaw pairing list`）
3. 隐私模式是否开启（Bot 需要看到消息）

**关闭隐私模式：**

在 `@BotFather` 输入：
```
/setprivacy
选择你的 Bot
选择 Disabled
```

然后重新添加 Bot 到聊天。

### ❌ 问题 3：API Key 无效

**常见原因：**

- Key 过期或被撤销
- 配额用尽
- 区域限制（某些 Provider 限制中国 IP）

**解决：**

```bash
# 重新配置
openclaw onboard

# 或手动编辑
vim ~/.openclaw/openclaw.json
```

### ❌ 问题 4：群聊中不响应

**检查：**

1. 是否配置了 `requireMention: true`
2. 是否正确 @Bot
3. Bot 是否有群管理员权限

**调试命令：**

```bash
openclaw logs --follow | grep telegram
```

### ❌ 问题 5：会话记忆丢失

**原因：** OpenClaw 默认会话是临时的

**解决：** 启用持久化记忆

```json5
{
  sessions: {
    persist: true,
    storage: "memory"  // 或 "file"
  }
}
```

---

## 性能优化建议

### 1. 选择合适的模型

| 使用场景 | 推荐模型 | 理由 |
|---------|---------|------|
| 日常聊天 | qwen3.5-plus | 速度快，成本低 |
| 代码生成 | qwen3.5-plus | 代码能力强 |
| 复杂推理 | o1-pro / deepseek | 推理能力强 |
| 长文本 | qwen-long | 上下文窗口大 |

### 2. 配置会话超时

```json5
{
  sessions: {
    idleTimeoutMinutes: 30,  // 30 分钟无活动自动清理
    maxSessions: 10          // 最多保留 10 个会话
  }
}
```

### 3. 启用响应流式输出

```json5
{
  channels: {
    telegram: {
      streaming: "partial"  // 实时显示打字效果
    }
  }
}
```

---

## 最佳实践

### ✅ 应该做的

1. **定期备份配置**
   ```bash
   cp ~/.openclaw/openclaw.json ~/backup/openclaw-$(date +%F).json
   ```

2. **监控资源使用**
   ```bash
   openclaw status
   ```

3. **使用白名单限制访问**
   ```json5
   allowFrom: ["你的 ID"]
   ```

4. **定期更新**
   ```bash
   npm update -g openclaw
   ```

5. **记录重要对话**
   使用 `/save` 命令保存关键会话

### ❌ 不应该做的

1. **不要在生产环境用 `open` 策略**
   ```json5
   // 危险！任何人都能访问
   dmPolicy: "open"
   allowFrom: ["*"]
   ```

2. **不要暴露 API Key**
   - 不要提交到 Git
   - 用环境变量或加密存储

3. **不要给 Bot 过高权限**
   - 群里只给必要的权限
   - 定期审查 Bot 权限

4. **不要忽略日志**
   ```bash
   # 定期检查
   openclaw logs --since 24h
   ```

---

## 实战案例

### 案例 1：自动化日报

**需求：** 每天下班前自动汇总当天工作

**实现：**

1. 创建 `HEARTBEAT.md`：
   ```markdown
   # 日报生成
   - 读取今日 Git 提交
   - 查看日历会议
   - 整理待办事项
   - 发送到 Telegram
   ```

2. 配置定时：
   ```bash
   # 工作日 18:00 执行
   0 18 * * 1-5 openclaw heartbeat
   ```

### 案例 2：监控告警

**需求：** 服务器 CPU 超过 80% 时通知

**实现：**

```bash
# 添加监控脚本到 crontab
*/5 * * * * openclaw message send --target @yourname \
  "CPU: $(top -bn1 | grep 'Cpu(s)' | awk '{print $2}')%"
```

### 案例 3：代码审查助手

**需求：** 新 PR 自动 review

**实现：**

1. 配置 GitHub Webhook
2. 创建技能脚本处理 review
3. 自动评论到 PR

---

## 总结

OpenClaw 的核心价值：

1. **隐私优先** - 数据在你自己的服务器上
2. **无处不在** - 任何聊天软件都能用
3. **能力强大** - 完整的系统工具链
4. **高度定制** - 想怎么改就怎么改

**下一步：**

- 📖 完整文档：https://docs.openclaw.ai
- 💬 社区讨论：https://discord.com/invite/clawd
- 🔧 技能市场：https://clawhub.com

**记住：** 最好的自动化是让你忘记自动化的存在。让 OpenClaw 成为你的第二大脑，而不是另一个需要管理的工具。

---

## 发布元数据

- **封面图建议：** 
  - 主视觉：龙虾图标 + 聊天界面合成图
  - 风格：科技感，蓝紫色调
  - 尺寸：900x383px（公众号封面标准）

- **标签：** #OpenClaw #AI 助手 #自动化 #效率工具 #开发者

- **预计阅读时间：** 12 分钟

- **摘要：** 15 分钟搭建私人 AI 助手，支持微信/Telegram/Discord，数据本地运行，完整系统权限，附详细配置指南和避坑手册。
