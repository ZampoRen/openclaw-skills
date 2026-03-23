# 示例脚本

这个文件夹存放可复用的脚本文件。

## 示例：项目初始化脚本

```bash
#!/bin/bash
# init-project.sh - 快速初始化新项目

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
  echo "Usage: ./init-project.sh <project-name>"
  exit 1
fi

mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# 创建基础结构
mkdir -p src tests docs

# 初始化 git
git init

# 创建 README
cat > README.md << EOF
# $PROJECT_NAME

## Setup

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`
EOF

echo "Project '$PROJECT_NAME' initialized!"
```

## 使用方式

1. 复制脚本到你的项目
2. 根据需要修改
3. 执行 `chmod +x script.sh`
4. 运行脚本
