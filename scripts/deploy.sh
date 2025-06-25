#!/bin/bash

# 博客自动部署脚本

echo "🚀 开始部署博客..."

# 1. 清理并生成博客
echo "📝 生成博客文件..."
npm run build

# 检查生成是否成功
if [ $? -ne 0 ]; then
    echo "❌ 博客生成失败"
    exit 1
fi

# 2. 添加所有更改到 Git
echo "📦 添加文件到 Git..."
git add .

# 3. 检查是否有更改
if git diff --staged --quiet; then
    echo "ℹ️  没有新的更改需要提交"
    exit 0
fi

# 4. 提交更改
COMMIT_MSG="博客更新: $(date '+%Y-%m-%d %H:%M:%S')"
echo "💾 提交更改: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# 5. 推送到远程仓库
echo "📤 推送到 GitHub..."
git push origin master

# 检查推送是否成功
if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo "🌐 博客已更新到: https://focusmee.github.io"
else
    echo "❌ 推送失败，请检查网络连接和权限"
    exit 1
fi 