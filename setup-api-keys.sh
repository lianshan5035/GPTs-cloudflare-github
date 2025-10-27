#!/bin/bash

# API密钥配置助手脚本

echo "🔑 GPTs-Cloudflare-GitHub API密钥配置助手"
echo "=============================================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 创建.env文件
if [ ! -f ".env" ]; then
    echo "📝 创建.env文件..."
    cp config/env.example .env
    echo "✅ .env文件已创建"
else
    echo "⚠️  .env文件已存在"
fi

echo ""
echo "🔧 现在请按照以下步骤配置API密钥："
echo ""

echo "1️⃣ OpenAI API密钥 (OPENAI_API_KEY)"
echo "   访问: https://platform.openai.com/api-keys"
echo "   步骤: 登录 → API Keys → Create new secret key"
echo "   格式: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
echo ""

echo "2️⃣ Cloudflare API令牌 (CLOUDFLARE_API_TOKEN)"
echo "   访问: https://dash.cloudflare.com/profile/api-tokens"
echo "   步骤: 登录 → My Profile → API Tokens → Create Token"
echo "   权限: Account: Cloudflare Workers:Edit, Zone: Zone:Read"
echo ""

echo "3️⃣ Cloudflare账户ID (CLOUDFLARE_ACCOUNT_ID)"
echo "   位置: Cloudflare控制台右侧边栏"
echo "   步骤: 登录控制台 → 右侧找到 'Account ID' → 点击复制"
echo ""

echo "4️⃣ GitHub个人访问令牌 (GITHUB_TOKEN)"
echo "   访问: https://github.com/settings/tokens"
echo "   步骤: 登录 → Generate new token → Generate new token (classic)"
echo "   权限: 选择 'repo' (完整仓库权限)"
echo "   格式: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
echo ""

echo "📋 配置完成后，运行以下命令测试："
echo "   npm install"
echo "   ./scripts/start.sh"
echo ""

read -p "是否现在打开.env文件进行配置? (y/n): " open_env

if [ "$open_env" = "y" ]; then
    echo "📝 打开.env文件..."
    if command -v nano &> /dev/null; then
        nano .env
    elif command -v vim &> /dev/null; then
        vim .env
    else
        echo "请手动编辑 .env 文件"
        echo "文件位置: $(pwd)/.env"
    fi
fi

echo ""
echo "✅ 配置助手完成！"
echo "📖 详细说明请查看: API_KEYS_GUIDE.md"
