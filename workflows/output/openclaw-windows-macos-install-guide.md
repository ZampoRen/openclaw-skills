# 3 分钟装好自己的 AI 助理：OpenClaw 安装配置指南（2026 版）

> 不用翻墙，不用付费订阅，AI 助理 24 小时待命，在你的飞书/QQ 里随时响应。

---

## 这玩意儿能干啥？

简单说：**让 AI 住进你的聊天软件里**。

- 在飞书/QQ 里发消息，AI 秒回
- 让它写代码、查资料、整理文档
- 所有数据在你自己电脑上，安全
- 一个月成本不到一杯奶茶（¥9.9 首月）

---

## 一、安装（3 分钟搞定）

### macOS 用户

打开终端（Cmd+Space 搜 Terminal），执行：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

等它自动装完，然后：

```bash
openclaw onboard --install-daemon
```

### Windows 用户

**管理员身份**打开 PowerShell，执行：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

装完后：

```powershell
openclaw onboard
```

---

## 二、配置模型（阿里云百炼）

### 1. 搞个 API Key

1. 上 https://bailian.console.aliyun.com/
2. 注册登录，开通「模型服务」
3. 创建 API Key，复制保存

### 2. 配置到 OpenClaw

**最简单的方式**：打开浏览器 http://127.0.0.1:18789

点 **Settings → Models**，选阿里云，粘贴 API Key，保存。

搞定。

---

## 三、多少钱？

**Coding Plan 套餐**（个人够用）：
- 首月：**¥9.9**
- 次月起：¥40/月
- 包含：100 万 tokens/月（约 1000+ 次对话）

**按量计费**（偶尔用用）：
- 新用户送 ¥20 体验金
- 每天聊几十次，一个月大概 ¥20-30

---

## 四、连接聊天软件（二选一）

### 方案 A：飞书（推荐上班族）

**为啥选飞书？**
- 能读文档、查日历、管文件
- 工作场景无敌
- 官方支持，稳

**配置步骤：**

```bash
# 1. 装插件
openclaw plugins install @openclaw/feishu

# 2. 上飞书开放平台创建应用
# https://open.feishu.cn/app
# 创建企业自建应用，拿到 App ID 和 App Secret

# 3. 配置到 OpenClaw
openclaw channels add
# 选 Feishu，粘贴 App ID 和 App Secret

# 4. 重启
openclaw gateway restart
```

**权限配置**（在飞书开放平台批量导入）：
```json
{
  "scopes": {
    "tenant": [
      "im:message",
      "im:message:send_as_bot",
      "im:chat.access_event.bot_p2p_chat:read"
    ]
  }
}
```

**首次使用**可能需要配对，终端会提示：
```bash
openclaw pairing approve feishu <配对码>
```

---

### 方案 B：QQ（推荐个人用户）

**为啥选 QQ？**
- 人人都有，不用额外装
- 配置简单
- 个人聊天够用

**配置步骤：**

```bash
# 1. 装插件
openclaw plugins install @sliverp/qqbot@latest

# 2. 搞个 QQ 机器人 Token
# 去 QQ 机器人平台申请

# 3. 配置
openclaw channels add --channel qqbot --token "你的 Token"

# 4. 重启
openclaw gateway restart
```

Token 长这样：`1903144239:oY6PTIsCH6h390h9`

---

## 五、常见问题

### Q：Node.js 版本不对咋办？

```bash
# macOS
brew install nvm
nvm install 22
nvm use 22

# Windows
winget install coreybutler.nvm-windows
nvm install 22
nvm use 22
```

### Q：PowerShell 脚本报错？

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Q：装完咋用？

1. 确保服务在跑：`openclaw gateway status`
2. 打开面板：http://127.0.0.1:18789
3. 在飞书/QQ 里给机器人发消息

### Q：安全吗？

- 数据在你自己电脑上
- 不经过第三方服务器
- 只使用官方安装源（下面有）

---

## 六、官方资源

| 干啥 | 去哪 |
|------|------|
| 官方文档 | https://docs.openclaw.ai |
| GitHub | https://github.com/openclaw/openclaw |
| 阿里云百炼 | https://bailian.console.aliyun.com |
| 飞书开放平台 | https://open.feishu.cn |
| 社区插件 | https://clawhub.com |

---

## 避坑提醒

⚠️ **只用官方安装源**，GitHub 上有伪造包会偷你信息：
- 安装脚本：`https://openclaw.ai/install.sh` 或 `install.ps1`
- npm 包：`openclaw`（官方）

⚠️ **飞书/QQ 机器人用小号**，别拿主号折腾

⚠️ **API Key 别泄露**，设个调用限额

---

## 最后

装好后，你的 AI 助理就 24 小时在线了。

有啥问题，去 Discord 社区问：https://discord.com/invite/clawd

**首月 ¥9.9**，试试不亏。

---

**更新时间：** 2026-03-09  
**适用版本：** OpenClaw 最新版  
**测试环境：** macOS 15 / Windows 11
