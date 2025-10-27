/**
 * GPTs-Cloudflare-GitHub 联动项目使用示例
 */

import GPTsCloudflareGitHub from '../src/index.js';

// 示例1: 基本使用
async function basicExample() {
  console.log('=== 基本使用示例 ===');
  
  const app = new GPTsCloudflareGitHub();
  
  try {
    // 启动服务
    await app.start();
    
    // 处理查询
    const result = await app.processQuery('请生成一个简单的Hello World Cloudflare Worker脚本');
    console.log('GPTs响应:', result.content);
    
  } catch (error) {
    console.error('示例执行失败:', error.message);
  }
}

// 示例2: 自动化工作流
async function automationWorkflowExample() {
  console.log('=== 自动化工作流示例 ===');
  
  const app = new GPTsCloudflareGitHub();
  
  try {
    await app.start();
    
    const workflowConfig = {
      trigger: 'manual',
      steps: [
        {
          name: '生成代码',
          type: 'gpts_query',
          prompt: '请生成一个处理HTTP请求的Cloudflare Worker脚本',
          options: { temperature: 0.3 }
        },
        {
          name: '部署到Cloudflare',
          type: 'cloudflare_deploy',
          options: {
            scriptName: 'example-worker',
            route: 'example.com/api/*'
          }
        },
        {
          name: '更新GitHub',
          type: 'github_update',
          options: {
            filePath: 'examples/worker-example.js',
            commitMessage: '添加Worker示例代码'
          }
        }
      ],
      onSuccess: (results) => {
        console.log('🎉 工作流执行成功!');
        console.log('结果:', results);
      },
      onError: (step, error) => {
        console.error(`❌ 步骤 ${step.name} 执行失败:`, error.message);
      }
    };
    
    await app.integrationManager.runAutomationWorkflow(workflowConfig);
    
  } catch (error) {
    console.error('自动化工作流执行失败:', error.message);
  }
}

// 示例3: 代码生成和分析
async function codeGenerationExample() {
  console.log('=== 代码生成和分析示例 ===');
  
  const app = new GPTsCloudflareGitHub();
  
  try {
    await app.start();
    
    // 生成代码
    const codeResult = await app.gptsClient.generateCode(
      '创建一个处理用户注册的API端点',
      'javascript'
    );
    
    console.log('生成的代码:', codeResult.code);
    
    // 分析代码
    const analysisResult = await app.gptsClient.analyzeCode(codeResult.code);
    console.log('代码分析:', analysisResult.content);
    
    // 生成文档
    const docResult = await app.gptsClient.generateDocumentation(codeResult.code);
    console.log('生成的文档:', docResult.content);
    
  } catch (error) {
    console.error('代码生成示例执行失败:', error.message);
  }
}

// 示例4: 服务状态检查
async function statusCheckExample() {
  console.log('=== 服务状态检查示例 ===');
  
  const app = new GPTsCloudflareGitHub();
  
  try {
    await app.start();
    
    // 获取服务状态
    const status = app.getStatus();
    console.log('服务状态:', status);
    
    // 获取集成状态
    const integrationStatus = app.integrationManager.getIntegrationStatus();
    console.log('集成状态:', integrationStatus);
    
  } catch (error) {
    console.error('状态检查示例执行失败:', error.message);
  }
}

// 运行示例
async function runExamples() {
  console.log('🚀 开始运行GPTs-Cloudflare-GitHub联动项目示例\n');
  
  try {
    await basicExample();
    console.log('\n');
    
    await codeGenerationExample();
    console.log('\n');
    
    await statusCheckExample();
    console.log('\n');
    
    // 注意: 自动化工作流示例需要有效的API密钥
    // await automationWorkflowExample();
    
    console.log('✅ 所有示例执行完成!');
  } catch (error) {
    console.error('❌ 示例执行失败:', error.message);
  }
}

// 如果直接运行此文件，则执行示例
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error);
}

export {
  basicExample,
  automationWorkflowExample,
  codeGenerationExample,
  statusCheckExample,
  runExamples
};
