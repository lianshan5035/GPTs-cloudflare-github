# 🔧 环境变量配置指南

## 📋 当前状态

✅ GitHub令牌已配置: `ghp_***` (已隐藏)
✅ GitHub仓库已配置: `lianshan5035/GPTs-cloudflare-github`

## 🔑 需要配置的密钥

### 1. Cloudflare API令牌
**您刚才在Cloudflare页面创建的令牌**
- 替换 `.env` 文件中的 `your_cloudflare_api_token_here`
- 格式类似: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Cloudflare账户ID
**在Cloudflare控制台右侧边栏的Account ID**
- 替换 `.env` 文件中的 `your_cloudflare_account_id_here`
- 格式类似: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. OpenAI API密钥
**从OpenAI平台获取的API密钥**
- 访问: https://platform.openai.com/api-keys
- 替换 `.env` 文件中的 `your_openai_api_key_here`
- 格式类似: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 🚀 配置步骤

### 方法1: 使用编辑器
```bash
cd /Volumes/M2/GPTs-cloudflare-github
nano .env
```

### 方法2: 使用命令行替换
```bash
# 替换Cloudflare API令牌
sed -i '' 's/your_cloudflare_api_token_here/YOUR_ACTUAL_TOKEN/g' .env

# 替换Cloudflare账户ID
sed -i '' 's/your_cloudflare_account_id_here/YOUR_ACTUAL_ACCOUNT_ID/g' .env

# 替换OpenAI API密钥
sed -i '' 's/your_openai_api_key_here/YOUR_ACTUAL_OPENAI_KEY/g' .env
```

## 🧪 测试配置

配置完成后，运行以下命令测试：

```bash
# 安装依赖
npm install

# 运行状态检查
./scripts/start.sh
```

选择 "3) 运行状态检查示例" 来验证所有服务是否正常连接。

## 📝 配置示例

配置完成后的.env文件应该类似：

```env
# OpenAI配置
OPENAI_API_KEY=sk-your-actual-openai-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000

# Cloudflare配置
CLOUDFLARE_API_TOKEN=your-actual-cloudflare-token-here
CLOUDFLARE_ACCOUNT_ID=your-actual-cloudflare-account-id-here
CLOUDFLARE_ZONE_ID=your_cloudflare_zone_id_here

# GitHub配置
GITHUB_TOKEN=ghp_your-actual-github-token-here
GITHUB_REPO=lianshan5035/GPTs-cloudflare-github
GITHUB_OWNER=lianshan5035
```

## ⚠️ 安全提醒

- 永远不要将包含真实密钥的.env文件提交到Git
- 定期轮换API密钥
- 使用最小权限原则
- 妥善保管所有密钥
