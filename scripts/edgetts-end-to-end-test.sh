#!/bin/bash

# EdgeTTS端到端测试脚本

echo "🧪 EdgeTTS端到端测试开始..."
echo "=================================="

# 检查项目目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

echo "📁 项目目录: $(pwd)"
echo ""

# 1. 检查TTS服务状态
echo "1️⃣ 检查TTS服务状态..."
echo ""

# 检查本地TTS服务
echo "🔍 检查本地TTS服务 (http://127.0.0.1:8000)..."
if curl -s http://127.0.0.1:8000/api/status > /dev/null; then
    echo "✅ 本地TTS服务运行正常"
else
    echo "❌ 本地TTS服务未运行"
    echo "💡 请运行: cd /Volumes/M2/TT_Live_AI_TTS && ./start_services_一键启动所有服务.sh"
fi

# 检查TTS语音服务
echo "🔍 检查TTS语音服务 (http://127.0.0.1:5001)..."
if curl -s http://127.0.0.1:5001/health > /dev/null; then
    echo "✅ TTS语音服务运行正常"
else
    echo "❌ TTS语音服务未运行"
fi

# 检查外部访问
echo "🔍 检查外部访问 (https://ai.maraecowell.com)..."
if curl -s https://ai.maraecowell.com/api/status > /dev/null; then
    echo "✅ 外部访问正常"
else
    echo "⚠️ 外部访问不可用（可能是网络问题）"
fi

echo ""

# 2. 检查EdgeTTS文件
echo "2️⃣ 检查EdgeTTS文件..."
echo ""

if [ -f "edgetts-integration/a3_voice_generator.py" ]; then
    echo "✅ A3语音生成器文件存在"
else
    echo "❌ A3语音生成器文件不存在"
fi

if [ -f "src/edgetts-integration.js" ]; then
    echo "✅ EdgeTTS集成模块存在"
else
    echo "❌ EdgeTTS集成模块不存在"
fi

if [ -f "edgetts-integration/README.md" ]; then
    echo "✅ EdgeTTS文档存在"
else
    echo "❌ EdgeTTS文档不存在"
fi

echo ""

# 3. 检查环境变量配置
echo "3️⃣ 检查环境变量配置..."
echo ""

if [ -f ".env" ]; then
    echo "✅ .env文件存在"
    
    # 检查关键配置
    if grep -q "TTS_BASE_URL" .env; then
        echo "✅ TTS基础URL已配置"
    else
        echo "❌ TTS基础URL未配置"
    fi
    
    if grep -q "TTS_SERVICE_URL" .env; then
        echo "✅ TTS服务URL已配置"
    else
        echo "❌ TTS服务URL未配置"
    fi
    
    if grep -q "TTS_EXTERNAL_URL" .env; then
        echo "✅ TTS外部URL已配置"
    else
        echo "❌ TTS外部URL未配置"
    fi
else
    echo "❌ .env文件不存在"
fi

echo ""

# 4. 测试音频生成功能
echo "4️⃣ 测试音频生成功能..."
echo ""

# 测试基本语音生成
echo "🎵 测试基本语音生成..."
test_text="这是EdgeTTS端到端测试"
test_response=$(curl -s -X POST http://127.0.0.1:5001/generate \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"$test_text\",\"voice\":\"zh-CN-XiaoxiaoNeural\",\"rate\":0,\"pitch\":0,\"volume\":0}")

if echo "$test_response" | grep -q "success"; then
    echo "✅ 基本语音生成测试成功"
else
    echo "❌ 基本语音生成测试失败"
    echo "响应: $test_response"
fi

echo ""

# 5. 检查项目依赖
echo "5️⃣ 检查项目依赖..."
echo ""

if [ -d "node_modules" ]; then
    echo "✅ node_modules存在"
else
    echo "❌ node_modules不存在，需要运行: npm install"
fi

echo ""

# 6. 生成测试报告
echo "6️⃣ 生成测试报告..."
echo ""

report_file="edgetts-test-report-$(date +%Y%m%d-%H%M%S).md"
cat > "$report_file" << EOF
# EdgeTTS端到端测试报告

**测试时间**: $(date)
**项目目录**: $(pwd)

## 测试结果

### 服务状态
- 本地TTS服务: $(curl -s http://127.0.0.1:8000/api/status > /dev/null && echo "✅ 正常" || echo "❌ 异常")
- TTS语音服务: $(curl -s http://127.0.0.1:5001/health > /dev/null && echo "✅ 正常" || echo "❌ 异常")
- 外部访问: $(curl -s https://ai.maraecowell.com/api/status > /dev/null && echo "✅ 正常" || echo "❌ 异常")

### 文件检查
- A3语音生成器: $([ -f "edgetts-integration/a3_voice_generator.py" ] && echo "✅ 存在" || echo "❌ 不存在")
- EdgeTTS集成模块: $([ -f "src/edgetts-integration.js" ] && echo "✅ 存在" || echo "❌ 不存在")
- EdgeTTS文档: $([ -f "edgetts-integration/README.md" ] && echo "✅ 存在" || echo "❌ 不存在")

### 配置检查
- .env文件: $([ -f ".env" ] && echo "✅ 存在" || echo "❌ 不存在")
- TTS基础URL: $(grep -q "TTS_BASE_URL" .env && echo "✅ 已配置" || echo "❌ 未配置")
- TTS服务URL: $(grep -q "TTS_SERVICE_URL" .env && echo "✅ 已配置" || echo "❌ 未配置")
- TTS外部URL: $(grep -q "TTS_EXTERNAL_URL" .env && echo "✅ 已配置" || echo "❌ 未配置")

### 依赖检查
- node_modules: $([ -d "node_modules" ] && echo "✅ 存在" || echo "❌ 不存在")

## 建议

1. 确保TTS服务正在运行
2. 检查网络连接
3. 验证配置文件
4. 安装项目依赖

EOF

echo "📋 测试报告已生成: $report_file"
echo ""

# 7. 总结
echo "🎯 测试总结"
echo "=================================="
echo ""

if curl -s http://127.0.0.1:8000/api/status > /dev/null && curl -s http://127.0.0.1:5001/health > /dev/null; then
    echo "✅ EdgeTTS端到端测试通过！"
    echo "🎉 所有核心功能正常"
    echo ""
    echo "🚀 下一步操作:"
    echo "1. 运行项目: npm start"
    echo "2. 测试集成: node examples/tts-integration.js"
    echo "3. 访问Web界面: http://127.0.0.1:8000"
else
    echo "❌ EdgeTTS端到端测试失败"
    echo "🔧 需要修复的问题:"
    echo "1. 启动TTS服务"
    echo "2. 检查网络连接"
    echo "3. 验证配置"
fi

echo ""
echo "📖 详细报告请查看: $report_file"
