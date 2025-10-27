/**
 * GitHub客户端 - 负责与GitHub API交互
 */

export class GitHubClient {
  constructor(config) {
    this.token = config.token;
    this.repo = config.repo;
    this.owner = config.owner || this.repo?.split('/')[0];
    this.isReady = false;
    this.octokit = null;
  }

  /**
   * 初始化GitHub客户端
   */
  async initialize() {
    try {
      if (!this.token) {
        throw new Error('GitHub API令牌未配置');
      }

      if (!this.repo) {
        throw new Error('GitHub仓库未配置');
      }

      // 动态导入Octokit
      const { Octokit } = await import('octokit');
      this.octokit = new Octokit({
        auth: this.token,
      });

      // 测试连接
      await this.testConnection();
      
      this.isReady = true;
      console.log('✅ GitHub客户端初始化成功');
    } catch (error) {
      console.error('❌ GitHub客户端初始化失败:', error.message);
      throw error;
    }
  }

  /**
   * 测试API连接
   */
  async testConnection() {
    try {
      const response = await this.octokit.rest.users.getAuthenticated();
      console.log('🔗 GitHub API连接测试成功');
      return response;
    } catch (error) {
      throw new Error(`GitHub API连接失败: ${error.message}`);
    }
  }

  /**
   * 创建或更新文件
   */
  async createOrUpdateFile(path, content, message, options = {}) {
    if (!this.isReady) {
      throw new Error('GitHub客户端未初始化');
    }

    try {
      const {
        branch = 'main',
        sha = null
      } = options;

      // 检查文件是否存在
      let fileSha = sha;
      if (!fileSha) {
        try {
          const existingFile = await this.octokit.rest.repos.getContent({
            owner: this.owner,
            repo: this.repo.split('/')[1],
            path,
            ref: branch
          });
          fileSha = existingFile.data.sha;
        } catch (error) {
          // 文件不存在，fileSha保持为null
        }
      }

      const response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo.split('/')[1],
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        sha: fileSha,
        branch
      });

      console.log(`📝 文件 ${path} ${fileSha ? '更新' : '创建'}成功`);
      return response.data;
    } catch (error) {
      console.error('❌ 文件操作失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取文件内容
   */
  async getFile(path, branch = 'main') {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo.split('/')[1],
        path,
        ref: branch
      });

      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return {
        content,
        sha: response.data.sha,
        path: response.data.path,
        size: response.data.size
      };
    } catch (error) {
      console.error('❌ 获取文件失败:', error.message);
      throw error;
    }
  }

  /**
   * 删除文件
   */
  async deleteFile(path, message, branch = 'main') {
    try {
      // 先获取文件的SHA
      const file = await this.getFile(path, branch);
      
      const response = await this.octokit.rest.repos.deleteFile({
        owner: this.owner,
        repo: this.repo.split('/')[1],
        path,
        message,
        sha: file.sha,
        branch
      });

      console.log(`🗑️ 文件 ${path} 删除成功`);
      return response.data;
    } catch (error) {
      console.error('❌ 文件删除失败:', error.message);
      throw error;
    }
  }

  /**
   * 创建Pull Request
   */
  async createPullRequest(title, body, headBranch, baseBranch = 'main') {
    try {
      const response = await this.octokit.rest.pulls.create({
        owner: this.owner,
        repo: this.repo.split('/')[1],
        title,
        body,
        head: headBranch,
        base: baseBranch
      });

      console.log(`🔄 Pull Request创建成功: ${response.data.html_url}`);
      return response.data;
    } catch (error) {
      console.error('❌ Pull Request创建失败:', error.message);
      throw error;
    }
  }

  /**
   * 创建Issue
   */
  async createIssue(title, body, labels = []) {
    try {
      const response = await this.octokit.rest.issues.create({
        owner: this.owner,
        repo: this.repo.split('/')[1],
        title,
        body,
        labels
      });

      console.log(`📋 Issue创建成功: ${response.data.html_url}`);
      return response.data;
    } catch (error) {
      console.error('❌ Issue创建失败:', error.message);
      throw error;
    }
  }

  /**
   * 创建Release
   */
  async createRelease(tagName, name, body, prerelease = false) {
    try {
      const response = await this.octokit.rest.repos.createRelease({
        owner: this.owner,
        repo: this.repo.split('/')[1],
        tag_name: tagName,
        name,
        body,
        prerelease
      });

      console.log(`🚀 Release创建成功: ${response.data.html_url}`);
      return response.data;
    } catch (error) {
      console.error('❌ Release创建失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取仓库信息
   */
  async getRepository() {
    try {
      const response = await this.octokit.rest.repos.get({
        owner: this.owner,
        repo: this.repo.split('/')[1]
      });

      return response.data;
    } catch (error) {
      console.error('❌ 获取仓库信息失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取分支列表
   */
  async getBranches() {
    try {
      const response = await this.octokit.rest.repos.listBranches({
        owner: this.owner,
        repo: this.repo.split('/')[1]
      });

      return response.data;
    } catch (error) {
      console.error('❌ 获取分支列表失败:', error.message);
      throw error;
    }
  }

  /**
   * 创建分支
   */
  async createBranch(branchName, fromBranch = 'main') {
    try {
      // 获取源分支的SHA
      const sourceBranch = await this.octokit.rest.repos.getBranch({
        owner: this.owner,
        repo: this.repo.split('/')[1],
        branch: fromBranch
      });

      const response = await this.octokit.rest.git.createRef({
        owner: this.owner,
        repo: this.repo.split('/')[1],
        ref: `refs/heads/${branchName}`,
        sha: sourceBranch.data.commit.sha
      });

      console.log(`🌿 分支 ${branchName} 创建成功`);
      return response.data;
    } catch (error) {
      console.error('❌ 分支创建失败:', error.message);
      throw error;
    }
  }
}
