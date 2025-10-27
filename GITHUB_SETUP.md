# GitHub仓库创建和推送指南

## 🎯 目标
将本地创建的GPTs-Cloudflare-GitHub联动项目推送到GitHub远程仓库。

## 📋 完整步骤

### 步骤1: 在GitHub网站创建仓库

1. **访问GitHub创建页面**
   - 打开浏览器，访问: https://github.com/new

2. **填写仓库信息**
   ```
   Repository name: GPTs-cloudflare-github
   Description: GPTs与Cloudflare和GitHub的联动集成项目
   Visibility: Public (或 Private，根据您的需要)
   ```

3. **重要**: 不要勾选以下选项（我们已经有了）:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license

4. **点击 "Create repository"**

### 步骤2: 推送代码到GitHub

创建仓库后，在项目目录中运行以下命令：

```bash
# 进入项目目录
cd /Volumes/M2/GPTs-cloudflare-github

# 使用推送脚本（推荐）
./push-to-github.sh your-github-username

# 或者手动执行以下命令
git remote add origin https://github.com/your-username/GPTs-cloudflare-github.git
git branch -M main
git push -u origin main
```

### 步骤3: 验证仓库创建成功

1. 访问您的仓库: https://github.com/your-username/GPTs-cloudflare-github
2. 确认所有文件都已上传
3. 检查README.md是否正确显示

## 🔧 后续配置

### 1. 配置环境变量
```bash
# 复制环境变量示例文件
cp config/env.example .env

# 编辑.env文件，填入您的API密钥
nano .env
```

### 2. 安装依赖
```bash
npm install
```

### 3. 运行项目
```bash
# 使用启动脚本
./scripts/start.sh

# 或者直接运行示例
node examples/basic-usage.js
```

## 📝 环境变量配置

在`.env`文件中配置以下变量：

```env
# OpenAI配置
OPENAI_API_KEY=your_openai_api_key_here

# Cloudflare配置
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id_here

# GitHub配置
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_REPO=your-username/GPTs-cloudflare-github
```

## 🚨 常见问题

### 问题1: 推送失败
**解决方案**:
- 确保GitHub仓库已创建
- 检查仓库名称是否正确
- 确认您有推送权限

### 问题2: 认证失败
**解决方案**:
- 使用个人访问令牌而不是密码
- 确保令牌有仓库权限

### 问题3: 网络连接问题
**解决方案**:
- 检查网络连接
- 尝试使用VPN
- 使用SSH而不是HTTPS

## 📞 获取帮助

如果遇到问题，可以：
1. 查看GitHub文档: https://docs.github.com/
2. 检查项目README.md文件
3. 查看examples/目录中的示例代码

---

**注意**: 请将 `your-username` 替换为您的实际GitHub用户名。
