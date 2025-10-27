# EdgeTTS 智能语音生成系统

## 🎉 重大更新 (2025-10-27)

### 🔧 **系统修复和优化**
- ✅ **修复TTS服务**: 解决MAX_CONCURRENT未定义错误
- ✅ **修复Web服务**: 解决TTS_SERVICE_URL未定义错误
- ✅ **Excel解析优化**: 修复emotion/voice字段访问问题
- ✅ **脚本格式化**: 优化TTS服务数据格式兼容性
- ✅ **端到端连接**: 全面修复所有连接问题

### 🎤 **语音模型增强**
- 🎭 **13个新语音模型**: 支持更多语音选择
- 🧠 **智能情绪映射**: 12种情绪自动识别
- 🎯 **动态语音选择**: 基于情绪和脚本的智能选择
- 📊 **批量处理**: 支持800+脚本同时处理

### ✨ **Codex智能UI界面**
- 🎨 **现代化设计**: Codex CLI设计的智能用户界面
- 📱 **响应式布局**: 支持桌面、平板、手机等多种设备
- 🌙 **明暗主题**: 支持主题切换
- ⚡ **功能完备**: 涵盖语音生成的所有核心功能

### 🚀 **Excel上传自动生成**
- 📁 **拖拽上传**: 支持拖拽Excel文件到上传区域
- 📋 **多格式支持**: `.xlsx`, `.xls`, `.csv`, `.tsv`, `.txt`
- 🎯 **智能解析**: 自动识别产品名称、脚本内容和字段映射
- ⚡ **自动生成**: 上传后自动开始语音生成
- 📈 **实时状态**: 显示上传→解析→生成→完成的完整流程

## 📋 简介

EdgeTTS 是一个简单易用的文本转语音工具，使用微软 Edge 浏览器的语音合成技术。

### ✨ 特性

- 🎤 高质量的语音合成
- 🌍 支持多种语言和声音
- ⚡ 快速、稳定
- 🖥️ 跨平台支持（Windows/macOS/Linux）
- 📦 一键安装，开箱即用
- 🔄 最新版本：EdgeTTS 7.2.3
- 🎯 A3标准支持：完全符合GPTs-A3文档规范
- 🎨 **智能UI**: Codex设计的现代化界面
- 📊 **Excel集成**: 支持Excel文件上传和自动生成

## 🚀 快速开始

### Windows 用户

1. 下载 `install.bat` 文件
2. 双击运行即可自动安装
3. 安装完成后，在命令行中输入 `edgetts` 使用

### macOS 用户

1. 下载 `install.sh` 文件
2. 打开终端，运行：
   ```bash
   chmod +x install.sh
   ./install.sh
   ```
3. 安装完成后，在终端中输入 `edgetts` 使用

## 💻 使用方法

### 🖥️ 图形界面 (GUI)

安装完成后，运行图形界面：

**Windows:**
```bash
python %USERPROFILE%\.edgetts\edge_tts_gui.py
```

**macOS/Linux:**
```bash
python ~/.edgetts/edge_tts_gui.py
```

或者在安装目录下：
```bash
python edge_tts_gui.py
```

**GUI 功能：**
- ✨ 友好的图形界面
- 📝 文本输入框
- 🎤 语音选择器
- 📁 输出文件夹选择
- 🎵 生成语音
- ▶️ 预览功能
- 📊 实时进度显示

### 📟 命令行使用

```bash
# 查看可用语音
edgetts --list-voices

# 生成语音
edgetts -t "你好，欢迎使用 EdgeTTS" -v zh-CN-XiaoxiaoNeural

# 保存为文件
edgetts -t "Hello World" -o output.mp3
```

### A3 标准语音生成

```bash
# 使用 A3 标准脚本
python a3_voice_generator.py \
  --product "Dark Spot Patch" \
  --scripts "Text 1" "Text 2" "Text 3" \
  --emotion Excited \
  --output outputs
```

### Python API

```python
import asyncio
import edge_tts

async def main():
    # 生成语音
    communicate = edge_tts.Communicate(text="你好世界", voice="zh-CN-XiaoxiaoNeural")
    await communicate.save("output.mp3")

if __name__ == "__main__":
    asyncio.run(main())
```

## 📦 包含内容

- Python 3.8+
- edge-tts 库
- 所需的依赖包
- 安装脚本
- **图形界面 (GUI)**
- **A3 标准脚本** (符合 GPTs-A3 规范)
- 命令行工具
- 配置文件和示例

## 🎯 A3 标准功能

安装包包含符合 **A3-TT-Live-AI 规范**的脚本：

### 支持的参数

- **emotion** (情感选择):
  - Calm (平静)
  - Friendly (友好)
  - Confident (自信)
  - Playful (活泼)
  - Excited (兴奋)
  - Urgent (紧急)

- **voice** (语音选择): 支持所有 Edge TTS 语音

- **批量处理**: 支持一次生成多个音频

- **配置文件**: 支持 JSON/YAML 配置文件

### 使用示例

```bash
# 使用配置文件
python a3_voice_generator.py -c a3_config_example.json

# 命令行参数
python a3_voice_generator.py \
  --product "Beauty Product" \
  --scripts "Script 1" "Script 2" \
  --emotion Excited \
  --voice en-US-JennyNeural
```

## 🔧 系统要求

### Windows
- Windows 10 或更高版本
- 至少 100MB 可用磁盘空间

### macOS
- macOS 10.14 或更高版本
- 至少 100MB 可用磁盘空间

## 🎯 支持的语言

- 中文（普通话、粤语等）
- 英语
- 日语
- 韩语
- 以及更多...

## 📝 许可证

本项目基于 MIT 许可证开源。

## 🙏 致谢

感谢 [edge-tts](https://github.com/rany2/edge-tts) 项目的贡献者。

---

**最后更新**: 2025-10-27
