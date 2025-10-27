/**
 * GPTs客户端 - 负责与OpenAI GPTs API交互
 */

export class GPTsClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.isReady = false;
    this.client = null;
  }

  /**
   * 初始化GPTs客户端
   */
  async initialize() {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API密钥未配置');
      }

      // 动态导入OpenAI客户端
      const { OpenAI } = await import('openai');
      this.client = new OpenAI({
        apiKey: this.apiKey,
      });

      // 测试连接
      await this.testConnection();
      
      this.isReady = true;
      console.log('✅ GPTs客户端初始化成功');
    } catch (error) {
      console.error('❌ GPTs客户端初始化失败:', error.message);
      throw error;
    }
  }

  /**
   * 测试API连接
   */
  async testConnection() {
    try {
      const response = await this.client.models.list();
      console.log('🔗 GPTs API连接测试成功');
      return response;
    } catch (error) {
      throw new Error(`GPTs API连接失败: ${error.message}`);
    }
  }

  /**
   * 发送查询到GPTs
   */
  async query(prompt, options = {}) {
    if (!this.isReady) {
      throw new Error('GPTs客户端未初始化');
    }

    try {
      const {
        model = 'gpt-4',
        maxTokens = 2000,
        temperature = 0.7,
        systemMessage = '你是一个有用的AI助手，专门处理GPTs、Cloudflare和GitHub的集成任务。'
      } = options;

      const response = await this.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature,
      });

      const result = {
        content: response.choices[0].message.content,
        usage: response.usage,
        model: response.model,
        timestamp: new Date().toISOString()
      };

      console.log(`🤖 GPTs响应生成成功 (${result.usage.total_tokens} tokens)`);
      return result;
    } catch (error) {
      console.error('❌ GPTs查询失败:', error.message);
      throw error;
    }
  }

  /**
   * 生成代码
   */
  async generateCode(description, language = 'javascript', options = {}) {
    const prompt = `请根据以下描述生成${language}代码：

描述: ${description}

要求:
- 代码要完整且可运行
- 包含适当的注释
- 遵循最佳实践
- 处理错误情况

请只返回代码，不要包含其他解释。`;

    const response = await this.query(prompt, {
      ...options,
      temperature: 0.3 // 降低温度以获得更一致的代码
    });

    return {
      code: response.content,
      language,
      description,
      timestamp: response.timestamp
    };
  }

  /**
   * 分析代码
   */
  async analyzeCode(code, options = {}) {
    const prompt = `请分析以下代码：

\`\`\`${options.language || 'javascript'}
${code}
\`\`\`

请提供：
1. 代码功能说明
2. 潜在问题或改进建议
3. 性能优化建议
4. 安全性检查结果`;

    return await this.query(prompt, options);
  }

  /**
   * 生成文档
   */
  async generateDocumentation(code, options = {}) {
    const prompt = `请为以下代码生成详细的文档：

\`\`\`${options.language || 'javascript'}
${code}
\`\`\`

请包括：
1. 功能概述
2. 参数说明
3. 返回值说明
4. 使用示例
5. 注意事项`;

    return await this.query(prompt, options);
  }
}
