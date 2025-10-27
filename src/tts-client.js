/**
 * TTS服务客户端 - 集成到GPTs-Cloudflare-GitHub项目
 */

export class TTSClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://127.0.0.1:8000';
    this.ttsUrl = config.ttsUrl || 'http://127.0.0.1:5001';
    this.externalUrl = config.externalUrl || 'https://ai.maraecowell.com';
    this.isReady = false;
  }

  /**
   * 初始化TTS客户端
   */
  async initialize() {
    try {
      // 测试本地服务连接
      await this.testLocalConnection();
      
      // 测试外部访问
      await this.testExternalConnection();
      
      this.isReady = true;
      console.log('✅ TTS客户端初始化成功');
    } catch (error) {
      console.error('❌ TTS客户端初始化失败:', error.message);
      throw error;
    }
  }

  /**
   * 测试本地服务连接
   */
  async testLocalConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/api/status`);
      if (!response.ok) {
        throw new Error(`本地服务连接失败: ${response.statusText}`);
      }
      console.log('🔗 本地TTS服务连接测试成功');
      return response;
    } catch (error) {
      throw new Error(`本地TTS服务连接失败: ${error.message}`);
    }
  }

  /**
   * 测试外部访问连接
   */
  async testExternalConnection() {
    try {
      const response = await fetch(`${this.externalUrl}/api/status`);
      if (!response.ok) {
        throw new Error(`外部访问连接失败: ${response.statusText}`);
      }
      console.log('🌐 外部TTS服务连接测试成功');
      return response;
    } catch (error) {
      console.warn('⚠️ 外部访问不可用，使用本地服务');
      return null;
    }
  }

  /**
   * 生成语音
   */
  async generateSpeech(text, options = {}) {
    if (!this.isReady) {
      throw new Error('TTS客户端未初始化');
    }

    try {
      const {
        voice = 'zh-CN-XiaoxiaoNeural',
        rate = '0%',
        pitch = '0%',
        volume = '100%'
      } = options;

      const requestData = {
        text,
        voice,
        rate,
        pitch,
        volume
      };

      const response = await fetch(`${this.ttsUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`语音生成失败: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`🎵 语音生成成功: ${text.substring(0, 50)}...`);
      return result;
    } catch (error) {
      console.error('❌ 语音生成失败:', error.message);
      throw error;
    }
  }

  /**
   * 批量生成语音
   */
  async generateBatchSpeech(texts, options = {}) {
    try {
      const results = [];
      
      for (const text of texts) {
        const result = await this.generateSpeech(text, options);
        results.push(result);
        
        // 添加延迟避免过载
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`🎵 批量语音生成完成: ${texts.length} 个文件`);
      return results;
    } catch (error) {
      console.error('❌ 批量语音生成失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取可用语音列表
   */
  async getAvailableVoices() {
    try {
      const response = await fetch(`${this.ttsUrl}/voices`);
      if (!response.ok) {
        throw new Error(`获取语音列表失败: ${response.statusText}`);
      }

      const voices = await response.json();
      console.log(`🎤 获取到 ${voices.length} 个可用语音`);
      return voices;
    } catch (error) {
      console.error('❌ 获取语音列表失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取服务状态
   */
  async getServiceStatus() {
    try {
      const [webStatus, ttsStatus] = await Promise.all([
        fetch(`${this.baseUrl}/api/status`).then(r => r.json()),
        fetch(`${this.ttsUrl}/health`).then(r => r.json())
      ]);

      return {
        web: webStatus,
        tts: ttsStatus,
        external: this.externalUrl,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ 获取服务状态失败:', error.message);
      throw error;
    }
  }

  /**
   * 上传Excel文件进行批量处理
   */
  async uploadExcelFile(file, options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // 添加选项
      Object.keys(options).forEach(key => {
        formData.append(key, options[key]);
      });

      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`文件上传失败: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📁 Excel文件上传成功');
      return result;
    } catch (error) {
      console.error('❌ 文件上传失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取处理进度
   */
  async getProcessingProgress(taskId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/progress/${taskId}`);
      if (!response.ok) {
        throw new Error(`获取进度失败: ${response.statusText}`);
      }

      const progress = await response.json();
      return progress;
    } catch (error) {
      console.error('❌ 获取处理进度失败:', error.message);
      throw error;
    }
  }
}
