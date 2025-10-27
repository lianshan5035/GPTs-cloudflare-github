/**
 * TTS集成示例 - 展示如何在GPTs-Cloudflare-GitHub项目中使用TTS服务
 */

import GPTsCloudflareGitHub from '../src/index.js';

// 示例1: 基本TTS功能
async function basicTTSExample() {
  console.log('=== 基本TTS功能示例 ===');
  
  const app = new GPTsCloudflareGitHub();
  
  try {
    // 启动服务
    await app.start();
    
    // 生成语音
    const result = await app.generateSpeech('你好，这是GPTs-Cloudflare-GitHub联动项目的TTS测试');
    console.log('TTS生成结果:', result);
    
  } catch (error) {
    console.error('TTS示例执行失败:', error.message);
  }
}

// 示例2: 批量TTS生成
async function batchTTSExample() {
  console.log('=== 批量TTS生成示例 ===');
  
  const app = new GPTsCloudflareGitHub();
  
  try {
    await app.start();
    
    const texts = [
      '欢迎使用GPTs-Cloudflare-GitHub联动项目',
      '这是一个强大的AI集成平台',
      '支持代码生成、语音合成和云部署'
    ];
    
    const results = await app.generateBatchSpeech(texts, {
      voice: 'zh-CN-XiaoxiaoNeural',
      rate: '0%',
      pitch: '0%'
    });
    
    console.log('批量TTS生成完成:', results.length, '个文件');
    
  } catch (error) {
    console.error('批量TTS示例执行失败:', error.message);
  }
}

// 示例3: TTS服务状态检查
async function ttsStatusExample() {
  console.log('=== TTS服务状态检查示例 ===');
  
  const app = new GPTsCloudflareGitHub();
  
  try {
    await app.start();
    
    // 获取TTS服务状态
    const ttsStatus = await app.getTTSStatus();
    console.log('TTS服务状态:', ttsStatus);
    
    // 获取整体服务状态
    const overallStatus = app.getStatus();
    console.log('整体服务状态:', overallStatus);
    
  } catch (error) {
    console.error('TTS状态检查示例执行失败:', error.message);
  }
}

// 示例4: GPTs + TTS 联动
async function gptsTTSIntegrationExample() {
  console.log('=== GPTs + TTS 联动示例 ===');
  
  const app = new GPTsCloudflareGitHub();
  
  try {
    await app.start();
    
    // 使用GPTs生成内容
    const gptsResult = await app.gptsClient.query('请生成一段关于AI技术的介绍文字');
    console.log('GPTs生成内容:', gptsResult.content);
    
    // 将生成的内容转换为语音
    const ttsResult = await app.generateSpeech(gptsResult.content, {
      voice: 'zh-CN-XiaoxiaoNeural',
      rate: '0%'
    });
    
    console.log('TTS转换完成:', ttsResult);
    
    // 可选：同步到GitHub
    await app.updateGitHubRepo({
      generateContent: false,
      content: `# AI技术介绍\n\n${gptsResult.content}\n\n## 语音文件\n\nTTS文件已生成: ${ttsResult.filename || 'audio.wav'}`,
      filePath: 'examples/ai-introduction.md',
      commitMessage: '添加AI技术介绍和TTS语音'
    });
    
    console.log('🎉 GPTs + TTS + GitHub 联动完成！');
    
  } catch (error) {
    console.error('GPTs + TTS 联动示例执行失败:', error.message);
  }
}

// 运行示例
async function runTTSExamples() {
  console.log('🚀 开始运行TTS集成示例\n');
  
  try {
    await ttsStatusExample();
    console.log('\n');
    
    await basicTTSExample();
    console.log('\n');
    
    await batchTTSExample();
    console.log('\n');
    
    // 注意: GPTs + TTS 联动示例需要有效的API密钥
    // await gptsTTSIntegrationExample();
    
    console.log('✅ 所有TTS示例执行完成!');
  } catch (error) {
    console.error('❌ TTS示例执行失败:', error.message);
  }
}

// 如果直接运行此文件，则执行示例
if (import.meta.url === `file://${process.argv[1]}`) {
  runTTSExamples().catch(console.error);
}

export {
  basicTTSExample,
  batchTTSExample,
  ttsStatusExample,
  gptsTTSIntegrationExample,
  runTTSExamples
};
