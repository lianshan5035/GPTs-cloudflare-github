#!/bin/bash

# GitHub仓库推送脚本 - 使用个人访问令牌版本
# 使用方法: ./push-to-github-token.sh

echo "🚀 准备推送项目到GitHub..."
echo "GitHub用户名: lianshan5035"
echo "仓库名称: GPTs-cloudflare-github"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

echo ""
echo "📋 推送步骤说明:"
echo "1. 如果您还没有GitHub个人访问令牌，请先创建一个"
echo "2. 访问: https://github.com/settings/tokens"
echo "3. 点击 'Generate new token' -> 'Generate new token (classic)'"
echo "4. 选择权限: repo (完整仓库权限)"
echo "5. 复制生成的令牌"
echo ""

read -p "您是否已经准备好个人访问令牌? (y/n): " ready

if [ "$ready" != "y" ]; then
    echo "请先创建个人访问令牌，然后重新运行此脚本"
    exit 0
fi

echo ""
echo "🔐 使用个人访问令牌推送代码..."
echo "当提示输入用户名时，请输入: lianshan5035"
echo "当提示输入密码时，请输入您的个人访问令牌（不是GitHub密码）"
echo ""

# 推送代码
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 代码推送成功！"
    echo "📋 仓库地址: https://github.com/lianshan5035/GPTs-cloudflare-github"
    echo ""
    echo "✅ 下一步操作:"
    echo "1. 访问 https://github.com/lianshan5035/GPTs-cloudflare-github 查看仓库"
    echo "2. 复制 config/env.example 为 .env 并配置API密钥"
    echo "3. 运行 npm install 安装依赖"
    echo "4. 运行 ./scripts/start.sh 启动项目"
else
    echo "❌ 代码推送失败"
    echo "💡 请确保:"
    echo "1. GitHub仓库已创建"
    echo "2. 个人访问令牌有效且有repo权限"
    echo "3. 网络连接正常"
fi
