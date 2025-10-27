# API密钥和令牌获取指南

## 🔑 获取各种API密钥和令牌的详细步骤

### 1. OpenAI API密钥 (OPENAI_API_KEY)

#### 步骤：
1. **访问OpenAI官网**
   - 打开: https://platform.openai.com/
   - 点击右上角 "Sign In" 登录您的账户

2. **进入API密钥页面**
   - 登录后，点击右上角头像
   - 选择 "API Keys" 或直接访问: https://platform.openai.com/api-keys

3. **创建新的API密钥**
   - 点击 "Create new secret key"
   - 输入密钥名称（如：GPTs-Cloudflare-GitHub项目）
   - 选择权限范围（建议选择 "All"）
   - 点击 "Create secret key"

4. **复制并保存密钥**
   - **重要**: 立即复制生成的密钥
   - 密钥格式类似：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - 页面关闭后无法再次查看

#### 注意事项：
- 需要绑定支付方式才能使用API
- 有使用额度限制，注意控制成本
- 密钥具有完整权限，请妥善保管

---

### 2. Cloudflare API令牌 (CLOUDFLARE_API_TOKEN)

#### 步骤：
1. **访问Cloudflare控制台**
   - 打开: https://dash.cloudflare.com/
   - 登录您的Cloudflare账户

2. **进入API令牌页面**
   - 点击右上角头像
   - 选择 "My Profile"
   - 点击 "API Tokens" 标签

3. **创建自定义令牌**
   - 点击 "Create Token"
   - 选择 "Custom token" 模板

4. **配置令牌权限**
   ```
   Token name: GPTs-Cloudflare-GitHub项目
   
   Permissions:
   - Account: Cloudflare Workers:Edit
   - Zone: Zone:Read
   - Zone: Zone Settings:Edit
   
   Account Resources:
   - Include: All accounts (或选择特定账户)
   
   Zone Resources:
   - Include: All zones (或选择特定域名)
   ```

5. **生成并复制令牌**
   - 点击 "Continue to summary"
   - 确认配置后点击 "Create Token"
   - 复制生成的令牌

#### 获取Cloudflare账户ID (CLOUDFLARE_ACCOUNT_ID)：
1. 在Cloudflare控制台右侧边栏找到 "Account ID"
2. 点击复制按钮获取账户ID

---

### 3. GitHub个人访问令牌 (GITHUB_TOKEN)

#### 步骤：
1. **访问GitHub令牌设置**
   - 打开: https://github.com/settings/tokens
   - 确保已登录GitHub账户

2. **创建新令牌**
   - 点击 "Generate new token"
   - 选择 "Generate new token (classic)"

3. **配置令牌**
   ```
   Note: GPTs-Cloudflare-GitHub项目
   Expiration: 90 days (或根据需要选择)
   
   Scopes (权限范围):
   ✅ repo (完整仓库权限)
     ✅ repo:status
     ✅ repo_deployment
     ✅ public_repo
     ✅ repo:invite
     ✅ security_events
   ✅ workflow (GitHub Actions)
   ✅ write:packages (包管理)
   ✅ delete:packages
   ✅ admin:org (组织管理)
   ✅ gist (Gist管理)
   ✅ notifications (通知)
   ✅ user (用户信息)
   ✅ delete_repo (删除仓库)
   ✅ write:discussion (讨论)
   ✅ read:discussion
   ✅ admin:public_key (公钥管理)
   ✅ write:public_key
   ✅ read:public_key
   ✅ admin:repo_hook (仓库钩子)
   ✅ write:repo_hook
   ✅ read:repo_hook
   ✅ admin:org_hook (组织钩子)
   ✅ write:org_hook
   ✅ read:org_hook
   ✅ admin:gpg_key (GPG密钥)
   ✅ write:gpg_key
   ✅ read:gpg_key
   ```

4. **生成令牌**
   - 点击 "Generate token"
   - 复制生成的令牌（格式：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

#### 注意事项：
- 令牌具有完整权限，请妥善保管
- 建议设置合理的过期时间
- 可以随时撤销令牌

---

## 🔧 配置环境变量

获取所有密钥后，按以下步骤配置：

### 1. 创建环境变量文件
```bash
cd /Volumes/M2/GPTs-cloudflare-github
cp config/env.example .env
```

### 2. 编辑.env文件
```bash
nano .env
```

### 3. 填入您的密钥
```env
# OpenAI配置
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000

# Cloudflare配置
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token-here
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id-here
CLOUDFLARE_ZONE_ID=your-cloudflare-zone-id-here

# GitHub配置
GITHUB_TOKEN=ghp_your-github-token-here
GITHUB_REPO=lianshan5035/GPTs-cloudflare-github
GITHUB_OWNER=lianshan5035

# 项目配置
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
```

## 🚨 安全注意事项

1. **永远不要将.env文件提交到Git**
2. **定期轮换API密钥**
3. **使用最小权限原则**
4. **不要在代码中硬编码密钥**
5. **使用环境变量管理敏感信息**

## 🧪 测试配置

配置完成后，运行以下命令测试：

```bash
# 安装依赖
npm install

# 运行测试
./scripts/start.sh
```

选择 "3) 运行状态检查示例" 来验证所有服务是否正常连接。

---

## 📞 获取帮助

如果遇到问题：
1. 查看各平台的官方文档
2. 检查网络连接
3. 确认账户权限
4. 验证密钥格式是否正确
