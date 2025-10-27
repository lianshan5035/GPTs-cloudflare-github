/**
 * Cloudflare客户端 - 负责与Cloudflare API交互
 */

export class CloudflareClient {
  constructor(config) {
    this.token = config.token;
    this.accountId = config.accountId;
    this.zoneId = config.zoneId;
    this.isReady = false;
    this.apiUrl = 'https://api.cloudflare.com/client/v4';
  }

  /**
   * 初始化Cloudflare客户端
   */
  async initialize() {
    try {
      if (!this.token) {
        throw new Error('Cloudflare API令牌未配置');
      }

      // 测试连接
      await this.testConnection();
      
      this.isReady = true;
      console.log('✅ Cloudflare客户端初始化成功');
    } catch (error) {
      console.error('❌ Cloudflare客户端初始化失败:', error.message);
      throw error;
    }
  }

  /**
   * 测试API连接
   */
  async testConnection() {
    try {
      const response = await this.makeRequest('GET', '/user/tokens/verify');
      console.log('🔗 Cloudflare API连接测试成功');
      return response;
    } catch (error) {
      throw new Error(`Cloudflare API连接失败: ${error.message}`);
    }
  }

  /**
   * 发送HTTP请求到Cloudflare API
   */
  async makeRequest(method, endpoint, data = null) {
    const url = `${this.apiUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(`Cloudflare API错误: ${result.errors?.[0]?.message || response.statusText}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Cloudflare API请求失败:', error.message);
      throw error;
    }
  }

  /**
   * 部署Worker脚本
   */
  async deployWorker(scriptName, scriptContent, options = {}) {
    if (!this.isReady) {
      throw new Error('Cloudflare客户端未初始化');
    }

    try {
      const {
        route = null,
        environment = 'production',
        vars = {},
        secrets = {}
      } = options;

      // 创建或更新Worker
      const workerData = {
        script: scriptContent,
        bindings: {
          vars,
          secrets
        }
      };

      let response;
      try {
        // 尝试更新现有Worker
        response = await this.makeRequest('PUT', `/accounts/${this.accountId}/workers/scripts/${scriptName}`, workerData);
        console.log(`🔄 Worker ${scriptName} 更新成功`);
      } catch (error) {
        // 如果Worker不存在，创建新的
        response = await this.makeRequest('PUT', `/accounts/${this.accountId}/workers/scripts/${scriptName}`, workerData);
        console.log(`🆕 Worker ${scriptName} 创建成功`);
      }

      // 如果指定了路由，发布到该路由
      if (route) {
        await this.publishWorker(scriptName, route);
      }

      return {
        scriptName,
        success: true,
        timestamp: new Date().toISOString(),
        response
      };
    } catch (error) {
      console.error('❌ Worker部署失败:', error.message);
      throw error;
    }
  }

  /**
   * 发布Worker到路由
   */
  async publishWorker(scriptName, route) {
    try {
      const routeData = {
        pattern: route,
        script: scriptName
      };

      await this.makeRequest('POST', `/zones/${this.zoneId}/workers/routes`, routeData);
      console.log(`🚀 Worker ${scriptName} 发布到路由 ${route} 成功`);
    } catch (error) {
      console.error('❌ Worker发布失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取Worker列表
   */
  async getWorkers() {
    try {
      const response = await this.makeRequest('GET', `/accounts/${this.accountId}/workers/scripts`);
      return response.result;
    } catch (error) {
      console.error('❌ 获取Worker列表失败:', error.message);
      throw error;
    }
  }

  /**
   * 删除Worker
   */
  async deleteWorker(scriptName) {
    try {
      await this.makeRequest('DELETE', `/accounts/${this.accountId}/workers/scripts/${scriptName}`);
      console.log(`🗑️ Worker ${scriptName} 删除成功`);
      return true;
    } catch (error) {
      console.error('❌ Worker删除失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取KV存储
   */
  async getKVNamespace(namespaceId) {
    try {
      const response = await this.makeRequest('GET', `/accounts/${this.accountId}/storage/kv/namespaces/${namespaceId}`);
      return response.result;
    } catch (error) {
      console.error('❌ 获取KV存储失败:', error.message);
      throw error;
    }
  }

  /**
   * 设置KV值
   */
  async setKVValue(namespaceId, key, value) {
    try {
      await this.makeRequest('PUT', `/accounts/${this.accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`, value);
      console.log(`💾 KV值设置成功: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ KV值设置失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取KV值
   */
  async getKVValue(namespaceId, key) {
    try {
      const response = await this.makeRequest('GET', `/accounts/${this.accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`);
      return response;
    } catch (error) {
      console.error('❌ KV值获取失败:', error.message);
      throw error;
    }
  }
}
