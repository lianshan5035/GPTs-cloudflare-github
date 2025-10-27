/**
 * GPTs-Cloudflare-GitHub 联动项目主入口文件
 * 
 * 这个文件是整个项目的核心，负责协调GPTs、Cloudflare和GitHub之间的交互
 */

import dotenv from 'dotenv';
import { GPTsClient } from './gpts-client.js';
import { CloudflareClient } from './cloudflare-client.js';
import { GitHubClient } from './github-client.js';
import { IntegrationManager } from './integration-manager.js';

// 加载环境变量
dotenv.config();

class GPTsCloudflareGitHub {
  constructor(config = {}) {
    this.config = {
      openaiApiKey: config.openaiApiKey || process.env.OPENAI_API_KEY,
      cloudflareToken: config.cloudflareToken || process.env.CLOUDFLARE_API_TOKEN,
      cloudflareAccountId: config.cloudflareAccountId || process.env.CLOUDFLARE_ACCOUNT_ID,
      githubToken: config.githubToken || process.env.GITHUB_TOKEN,
      githubRepo: config.githubRepo || process.env.GITHUB_REPO,
      ...config
    };

    // 初始化各个客户端
    this.gptsClient = new GPTsClient(this.config.openaiApiKey);
    this.cloudflareClient = new CloudflareClient({
      token: this.config.cloudflareToken,
      accountId: this.config.cloudflareAccountId
    });
    this.githubClient = new GitHubClient({
      token: this.config.githubToken,
      repo: this.config.githubRepo
    });

    // 初始化集成管理器
    this.integrationManager = new IntegrationManager({
      gpts: this.gptsClient,
      cloudflare: this.cloudflareClient,
      github: this.githubClient
    });
  }

  /**
   * 启动联动服务
   */
  async start() {
    try {
      console.log('🚀 启动GPTs-Cloudflare-GitHub联动服务...');
      
      // 验证配置
      await this.validateConfig();
      
      // 初始化各个服务
      await this.initializeServices();
      
      console.log('✅ 服务启动成功！');
      console.log('📊 服务状态:');
      console.log(`   - GPTs客户端: ${this.gptsClient.isReady ? '✅ 就绪' : '❌ 未就绪'}`);
      console.log(`   - Cloudflare客户端: ${this.cloudflareClient.isReady ? '✅ 就绪' : '❌ 未就绪'}`);
      console.log(`   - GitHub客户端: ${this.githubClient.isReady ? '✅ 就绪' : '❌ 未就绪'}`);
      
      return true;
    } catch (error) {
      console.error('❌ 服务启动失败:', error.message);
      throw error;
    }
  }

  /**
   * 验证配置
   */
  async validateConfig() {
    const required = ['openaiApiKey', 'cloudflareToken', 'githubToken'];
    const missing = required.filter(key => !this.config[key]);
    
    if (missing.length > 0) {
      throw new Error(`缺少必要的配置项: ${missing.join(', ')}`);
    }
  }

  /**
   * 初始化各个服务
   */
  async initializeServices() {
    await Promise.all([
      this.gptsClient.initialize(),
      this.cloudflareClient.initialize(),
      this.githubClient.initialize()
    ]);
  }

  /**
   * 执行GPTs查询并同步到Cloudflare和GitHub
   */
  async processQuery(query, options = {}) {
    try {
      console.log(`🤖 处理查询: ${query}`);
      
      // 使用GPTs处理查询
      const response = await this.gptsClient.query(query, options);
      
      // 如果配置了自动同步，则同步到Cloudflare和GitHub
      if (options.autoSync !== false) {
        await this.integrationManager.syncToServices(response, options);
      }
      
      return response;
    } catch (error) {
      console.error('❌ 查询处理失败:', error.message);
      throw error;
    }
  }

  /**
   * 部署到Cloudflare
   */
  async deployToCloudflare(options = {}) {
    return await this.integrationManager.deployToCloudflare(options);
  }

  /**
   * 更新GitHub仓库
   */
  async updateGitHubRepo(options = {}) {
    return await this.integrationManager.updateGitHubRepo(options);
  }

  /**
   * 获取服务状态
   */
  getStatus() {
    return {
      gpts: this.gptsClient.isReady,
      cloudflare: this.cloudflareClient.isReady,
      github: this.githubClient.isReady,
      timestamp: new Date().toISOString()
    };
  }
}

// 如果直接运行此文件，则启动服务
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = new GPTsCloudflareGitHub();
  
  app.start().catch(error => {
    console.error('启动失败:', error);
    process.exit(1);
  });
}

export default GPTsCloudflareGitHub;
export { GPTsCloudflareGitHub };
