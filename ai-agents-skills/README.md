# AI Agents Skills Library

这个文件夹包含可供 Cursor Codex、Claude Code 等 AI 编程助手使用的通用技能/脚本。

## 目录结构

```
ai-agents-skills/
├── README.md           # 本文件
├── scripts/            # 可执行脚本
├── snippets/           # 代码片段
├── templates/          # 模板文件
└── docs/               # 文档
```

## 设置软链接

### 方法 1：在项目根目录创建软链接

```bash
# 在你的项目根目录执行
ln -s /Users/zampo/.openclaw/workspace/ai-agents-skills ./ai-agents-skills
```

### 方法 2：在 Cursor/Claude Code 配置中引用

在 `.cursorrules` 或 `.clinerules` 中添加：

```
Skills library: /Users/zampo/.openclaw/workspace/ai-agents-skills
```

### 方法 3：全局软链接（推荐）

```bash
# 在用户主目录创建软链接
ln -s /Users/zampo/.openclaw/workspace/ai-agents-skills ~/ai-agents-skills
```

然后在任何项目中都可以引用 `~/ai-agents-skills`

## 使用方式

1. **Cursor Codex**: 在对话中引用技能文件路径
2. **Claude Code**: 使用 `@ai-agents-skills` 引用（如果配置了软链接）
3. **其他工具**: 直接读取文件夹内容

## 添加技能

将可复用的脚本、模板、代码片段放入对应子目录，并更新本文档。
