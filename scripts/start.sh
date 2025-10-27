#!/bin/bash

# GPTs-Cloudflare-GitHub 联动项目启动脚本

echo "🚀 启动GPTs-Cloudflare-GitHub联动项目..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js (版本 >= 16.0.0)"
    exit 1
fi

# 检查Node.js版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js版本过低，需要版本 >= 16.0.0，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js版本检查通过: $(node -v)"

# 检查是否存在package.json
if [ ! -f "package.json" ]; then
    echo "❌ 未找到package.json文件，请确保在项目根目录运行此脚本"
    exit 1
fi

# 检查是否存在node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 安装项目依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚠️  未找到.env文件，请复制config/env.example为.env并配置相关参数"
    echo "📋 创建示例环境变量文件..."
    cp config/env.example .env
    echo "✅ 已创建.env文件，请编辑并填入必要的API密钥"
    echo "💡 提示: 编辑.env文件后重新运行此脚本"
    exit 0
fi

# 检查必要的环境变量
echo "🔍 检查环境变量配置..."

if ! grep -q "OPENAI_API_KEY=your_openai_api_key_here" .env; then
    echo "✅ OpenAI API密钥已配置"
else
    echo "⚠️  请配置OpenAI API密钥"
fi

if ! grep -q "CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here" .env; then
    echo "✅ Cloudflare API令牌已配置"
else
    echo "⚠️  请配置Cloudflare API令牌"
fi

if ! grep -q "GITHUB_TOKEN=your_github_personal_access_token_here" .env; then
    echo "✅ GitHub API令牌已配置"
else
    echo "⚠️  请配置GitHub API令牌"
fi

echo ""
echo "🎯 选择运行模式:"
echo "1) 运行基本示例"
echo "2) 运行代码生成示例"
echo "3) 运行状态检查示例"
echo "4) 运行所有示例"
echo "5) 启动开发服务器"
echo "6) 运行测试"

read -p "请输入选择 (1-6): " choice

case $choice in
    1)
        echo "🚀 运行基本示例..."
        node examples/basic-usage.js
        ;;
    2)
        echo "🚀 运行代码生成示例..."
        node -e "
        import('./examples/basic-usage.js').then(module => {
            module.codeGenerationExample();
        }).catch(console.error);
        "
        ;;
    3)
        echo "🚀 运行状态检查示例..."
        node -e "
        import('./examples/basic-usage.js').then(module => {
            module.statusCheckExample();
        }).catch(console.error);
        "
        ;;
    4)
        echo "🚀 运行所有示例..."
        node examples/basic-usage.js
        ;;
    5)
        echo "🚀 启动开发服务器..."
        npm run dev
        ;;
    6)
        echo "🚀 运行测试..."
        npm test
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "✅ 脚本执行完成!"
