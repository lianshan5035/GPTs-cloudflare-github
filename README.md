# GPTs-Cloudflare-GitHub 联动项目

## 项目简介

这是一个集成GPTs、Cloudflare和GitHub的联动项目，旨在实现AI助手与云服务的无缝集成。

## 功能特性

- 🤖 **GPTs集成**: 与OpenAI GPTs进行深度集成
- ☁️ **Cloudflare服务**: 利用Cloudflare的CDN、Workers等服务
- 📦 **GitHub集成**: 自动化GitHub仓库管理和CI/CD流程
- 🎵 **TTS语音合成**: 集成本地TTS服务，支持语音生成
- 🔄 **自动化工作流**: 实现多平台间的自动化联动

## 项目结构

```
GPTs-cloudflare-github/
├── src/                    # 源代码目录
│   ├── index.js           # 主入口文件
│   ├── gpts-client.js     # GPTs客户端
│   ├── cloudflare-client.js # Cloudflare客户端
│   ├── github-client.js   # GitHub客户端
│   ├── tts-client.js      # TTS客户端
│   └── integration-manager.js # 集成管理器
├── tts-integration/        # TTS服务集成
├── config/                 # 配置文件
├── docs/                   # 项目文档
├── scripts/                # 脚本文件
├── examples/               # 示例代码
└── README.md              # 项目说明文档
```

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- Git
- Cloudflare账户
- GitHub账户
- OpenAI API密钥
- 本地TTS服务（可选）

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/your-username/GPTs-cloudflare-github.git
cd GPTs-cloudflare-github
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑.env文件，填入必要的API密钥和配置
```

4. 运行项目
```bash
npm start
```

## 配置说明

### 环境变量

在`.env`文件中配置以下变量：

```env
# OpenAI配置
OPENAI_API_KEY=your_openai_api_key

# Cloudflare配置
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_account_id

# GitHub配置
GITHUB_TOKEN=your_github_token
GITHUB_REPO=your_repo_name
```

## 使用示例

### 基本使用

```javascript
import { GPTsCloudflareGitHub } from './src/index.js';

const client = new GPTsCloudflareGitHub({
  openaiApiKey: process.env.OPENAI_API_KEY,
  cloudflareToken: process.env.CLOUDFLARE_API_TOKEN,
  githubToken: process.env.GITHUB_TOKEN
});

// 使用示例
await client.deployToCloudflare();
await client.updateGitHubRepo();
```

### TTS语音合成使用

```javascript
// 生成单个语音
const speechResult = await client.generateSpeech('你好，这是TTS测试');

// 批量生成语音
const texts = ['文本1', '文本2', '文本3'];
const batchResult = await client.generateBatchSpeech(texts);

// 获取TTS服务状态
const ttsStatus = await client.getTTSStatus();
```

### GPTs + TTS 联动

```javascript
// 使用GPTs生成内容
const content = await client.gptsClient.query('生成一段介绍文字');

// 转换为语音
const speech = await client.generateSpeech(content.content);

// 同步到GitHub
await client.updateGitHubRepo({
  content: `# 生成的内容\n\n${content.content}\n\n## 语音文件\n\n${speech.filename}`
});
```

## 开发指南

### 贡献代码

1. Fork本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 代码规范

- 使用ESLint进行代码检查
- 遵循Prettier代码格式化
- 编写单元测试
- 添加适当的注释和文档

## 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目链接: [https://github.com/your-username/GPTs-cloudflare-github](https://github.com/your-username/GPTs-cloudflare-github)
- 问题反馈: [Issues](https://github.com/your-username/GPTs-cloudflare-github/issues)

## 更新日志

### v1.0.0 (2024-10-27)
- 初始版本发布
- 基础GPTs集成功能
- Cloudflare Workers支持
- GitHub Actions集成

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
