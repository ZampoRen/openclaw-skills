# 短视频生成工作流 - 最小闭环

## 概述

输入文案 → AI 处理 → 搜素材 → 合成视频 → 导出 MP4

## 前置要求

### 1. Pexels API（免费）
```bash
# 申请：https://www.pexels.com/api/
# 免费额度：每月 200 API 请求，50 张图片
```

### 2. ffmpeg（已安装 ✅）
```bash
ffmpeg -version  # 确认已安装
```

### 3. 工作目录
```bash
mkdir -p ~/openclaw-videos/{input,output,assets}
```

---

## 工作流步骤

### Step 1: 输入
- 直接发文案文本
- 或发公众号链接（需要 web_fetch 提取）

### Step 2: AI 处理文案
```python
# 输入：
"OpenClaw 是一个自托管的 AI 网关，可以连接 Telegram、Discord、WhatsApp 等聊天软件，
让 AI 在你的服务器上运行，保护隐私。"

# 输出：
{
  "关键点": [
    "OpenClaw 是自托管 AI 网关",
    "支持多平台：Telegram、Discord、WhatsApp", 
    "数据本地运行，隐私安全"
  ],
  "配音稿": "今天给大家介绍一个超强的 AI 工具。它叫 OpenClaw，是一个自托管的 AI 网关...",
  "关键词": ["AI", "technology", "robot", "computer", "server"]
}
```

### Step 3: 搜索素材（Pexels API）
```bash
# 按关键词搜图
curl -H "Authorization: YOUR_PEXELS_KEY" \
  "https://api.pexels.com/v1/search?query=technology&per_page=5"
```

### Step 4: 下载素材
```bash
# 下载前 3 张图片到 input 目录
```

### Step 5: 生成配音（TTS）
```bash
# 用 OpenClaw TTS 生成配音
tts --text "配音文案" --output input/narration.mp3
```

### Step 6: 合成视频（ffmpeg）
```bash
# 核心逻辑：
# 1. 每张图片展示 5-8 秒
# 2. 添加缩放动效（pan and zoom）
# 3. 拼接在一起
# 4. 叠加配音 + 背景音乐
# 5. 导出 1080x1920 竖版视频
```

### Step 7: 交付
- 输出 MP4 到 output 目录
- 发送给用户

---

## 示例命令

### 测试搜图
```bash
curl -H "Authorization: YOUR_KEY" \
  "https://api.pexels.com/v1/search?query=artificial+intelligence&per_page=3"
```

### ffmpeg 合成（核心）
```bash
# 伪代码，实际脚本会更复杂
ffmpeg \
  -loop 1 -i img1.jpg -loop 1 -i img2.jpg -loop 1 -i img3.jpg \
  -filter_complex "[0:v]scale=1080:1920,zoompan=z='min(zoom+0.001,1.5)':d=250:s=1080x1920[v0];
                    [1:v]scale=1080:1920,zoompan=z='min(zoom+0.001,1.5)':d=250:s=1080x1920[v1];
                    [2:v]scale=1080:1920,zoompan=z='min(zoom+0.001,1.5)':d=250:s=1080x1920[v2];
                    [v0][v1][v2]concat=n=3:v=1:a=0[out]" \
  -map "[out]" -i narration.mp3 -i bgm.mp3 \
  -shortest -map 0:a -map 1:a -c:a aac -b:a 128k \
  output.mp4
```

---

## 待确认

1. **Pexels API Key** - 你去申请一下，我来配
2. **视频风格** - 竖版（9:16）还是横版（16:9）？
3. **每张图展示时长** - 5秒？8秒？
4. **背景音乐** - 要还是不要？

---

## 下一步

你先去 Pexels 申请个 API Key：
https://www.pexels.com/api/

申请完告诉我，我帮你配置好，然后我们跑一遍测试。