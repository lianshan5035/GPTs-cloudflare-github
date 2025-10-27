#!/bin/bash

# GPTs-Cloudflare-GitHub 项目配置验证脚本

echo "🔍 GPTs-Cloudflare-GitHub 项目配置验证"
echo "========================================"

# 检查项目目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

echo "📁 项目目录: $(pwd)"
echo ""

# 检查.env文件
if [ ! -f ".env" ]; then
    echo "❌ .env文件不存在"
    exit 1
fi

echo "✅ .env文件存在"
echo ""

# 检查配置
echo "🔧 检查API密钥配置:"
echo ""

# 检查OpenAI API密钥
if grep -q "sk-proj-" .env; then
    echo "✅ OpenAI API密钥: 已配置"
else
    echo "❌ OpenAI API密钥: 未配置"
fi

# 检查GitHub令牌
if grep -q "ghp_" .env; then
    echo "✅ GitHub令牌: 已配置"
else
    echo "❌ GitHub令牌: 未配置"
fi

# 检查Cloudflare API令牌
if grep -q "xpTTjtp-" .env; then
    echo "✅ Cloudflare API令牌: 已配置"
else
    echo "❌ Cloudflare API令牌: 未配置"
fi

# 检查Cloudflare账户ID
if grep -q "1808c031cbe86a8a0212f49de1b32470" .env; then
    echo "✅ Cloudflare账户ID: 已配置"
else
    echo "❌ Cloudflare账户ID: 未配置"
fi

echo ""
echo "📋 项目文件结构:"
echo ""

# 检查主要文件
files=("src/index.js" "src/gpts-client.js" "src/cloudflare-client.js" "src/github-client.js" "src/integration-manager.js" "README.md" "package.json")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file"
    fi
done

echo ""
echo "🎯 下一步操作:"
echo "1. 解决网络连接问题"
echo "2. 安装项目依赖: npm install 或 yarn install"
echo "3. 运行项目测试: ./scripts/start.sh"
echo ""

echo "📖 项目文档:"
echo "- README.md: 项目说明"
echo "- API_KEYS_GUIDE.md: API密钥获取指南"
echo "- CONFIG_GUIDE.md: 配置指南"
echo "- GITHUB_SETUP.md: GitHub设置指南"
echo ""

echo "🌐 项目仓库: https://github.com/lianshan5035/GPTs-cloudflare-github"
echo ""
echo "✅ 配置验证完成！"
