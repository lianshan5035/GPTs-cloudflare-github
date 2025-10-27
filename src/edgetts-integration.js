/**
 * EdgeTTS集成模块 - 集成A3标准语音生成系统
 */

export class EdgeTTSIntegration {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://127.0.0.1:8000';
    this.ttsUrl = config.ttsUrl || 'http://127.0.0.1:5001';
    this.externalUrl = config.externalUrl || 'https://ai.maraecowell.com';
    this.isReady = false;
    
    // A3标准12种情绪参数配置
    this.emotionConfig = {
      "Excited": {"rate": +15, "pitch": +12, "volume": +15, "style": "cheerful", "products": "新品/促销"},
      "Confident": {"rate": +8, "pitch": +5, "volume": +8, "style": "assertive", "products": "高端/科技"},
      "Empathetic": {"rate": -12, "pitch": -8, "volume": -10, "style": "friendly", "products": "护肤/健康"},
      "Calm": {"rate": -10, "pitch": -3, "volume": 0, "style": "soothing", "products": "家居/教育"},
      "Playful": {"rate": +18, "pitch": +15, "volume": +5, "style": "friendly", "products": "美妆/时尚"},
      "Urgent": {"rate": +22, "pitch": +8, "volume": +18, "style": "serious", "products": "限时/秒杀"},
      "Authoritative": {"rate": +5, "pitch": +3, "volume": +10, "style": "serious", "products": "投资/专业"},
      "Friendly": {"rate": +12, "pitch": +8, "volume": +5, "style": "friendly", "products": "日用/社群"},
      "Inspirational": {"rate": +10, "pitch": +10, "volume": +12, "style": "cheerful", "products": "自提升/健身"},
      "Serious": {"rate": 0, "pitch": 0, "volume": +5, "style": "serious", "products": "金融/公告"},
      "Mysterious": {"rate": -8, "pitch": +5, "volume": -5, "style": "serious", "products": "预告/悬念"},
      "Grateful": {"rate": +5, "pitch": +8, "volume": +8, "style": "friendly", "products": "感谢/复购"}
    };
  }

  /**
   * 初始化EdgeTTS集成
   */
  async initialize() {
    try {
      console.log('🎵 初始化EdgeTTS集成...');
      
      // 测试本地服务连接
      await this.testLocalConnection();
      
      // 测试外部访问
      await this.testExternalConnection();
      
      this.isReady = true;
      console.log('✅ EdgeTTS集成初始化成功');
    } catch (error) {
      console.error('❌ EdgeTTS集成初始化失败:', error.message);
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
      console.log('🔗 本地EdgeTTS服务连接测试成功');
      return response;
    } catch (error) {
      throw new Error(`本地EdgeTTS服务连接失败: ${error.message}`);
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
      console.log('🌐 外部EdgeTTS服务连接测试成功');
      return response;
    } catch (error) {
      console.warn('⚠️ 外部访问不可用，使用本地服务');
      return null;
    }
  }

  /**
   * 使用A3标准生成语音
   */
  async generateA3Speech(text, emotion = 'Friendly', options = {}) {
    if (!this.isReady) {
      throw new Error('EdgeTTS集成未初始化');
    }

    try {
      const emotionParams = this.emotionConfig[emotion] || this.emotionConfig['Friendly'];
      
      const requestData = {
        text,
        voice: options.voice || 'zh-CN-XiaoxiaoNeural',
        emotion,
        rate: emotionParams.rate + (options.rateOffset || 0),
        pitch: emotionParams.pitch + (options.pitchOffset || 0),
        volume: emotionParams.volume + (options.volumeOffset || 0),
        style: emotionParams.style,
        products: emotionParams.products,
        ...options
      };

      const response = await fetch(`${this.ttsUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`A3语音生成失败: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`🎵 A3语音生成成功: ${emotion} - ${text.substring(0, 50)}...`);
      return result;
    } catch (error) {
      console.error('❌ A3语音生成失败:', error.message);
      throw error;
    }
  }

  /**
   * 批量A3语音生成
   */
  async generateBatchA3Speech(texts, emotion = 'Friendly', options = {}) {
    try {
      const results = [];
      
      for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        const result = await this.generateA3Speech(text, emotion, {
          ...options,
          batchIndex: i,
          totalCount: texts.length
        });
        results.push(result);
        
        // 添加延迟避免过载
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`🎵 A3批量语音生成完成: ${texts.length} 个文件`);
      return results;
    } catch (error) {
      console.error('❌ A3批量语音生成失败:', error.message);
      throw error;
    }
  }

  /**
   * Excel文件上传和自动生成
   */
  async uploadExcelAndGenerate(file, emotion = 'Friendly', options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('emotion', emotion);
      formData.append('autoGenerate', 'true');
      
      // 添加选项
      Object.keys(options).forEach(key => {
        formData.append(key, options[key]);
      });

      const response = await fetch(`${this.baseUrl}/api/upload-excel`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Excel上传失败: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📁 Excel文件上传和自动生成成功');
      return result;
    } catch (error) {
      console.error('❌ Excel上传和生成失败:', error.message);
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
   * 获取A3情绪配置
   */
  getA3EmotionConfig() {
    return this.emotionConfig;
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
        a3Emotions: Object.keys(this.emotionConfig),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ 获取服务状态失败:', error.message);
      throw error;
    }
  }

  /**
   * 端到端测试
   */
  async endToEndTest() {
    console.log('🧪 开始EdgeTTS端到端测试...');
    
    try {
      // 1. 测试服务连接
      console.log('1️⃣ 测试服务连接...');
      await this.testLocalConnection();
      
      // 2. 测试语音生成
      console.log('2️⃣ 测试A3语音生成...');
      const testResult = await this.generateA3Speech(
        '这是EdgeTTS A3标准语音生成测试', 
        'Friendly'
      );
      
      // 3. 测试批量生成
      console.log('3️⃣ 测试批量语音生成...');
      const batchResult = await this.generateBatchA3Speech([
        '测试文本1',
        '测试文本2'
      ], 'Confident');
      
      // 4. 获取服务状态
      console.log('4️⃣ 获取服务状态...');
      const status = await this.getServiceStatus();
      
      console.log('✅ EdgeTTS端到端测试完成！');
      return {
        success: true,
        testResult,
        batchResult,
        status,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ EdgeTTS端到端测试失败:', error.message);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}
