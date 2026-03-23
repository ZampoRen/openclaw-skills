# AI 编程助手 Coding Plan 价格对比（2026 年 3 月）

> 专为 OpenClaw 用户整理，直接购买，直接配置

---

## 📊 价格对比总表

| 平台 | 首月 | 次月 | 第三月 | 购买链接 |
|:-----|:----:|:----:|:------:|:--------:|
| **阿里百炼 Lite** | ¥7.9 | ¥20 | ¥40 | [🔗 购买](https://bailian.console.aliyun.com/cn-beijing/?tab=model#/efm/coding_plan) |
| **阿里百炼 Pro** | ¥39.9 | ¥100 | ¥200 | [🔗 购买](https://bailian.console.aliyun.com/cn-beijing/?tab=model#/efm/coding_plan) |
| **百度千帆 Lite** | ¥7.9 | ¥20 | ¥40 | [🔗 购买](https://console.bce.baidu.com/qianfan/resource/subscribe) |
| **百度千帆 Pro** | ¥39.9 | ¥100 | ¥200 | [🔗 购买](https://console.bce.baidu.com/qianfan/resource/subscribe) |
| **腾讯云** | ¥7.9 | ¥20 | ¥40 | [🔗 购买](https://cloud.tencent.com/act/pro/codingplan) |
| **火山引擎 Lite** | ¥9.9 | ¥40 | ¥40 | [🔗 购买](https://www.volcengine.com/) |
| **火山引擎 Pro** | ¥49.9 | ¥49.9 | ¥49.9 | [🔗 购买](https://www.volcengine.com/) |
| **智谱 Lite** | ¥49 | ¥49 | ¥49 | [🔗 购买](https://open.bigmodel.cn/) |
| **智谱 Pro** | ¥100 | ¥100 | ¥100 | [🔗 购买](https://open.bigmodel.cn/) |
| **Minimax Starter** | ¥9.9 | ¥29 | ¥29 | [🔗 购买](https://platform.minimaxi.com/subscribe/coding-plan) |
| **Minimax Plus** | - | ¥49 | ¥49 | [🔗 购买](https://platform.minimaxi.com/subscribe/coding-plan) |
| **Kimi Andante** | - | ¥49 | ¥49 | [🔗 购买](https://kimi.moonshot.cn/) |
| **Kimi Moderato** | - | ¥99 | ¥99 | [🔗 购买](https://kimi.moonshot.cn/) |

---

## 🎯 快速推荐

| 需求 | 平台 | 成本 |
|------|------|------|
| 🏆 **最便宜** | 阿里百炼 / 百度千帆 / 腾讯云 | 首月¥7.9 → 次月¥20 |
| 💰 **性价比** | 火山引擎 Pro | ¥49.9/月（价格稳定） |
| 🚀 **多模型** | 阿里百炼 / 百度千帆 | ¥40/月（Qwen+GLM+Kimi+MiniMax） |
| ⚡ **高额度** | Kimi Moderato | ¥99/月（2048 次/周） |
| 🆓 **免费** | DeepSeek | ¥0（在线聊天） |

---

## 🔧 OpenClaw 配置

### 阿里百炼 / 百度千帆 / 腾讯云 / 火山引擎

```json
{
  "models": {
    "providers": {
      "openai": {
        "baseUrl": "https://coding.dashscope.aliyuncs.com/v1",
        "apiKey": "sk-sp-xxxxx"
      }
    }
  }
}
```

**购买链接：**
- [阿里百炼](https://bailian.console.aliyun.com/cn-beijing/?tab=model#/efm/coding_plan)
- [百度千帆](https://console.bce.baidu.com/qianfan/resource/subscribe)
- [腾讯云](https://cloud.tencent.com/act/pro/codingplan)
- [火山引擎](https://www.volcengine.com/)

---

### 智谱 GLM

```json
{
  "models": {
    "providers": {
      "openai": {
        "baseUrl": "https://open.bigmodel.cn/api/paas/v4",
        "apiKey": "your-api-key"
      }
    }
  }
}
```

**购买链接：** https://open.bigmodel.cn/

---

### Minimax

```json
{
  "models": {
    "providers": {
      "openai": {
        "baseUrl": "https://api.minimaxi.com/v1",
        "apiKey": "your-api-key"
      }
    }
  }
}
```

**购买链接：** https://platform.minimaxi.com/subscribe/coding-plan

---

### Kimi

```json
{
  "models": {
    "providers": {
      "openai": {
        "baseUrl": "https://api.moonshot.cn/v1",
        "apiKey": "your-api-key"
      }
    }
  }
}
```

**购买链接：** https://kimi.moonshot.cn/

---

## 📝 5 分钟配置步骤

```bash
# 1. 安装 OpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash

# 2. 运行引导
openclaw onboard --install-daemon

# 3. 购买 Coding Plan（点击上方链接）

# 4. 获取 API Key（控制台复制）

# 5. 编辑配置
nano ~/.openclaw/openclaw.json

# 6. 重启
openclaw gateway restart
```

---

## ⚠️ 注意事项

| 平台 | API Key 格式 | Base URL | 备注 |
|------|:----------:|:--------:|------|
| 阿里百炼 | `sk-sp-xxxxx` | `coding.dashscope.aliyuncs.com/v1` | 专属 Key |
| 百度千帆 | `sk-sp-xxxxx` | `coding.dashscope.aliyuncs.com/v1` | 每日限量（10:30/17:00） |
| 腾讯云 | `sk-sp-xxxxx` | `coding.dashscope.aliyuncs.com/v1` | 专属 Key |
| 火山引擎 | `sk-sp-xxxxx` | `coding.dashscope.aliyuncs.com/v1` | 专属 Key |
| 智谱 GLM | `xxxxx` | `open.bigmodel.cn/api/paas/v4` | - |
| Minimax | `xxxxx` | `api.minimaxi.com/v1` | - |
| Kimi | `xxxxx` | `api.moonshot.cn/v1` | - |

**重要：**
- ⛔ 专属 API Key 不能与通用 Key 混用
- ⛔ 不支持退款
- ⛔ 仅限编程工具使用，禁止批量调用

---

## 📈 额度对比

| 平台 | Lite/入门 | Pro/专业 |
|------|:---------:|:--------:|
| 阿里百炼 | 1200 次/5 小时 | 6000 次/5 小时 |
| 百度千帆 | 1200 次/5 小时 | 6000 次/5 小时 |
| 火山引擎 | 1200 次/5 小时 | 6000 次/5 小时 |
| 智谱 GLM | 80 次/5 小时 | 400 次/5 小时 |
| Minimax | 40 次/5 小时 | 100 次/5 小时 |
| Kimi | - | 2048 次/周 |

---

**更新：** 2026-03-17  
**字数：** 约 1000 字  
**阅读：** 2 分钟
