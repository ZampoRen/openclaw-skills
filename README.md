# OpenClaw Skills

我的 OpenClaw 个人技能仓库

---

## 目录结构

```
ai-skills/
├── backend/          # 后端相关技能
│   └── ima-note/     # IMA 笔记管理
├── ai/               # AI 相关技能
├── devops/           # 运维相关技能
└── web3/             # Web3 相关技能
```

---

## 使用方式

### 安装技能

```bash
# 克隆仓库
git clone git@github.com:ZampoRen/openclaw-skills.git

# 复制技能到 OpenClaw 目录
cp -r ai-skills/backend/ima-note ~/.openclaw/workspace/skills/
```

### 配置环境变量

某些技能需要配置 API Key：

```bash
export IMA_OPENAPI_CLIENTID="your_client_id"
export IMA_OPENAPI_APIKEY="your_api_key"
```

---

## 已有技能

| 技能 | 分类 | 说明 |
|------|------|------|
| ima-note | backend | IMA 个人笔记管理，支持搜索、创建、追加内容 |

---

## 贡献

欢迎提交 Issue 和 Pull Request！

---

## License

MIT
