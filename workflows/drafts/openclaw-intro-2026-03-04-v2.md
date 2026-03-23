# 折腾了一周，我把 AI 助手装进了 Telegram

> 不是 ChatGPT 那种只聊天的"助手"，是真的能帮你干活的那种

---

先说结论：**OpenClaw 是个自托管的 AI 网关**，把你现有的聊天软件（Telegram、Discord、WhatsApp 等）和 AI 连起来。你发消息，它调用 AI 处理，还能顺便操作你的 GitHub、读写文件、跑脚本——全程在你自己的机器上运行。

听起来有点玄乎？我折腾了一周，把坑都踩完了，现在把真实经验整理出来。

---

## 为什么要折腾这个？

说个真实场景：

上周三晚上 11 点，我躺在床上突然想到一个代码问题：某个 Python 脚本需要加个日志功能。平时这种时候就算了，明天再说。但这次我顺手打开 Telegram，给 bot 发了条消息：

```
帮我在 /home/zampo/scripts/backup.py 里加上 logging，
输出到 /var/log/backup.log，格式带时间戳
```

两分钟后，bot 回复我代码改好了，还问要不要顺便加个轮播配置。我回了个"好"，它就直接提交了。

**这就是 OpenClaw 的价值：随时随地，用你最习惯的方式和 AI 交互，还能让它真的干活。**

---

## 安装过程（真实版）

### 前置条件

- **Node.js 22+**（没有的话安装脚本会自动装）
- **一台能联网的机器**（我用的自己的 MacBook Pro，也可以放服务器上）
- **一个 AI Provider 的 API Key**（我用的是 Bailian，也可以用 Anthropic 或 OpenAI）

### 第一步：安装

macOS / Linux 一条命令：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

Windows 用 PowerShell：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

安装脚本会自动检测 Node 版本，不够的话帮你装好。这点挺贴心的，省得手动折腾。

### 第二步：运行配置向导

```bash
openclaw onboard --install-daemon
```

这个向导会带着你：

1. 输入 AI Provider 的 API Key
2. 生成网关的认证 Token
3. 选要不要连接聊天渠道（我选了 Telegram）
4. 自动安装后台服务

**注意：** 向导是交互式的，跟着提示走就行，不用提前准备什么。

### 第三步：启动网关

如果安装了 daemon，服务应该已经在后台跑了。检查一下：

```bash
openclaw gateway status
```

看到 `running` 就对了。

手动启动（调试的时候用）：

```bash
openclaw gateway --port 18789
```

### 第四步：打开控制面板

```bash
openclaw dashboard
```

或者直接浏览器访问：[http://127.0.0.1:18789/](http://127.0.0.1:18789/)

控制面板能干的事：

- 直接在网页里聊天（不用配置渠道也能用）
- 看配置和修改设置
- 监控会话和 API 用量
- 管理移动设备（如果有 iOS/Android 节点）

---

## 配置 Telegram Bot（最稳的渠道）

我试了 Telegram、Discord 和 WhatsApp，**Telegram 最稳**，配置也最简单。

### 1. 创建 Bot

在 Telegram 里搜索 `@BotFather`，这是 Telegram 官方的 Bot 管理账号。

发送 `/newbot`，按提示设置名字和用户名。最后会给你一个 Token：

```
123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

**这个 Token 要保存好**，后面配置要用。

### 2. 配置 Token

编辑配置文件 `~/.openclaw/openclaw.json`：

```json5
"channels": {
    "telegram": {
      "enabled": true,
      "dmPolicy": "pairing",
      "groupPolicy": "open",
      "botToken": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
    }
  }
```

### 3. 配对第一个聊天

重启网关（或者手动启动）：

```bash
openclaw gateway stop
openclaw gateway start
```

在 Telegram 里给你的 Bot 发任意消息，比如 "hello"。

然后运行：

```bash
openclaw pairing list telegram
```

会显示一个配对码，类似 `A7X9K2`。

再运行：

```bash
openclaw pairing approve telegram A7X9K2
```

配对成功！现在可以在 Telegram 里和 Bot 聊天了。

### 4. 获取你的 Telegram User ID（配置白名单用）

如果你想限制只有自己能访问 Bot，需要知道你的 Telegram User ID。

**方法 1：看网关日志**

```bash
openclaw logs --follow
```

找到 `from.id` 字段，那个数字就是你的 ID。

**方法 2：调用 Bot API**

```bash
curl "https://api.telegram.org/bot<你的 token>/getUpdates"
```

返回的 JSON 里有 `chat.id`。

### 5. 配置白名单（推荐）

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

这样其他人就算知道你的 Bot，也没法用。

---

## 真实使用场景

### 1. 写代码

**我：**

```
帮我写个 Python 脚本，批量重命名当前目录下的 JPG 文件，
按拍摄时间排序，格式为 2024-01-15_001.jpg
```

**Bot 会：**

1. 读取目录里的文件
2. 提取 EXIF 拍摄时间
3. 生成重命名脚本
4. 问我确认后再执行

这个过程是实时的，它每步都会告诉我做了什么。

### 2. 查 GitHub

**我：**

```
看看我最近创建的 PR，有 review 评论的告诉我
```

需要在配置里加 GitHub Token：

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

**我：**

```
把 ~/Downloads 里所有的 PDF 移动到 ~/Documents/Papers/
```

它会先列出要移动的文件，问你确认，然后执行。

### 4. 定时检查（Heartbeat）

这个功能很实用：定期自动检查一些事情，然后通知你。

编辑工作区的 `HEARTBEAT.md`：

```markdown
# 每日检查
- 读取未读邮件
- 检查今天的日历事件
- 看天气（如果要出门）
```

然后在配置文件里启用：

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",  // 每 30 分钟检查一次
        target: "telegram"  // 通过 Telegram 通知我
      }
    }
  }
}
```

---

## 踩过的坑

### 坑 1：网关启动失败

**错误：** `Port 18789 is already in use`

**原因：** 端口被占用了（我之前手动启动过，忘记关）

**解决：**

```bash
lsof -i :18789  # 看看谁在用
kill -9 <PID>   # 干掉它
# 或者换个端口
openclaw gateway --port 18790
```

### 坑 2：Telegram Bot 不响应

**检查清单：**

1. Bot Token 对不对（我复制的时候少了一位）
2. 配对了没有（`openclaw pairing list` 看看）
3. Bot 的隐私模式是不是开着

**关闭隐私模式：**

在 `@BotFather` 里输入：

```
/setprivacy
选你的 Bot
选 Disabled
```

然后重新把 Bot 拉到聊天里。

### 坑 3：API Key 无效

**原因：** 我用的 Bailian，Key 有过期时间，刚好到期了。

**解决：** 重新生成 Key，更新配置：

```bash
openclaw onboard  # 重新跑向导
```

### 坑 4：群聊里不响应

**原因：** 默认配置下，Bot 在群里需要被 @ 才会响应。

**解决：** 要么 @它，要么改配置：

```json5
{
  channels: {
    telegram: {
      groups: {
        "*": { requireMention: false }  // 不需要 @ 也响应
      }
    }
  }
}
```

不过我建议保持 `requireMention: true`，不然 Bot 会在群里话太多。

---

## 高级玩法

### 远程访问

如果你把 OpenClaw 装在服务器上，想从外网访问控制面板：

**方案 1：Tailscale（最安全）**

```bash
# 装 Tailscale
curl -fsSL https://tailscale.com/install.sh | sh
tailscale up

# 拿到 Tailscale IP
tailscale ip

# 浏览器访问：https://<tailscale-ip>:18789
```

**方案 2：SSH 隧道**

```bash
ssh -L 18789:localhost:18789 user@server
# 然后本地访问 http://localhost:18789
```

### 多 Agent 隔离

你可以配置多个独立的 Agent，比如一个家用、一个工作用：

```json5
{
  agents: {
    list: [
      { id: "home", default: true, workspace: "~/.openclaw/workspace-home" },
      { id: "work", workspace: "~/.openclaw/workspace-work" }
    ]
  },
  bindings: [
    { agentId: "home", match: { channel: "telegram", accountId: "personal" } },
    { agentId: "work", match: { channel: "telegram", accountId: "biz" } }
  ]
}
```

这样两个 Telegram 账号会连接到不同的 Agent，数据和记忆完全隔离。

### 移动端节点

OpenClaw 有 iOS/Android App，配对后可以让 AI：

- 访问相机和屏幕
- 获取位置
- 推送通知
- 执行设备命令

配对流程：

1. 手机装 OpenClaw App
2. 在 Telegram Bot 输入 `/pair`
3. 拿到配对码
4. 在手机 App 里输入
5. 在 Telegram 批准：`/pair approve`

---

## 一些建议

### 应该做的

1. **定期备份配置**
  ```bash
   cp ~/.openclaw/openclaw.json ~/backup/openclaw-$(date +%F).json
  ```
2. **用白名单限制访问**
  别用 `dmPolicy: "open"`，除非你想让任何人能用你的 Bot。
3. **定期检查日志**
  ```bash
   openclaw logs --since 24h
  ```
4. **保持更新**
  ```bash
   npm update -g openclaw
  ```

### 别做的

1. **别把 API Key 提交到 Git**
  我见过有人把 config 整个传 GitHub 的……
2. **别给 Bot 太高权限**
  群里给个管理员就行，别给 Owner。
3. **别在生产环境用 `open` 策略**
  真的，别。

---

## 最后说两句

OpenClaw 不是那种"革命性"的产品，它更像是一个**胶水工具**——把你已经有的东西（聊天软件、AI、各种 API）粘在一起，让它们能互相说话。

折腾这一周，我最大的感受是：**最好的工具是让你忘记它的存在**。现在我有问题就直接给 Telegram Bot 发消息，它该干嘛干嘛，不需要我打开网页、登录、切换标签页。

这就够了。

**相关链接：**

- 官方文档：[https://docs.openclaw.ai](https://docs.openclaw.ai)
- 社区：[https://discord.com/invite/clawd](https://discord.com/invite/clawd)
- 技能市场：[https://clawhub.com](https://clawhub.com)

---

## 发布元数据

- **标题备选：**
  - 主：折腾了一周，我终于把 AI 助手装进了 Telegram
  - 副：不是 ChatGPT 那种"助手"，是真的能帮你干活的那种
  - 备选：OpenClaw 真实使用指南（附完整配置和避坑手册）
- **封面图建议：**
  - 主视觉：Telegram 聊天界面截图 + OpenClaw 龙虾 logo
  - 风格：简洁、真实，不要用太科技的渲染图
  - 尺寸：900x383px
- **标签：** #OpenClaw #AI #自动化 #效率工具 #Telegram
- **摘要：** 亲测一周，OpenClaw 真实使用体验。从安装到配置，从踩坑到进阶，完整记录。不是官方教程，是真实用户的血泪史。
- **预计阅读时间：** 10 分钟

