#!/bin/bash

# GitHub仓库推送脚本
# 使用方法: ./push-to-github.sh your-github-username

if [ $# -eq 0 ]; then
    echo "❌ 请提供您的GitHub用户名"
    echo "使用方法: $0 your-github-username"
    echo "例如: $0 lianshan5035"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="GPTs-cloudflare-github"

echo "🚀 准备推送项目到GitHub..."
echo "GitHub用户名: $GITHUB_USERNAME"
echo "仓库名称: $REPO_NAME"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 添加远程仓库
echo "📡 添加远程仓库..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

# 检查远程仓库是否添加成功
if [ $? -ne 0 ]; then
    echo "⚠️  远程仓库可能已存在，尝试更新..."
    git remote set-url origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
fi

# 推送代码
echo "📤 推送代码到GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 代码推送成功！"
    echo "📋 仓库地址: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "✅ 下一步操作:"
    echo "1. 访问 https://github.com/$GITHUB_USERNAME/$REPO_NAME 查看仓库"
    echo "2. 复制 config/env.example 为 .env 并配置API密钥"
    echo "3. 运行 npm install 安装依赖"
    echo "4. 运行 ./scripts/start.sh 启动项目"
else
    echo "❌ 代码推送失败"
    echo "💡 请确保:"
    echo "1. GitHub仓库已创建"
    echo "2. 您有推送权限"
    echo "3. 网络连接正常"
fi
