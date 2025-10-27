# EdgeTTS 安装指南

## 📦 快速安装

### Windows 用户

1. 下载 `install.bat`
2. 双击运行
3. 按照提示完成安装

### macOS/Linux 用户

```bash
# 下载安装脚本
chmod +x install.sh
./install.sh
```

## 🔧 系统要求

- Python 3.8 或更高版本
- Windows 10+ / macOS 10.14+ / Linux
- 至少 100MB 磁盘空间
- 互联网连接（首次安装）

## 📁 安装目录

- Windows: `C:\Users\<用户名>\.edgetts`
- macOS/Linux: `~/.edgetts`

## 💻 使用方法

### 命令行使用

```bash
# Windows
%USERPROFILE%\.edgetts\edgetts.bat --help

# macOS/Linux
edgetts --help

# 生成语音
edgetts -t "你好世界" -v zh-CN-XiaoxiaoNeural -o output.mp3
```

### Python API

```python
import asyncio
import edge_tts

async def main():
    communicate = edge_tts.Communicate(
        text="Hello World",
        voice="en-US-JennyNeural"
    )
    await communicate.save("output.mp3")

asyncio.run(main())
```

## 🎯 常用命令

```bash
# 查看所有可用语音
edgetts --list-voices

# 生成语音
edgetts -t "文本内容" -v zh-CN-XiaoxiaoNeural -o output.mp3

# 查看帮助
edgetts --help
```

## 🔍 故障排查

### 问题1: 找不到 Python

**解决方案**:
- Windows: 从 https://www.python.org/downloads/ 下载安装
- macOS: 安装 Xcode Command Line Tools: `xcode-select --install`
- Linux: 使用包管理器安装: `sudo apt install python3`

### 问题2: 网络连接失败

**解决方案**:
- 检查防火墙设置
- 使用代理: `pip install --proxy http://proxy:port edge-tts`

### 问题3: 导入错误

**解决方案**:
```bash
# 重新激活虚拟环境
source ~/.edgetts/venv/bin/activate  # macOS/Linux
%USERPROFILE%\.edgetts\venv\Scripts\activate.bat  # Windows

# 重新安装
pip install --upgrade edge-tts
```

## 📞 获取帮助

- GitHub: https://github.com/rany2/edge-tts
- 文档: https://github.com/rany2/edge-tts/blob/master/README.md

