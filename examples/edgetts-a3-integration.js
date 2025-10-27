/**
 * EdgeTTS A3标准集成示例
 */

import GPTsCloudflareGitHub from '../src/index.js';

// 示例1: A3标准语音生成
async function a3SpeechExample() {
  console.log('=== A3标准语音生成示例 ===');
  
  const app = new GPTsCloudflareGitHub();
  
  try {
    await app.start();
    
    // 获取A3情绪配置
    const emotions = app.getA3EmotionConfig();
    console.log('A3情绪配置:', Object.keys(emotions));
    
    // 使用不同情绪生成语音
    const emotions_to_test = ['Excited', 'Confident', 'Friendly', 'Calm'];
    
    for (const emotion of emotions_to_test) {
      const result = await app.generateA3Speech(
        `这是${emotion}情绪的语音测试`,
        emotion
      );
      console.log(`${emotion}语音生成结果:`, result);
    }
    
  } catch (error) {
    console.error('A3语音生成示例执行失败:', error.message);
  }
}

// 示例2: Excel文件批量处理
async function excelBatchExample() {
  console.log('=== Excel文件批量处理示例 ===');
  
  const app = new GPTsCloudflareGitHub();
  
  try {
    await app.start();
    
    // 模拟Excel文件内容
    const mockExcelData = [
      '欢迎使用我们的新产品',
      '这是一个革命性的创新',
      '立即购买享受优惠价格',
      '感谢您的信任和支持'
    ];
    
    // 批量生成不同情绪的语音
    const emotions = ['Excited', 'Confident', 'Friendly', 'Grateful'];
    
    for (let i = 0; i < mockExcelData.length; i++) {
      const text = mockExcelData[i];
      const emotion = emotions[i % emotions.length];
      
      const result = await app.generateA3Speech(text, emotion);
      console.log(`批量生成 ${i + 1}: ${emotion} - ${text}`);
    }
    
  } catch (error) {
    console.error('Excel批量处理示例执行失败:', error.message);
  }
}

// 示例3: GPTs + EdgeTTS 完整联动
async function gptsEdgettsIntegrationExample() {
  console.log('=== GPTs + EdgeTTS 完整联动示例 ===');
  
  const app = new GPTsCloudflareGitHub();
  
  try {
    await app.start();
    
    // 1. 使用GPTs生成产品介绍
    const productIntro = await app.gptsClient.query(
      '请生成一段关于智能音箱的产品介绍，包含产品特点和优势'
    );
    console.log('GPTs生成的产品介绍:', productIntro.content);
    
    // 2. 使用A3标准转换为不同情绪的语音
    const emotions = ['Excited', 'Confident', 'Friendly'];
    const speechResults = [];
    
    for (const emotion of emotions) {
      const speech = await app.generateA3Speech(
        productIntro.content,
        emotion
      );
      speechResults.push({ emotion, speech });
      console.log(`${emotion}语音生成完成`);
    }
    
    // 3. 同步到GitHub
    const markdownContent = `# 智能音箱产品介绍

## 产品介绍
${productIntro.content}

## 语音文件
${speechResults.map(s => `- ${s.emotion}情绪: ${s.speech.filename || 'audio.wav'}`).join('\n')}

## 生成时间
${new Date().toISOString()}
`;

    await app.updateGitHubRepo({
      generateContent: false,
      content: markdownContent,
      filePath: 'examples/smart-speaker-intro.md',
      commitMessage: '添加智能音箱产品介绍和A3语音文件'
    });
    
    console.log('🎉 GPTs + EdgeTTS + GitHub 完整联动完成！');
    
  } catch (error) {
    console.error('GPTs + EdgeTTS 联动示例执行失败:', error.message);
  }
}

// 示例4: 端到端测试
async function endToEndTestExample() {
  console.log('=== 端到端测试示例 ===');
  
  const app = new GPTsCloudflareGitHub();
  
  try {
    await app.start();
    
    // 运行端到端测试
    const testResult = await app.endToEndTest();
    
    if (testResult.success) {
      console.log('✅ 端到端测试通过！');
      console.log('测试结果:', testResult);
    } else {
      console.log('❌ 端到端测试失败');
      console.log('错误信息:', testResult.error);
    }
    
  } catch (error) {
    console.error('端到端测试示例执行失败:', error.message);
  }
}

// 示例5: 服务状态检查
async function serviceStatusExample() {
  console.log('=== 服务状态检查示例 ===');
  
  const app = new GPTsCloudflareGitHub();
  
  try {
    await app.start();
    
    // 获取整体服务状态
    const overallStatus = app.getStatus();
    console.log('整体服务状态:', overallStatus);
    
    // 获取TTS服务状态
    const ttsStatus = await app.getTTSStatus();
    console.log('TTS服务状态:', ttsStatus);
    
    // 获取A3情绪配置
    const emotionConfig = app.getA3EmotionConfig();
    console.log('A3情绪配置:', emotionConfig);
    
  } catch (error) {
    console.error('服务状态检查示例执行失败:', error.message);
  }
}

// 运行所有示例
async function runEdgeTTSExamples() {
  console.log('🚀 开始运行EdgeTTS A3标准集成示例\n');
  
  try {
    await serviceStatusExample();
    console.log('\n');
    
    await a3SpeechExample();
    console.log('\n');
    
    await excelBatchExample();
    console.log('\n');
    
    await endToEndTestExample();
    console.log('\n');
    
    // 注意: GPTs + EdgeTTS 联动示例需要有效的API密钥
    // await gptsEdgettsIntegrationExample();
    
    console.log('✅ 所有EdgeTTS示例执行完成!');
  } catch (error) {
    console.error('❌ EdgeTTS示例执行失败:', error.message);
  }
}

// 如果直接运行此文件，则执行示例
if (import.meta.url === `file://${process.argv[1]}`) {
  runEdgeTTSExamples().catch(console.error);
}

export {
  a3SpeechExample,
  excelBatchExample,
  gptsEdgettsIntegrationExample,
  endToEndTestExample,
  serviceStatusExample,
  runEdgeTTSExamples
};
