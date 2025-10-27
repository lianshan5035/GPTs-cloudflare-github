/**
 * 集成管理器 - 负责协调GPTs、Cloudflare和GitHub之间的交互
 */

export class IntegrationManager {
  constructor(clients) {
    this.gpts = clients.gpts;
    this.cloudflare = clients.cloudflare;
    this.github = clients.github;
    this.tts = clients.tts;
    this.edgetts = clients.edgetts;
  }

  /**
   * 同步数据到各个服务
   */
  async syncToServices(data, options = {}) {
    const {
      syncToCloudflare = true,
      syncToGitHub = true,
      cloudflareOptions = {},
      githubOptions = {}
    } = options;

    const results = {};

    try {
      // 同步到Cloudflare
      if (syncToCloudflare && this.cloudflare.isReady) {
        results.cloudflare = await this.syncToCloudflare(data, cloudflareOptions);
      }

      // 同步到GitHub
      if (syncToGitHub && this.github.isReady) {
        results.github = await this.syncToGitHub(data, githubOptions);
      }

      console.log('🔄 数据同步完成');
      return results;
    } catch (error) {
      console.error('❌ 数据同步失败:', error.message);
      throw error;
    }
  }

  /**
   * 同步到Cloudflare
   */
  async syncToCloudflare(data, options = {}) {
    try {
      const {
        scriptName = 'gpts-integration',
        route = null,
        storeInKV = false,
        kvNamespace = null
      } = options;

      const results = {};

      // 如果数据包含代码，部署为Worker
      if (data.code) {
        results.worker = await this.cloudflare.deployWorker(
          scriptName,
          data.code,
          { route, ...options }
        );
      }

      // 如果需要存储到KV
      if (storeInKV && kvNamespace) {
        results.kv = await this.cloudflare.setKVValue(
          kvNamespace,
          `data_${Date.now()}`,
          JSON.stringify(data)
        );
      }

      console.log('☁️ Cloudflare同步完成');
      return results;
    } catch (error) {
      console.error('❌ Cloudflare同步失败:', error.message);
      throw error;
    }
  }

  /**
   * 同步到GitHub
   */
  async syncToGitHub(data, options = {}) {
    try {
      const {
        filePath = 'generated/data.json',
        commitMessage = 'Auto-generated content from GPTs',
        branch = 'main',
        createPR = false,
        prTitle = 'Auto-generated content update'
      } = options;

      const results = {};

      // 创建或更新文件
      results.file = await this.github.createOrUpdateFile(
        filePath,
        JSON.stringify(data, null, 2),
        commitMessage,
        { branch }
      );

      // 如果需要创建PR
      if (createPR) {
        const prBranch = `auto-update-${Date.now()}`;
        await this.github.createBranch(prBranch, branch);
        
        results.pr = await this.github.createPullRequest(
          prTitle,
          `自动生成的更新内容\n\n数据来源: GPTs\n时间: ${new Date().toISOString()}`,
          prBranch,
          branch
        );
      }

      console.log('📦 GitHub同步完成');
      return results;
    } catch (error) {
      console.error('❌ GitHub同步失败:', error.message);
      throw error;
    }
  }

  /**
   * 部署到Cloudflare
   */
  async deployToCloudflare(options = {}) {
    try {
      const {
        scriptName = 'gpts-app',
        route = 'gpts.example.com/*',
        generateCode = true,
        codeDescription = 'GPTs集成应用'
      } = options;

      let scriptContent = options.scriptContent;

      // 如果没有提供脚本内容，使用GPTs生成
      if (!scriptContent && generateCode) {
        const codeResult = await this.gpts.generateCode(codeDescription, 'javascript');
        scriptContent = codeResult.code;
      }

      if (!scriptContent) {
        throw new Error('没有可部署的脚本内容');
      }

      const result = await this.cloudflare.deployWorker(scriptName, scriptContent, {
        route,
        ...options
      });

      console.log('🚀 Cloudflare部署完成');
      return result;
    } catch (error) {
      console.error('❌ Cloudflare部署失败:', error.message);
      throw error;
    }
  }

  /**
   * 更新GitHub仓库
   */
  async updateGitHubRepo(options = {}) {
    try {
      const {
        generateContent = true,
        contentDescription = '项目更新内容',
        filePath = 'README.md',
        commitMessage = 'Auto-update from GPTs integration'
      } = options;

      let content = options.content;

      // 如果没有提供内容，使用GPTs生成
      if (!content && generateContent) {
        const contentResult = await this.gpts.query(
          `请生成${contentDescription}的内容，格式为Markdown`
        );
        content = contentResult.content;
      }

      if (!content) {
        throw new Error('没有可更新的内容');
      }

      const result = await this.github.createOrUpdateFile(
        filePath,
        content,
        commitMessage
      );

      console.log('📝 GitHub仓库更新完成');
      return result;
    } catch (error) {
      console.error('❌ GitHub仓库更新失败:', error.message);
      throw error;
    }
  }

  /**
   * 自动化工作流
   */
  async runAutomationWorkflow(workflowConfig) {
    try {
      const {
        trigger = 'manual',
        steps = [],
        onSuccess = null,
        onError = null
      } = workflowConfig;

      console.log(`🔄 开始执行自动化工作流 (触发方式: ${trigger})`);

      const results = [];
      
      for (const step of steps) {
        try {
          console.log(`📋 执行步骤: ${step.name}`);
          
          let result;
          switch (step.type) {
            case 'gpts_query':
              result = await this.gpts.query(step.prompt, step.options);
              break;
            case 'cloudflare_deploy':
              result = await this.deployToCloudflare(step.options);
              break;
            case 'github_update':
              result = await this.updateGitHubRepo(step.options);
              break;
            case 'sync_all':
              result = await this.syncToServices(step.data, step.options);
              break;
            default:
              throw new Error(`未知的步骤类型: ${step.type}`);
          }

          results.push({
            step: step.name,
            success: true,
            result
          });

          console.log(`✅ 步骤完成: ${step.name}`);
        } catch (error) {
          console.error(`❌ 步骤失败: ${step.name}`, error.message);
          
          results.push({
            step: step.name,
            success: false,
            error: error.message
          });

          // 如果配置了错误处理，执行错误回调
          if (onError) {
            await onError(step, error);
          }
        }
      }

      console.log('🎉 自动化工作流执行完成');
      
      // 如果配置了成功回调，执行成功回调
      if (onSuccess) {
        await onSuccess(results);
      }

      return results;
    } catch (error) {
      console.error('❌ 自动化工作流执行失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取集成状态
   */
  getIntegrationStatus() {
    return {
      gpts: this.gpts.isReady,
      cloudflare: this.cloudflare.isReady,
      github: this.github.isReady,
      tts: this.tts.isReady,
      edgetts: this.edgetts.isReady,
      timestamp: new Date().toISOString()
    };
  }
}
