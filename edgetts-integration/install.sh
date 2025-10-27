#!/bin/bash
# EdgeTTS 一键安装脚本 (macOS/Linux)

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 脚本信息
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_DIR="$HOME/.edgetts"
PYTHON_VERSION="3.8"
EDGETTS_VERSION="7.2.3"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}     EdgeTTS 一键安装脚本${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 检查 Python 是否安装
check_python() {
    echo -e "${YELLOW}[1/5] 检查 Python 环境...${NC}"
    
    if command -v python3 &> /dev/null; then
        PYTHON_CMD=python3
        PYTHON_VERSION=$(python3 --version | awk '{print $2}')
        echo -e "${GREEN}✅ 找到 Python: $PYTHON_VERSION${NC}"
    elif command -v python &> /dev/null; then
        PYTHON_CMD=python
        PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}')
        echo -e "${GREEN}✅ 找到 Python: $PYTHON_VERSION${NC}"
    else
        echo -e "${RED}❌ 未找到 Python${NC}"
        echo -e "${YELLOW}请安装 Python 3.8 或更高版本${NC}"
        exit 1
    fi
    
    # 检查 Python 版本
    PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d. -f1)
    PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d. -f2)
    
    if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 8 ]); then
        echo -e "${RED}❌ Python 版本过低，需要 3.8 或更高版本${NC}"
        exit 1
    fi
}

# 检查 pip 是否安装
check_pip() {
    echo -e "${YELLOW}[2/5] 检查 pip 环境...${NC}"
    
    if command -v pip3 &> /dev/null; then
        PIP_CMD=pip3
    elif command -v pip &> /dev/null; then
        PIP_CMD=pip
    else
        echo -e "${RED}❌ 未找到 pip${NC}"
        echo -e "${YELLOW}正在尝试安装 pip...${NC}"
        $PYTHON_CMD -m ensurepip --upgrade
        PIP_CMD=$PYTHON_CMD -m pip
    fi
    
    echo -e "${GREEN}✅ pip 已就绪${NC}"
}

# 创建虚拟环境
create_venv() {
    echo -e "${YELLOW}[3/5] 创建虚拟环境...${NC}"
    
    mkdir -p "$INSTALL_DIR"
    
    if [ -d "$INSTALL_DIR/venv" ]; then
        echo -e "${YELLOW}⚠️  虚拟环境已存在，跳过创建${NC}"
    else
        $PYTHON_CMD -m venv "$INSTALL_DIR/venv"
        echo -e "${GREEN}✅ 虚拟环境创建成功${NC}"
    fi
}

# 安装依赖
install_dependencies() {
    echo -e "${YELLOW}[4/5] 安装 EdgeTTS 及依赖...${NC}"
    
    source "$INSTALL_DIR/venv/bin/activate"
    
    # 升级 pip
    pip install --upgrade pip --quiet
    
    # 安装 edge-tts
    pip install "edge-tts>=${EDGETTS_VERSION}" --quiet
    
    echo -e "${GREEN}✅ EdgeTTS ${EDGETTS_VERSION} 安装完成${NC}"
}

# 创建启动脚本
create_launcher() {
    echo -e "${YELLOW}[5/5] 创建启动脚本...${NC}"
    
    # 创建启动脚本
    cat > "$INSTALL_DIR/edgetts" << 'EOF'
#!/bin/bash
source "$HOME/.edgetts/venv/bin/activate"
python -m edge_tts "$@"
EOF
    
    chmod +x "$INSTALL_DIR/edgetts"
    
    # 添加到 PATH
    SHELL_RC=""
    if [ -f "$HOME/.zshrc" ]; then
        SHELL_RC="$HOME/.zshrc"
    elif [ -f "$HOME/.bashrc" ]; then
        SHELL_RC="$HOME/.bashrc"
    elif [ -f "$HOME/.bash_profile" ]; then
        SHELL_RC="$HOME/.bash_profile"
    fi
    
    if [ -n "$SHELL_RC" ]; then
        if ! grep -q ".edgetts/edgetts" "$SHELL_RC"; then
            echo "" >> "$SHELL_RC"
            echo "# EdgeTTS" >> "$SHELL_RC"
            echo 'export PATH="$HOME/.edgetts:$PATH"' >> "$SHELL_RC"
            echo -e "${GREEN}✅ 已添加到 PATH${NC}"
        else
            echo -e "${YELLOW}⚠️  PATH 已存在，跳过${NC}"
        fi
    fi
}

# 测试安装
test_installation() {
    echo ""
    echo -e "${YELLOW}正在测试安装...${NC}"
    
    source "$INSTALL_DIR/venv/bin/activate"
    
    if command -v edge-tts &> /dev/null; then
        echo -e "${GREEN}✅ EdgeTTS 安装成功！${NC}"
        echo ""
        edge-tts --version
    else
        echo -e "${RED}❌ 安装失败${NC}"
        exit 1
    fi
}

# 主函数
main() {
    check_python
    check_pip
    create_venv
    install_dependencies
    create_launcher
    test_installation
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ EdgeTTS 安装完成！${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "📋 使用说明："
    echo -e "   1. 重新打开终端或运行: ${BLUE}source ~/.zshrc${NC}"
    echo -e "   2. 使用命令: ${BLUE}edgetts --help${NC}"
    echo -e "   3. 查看语音列表: ${BLUE}edgetts --list-voices${NC}"
    echo ""
    echo -e "🎯 快速开始："
    echo -e "   ${BLUE}edgetts -t \"Hello World\" -v en-US-JennyNeural -o output.mp3${NC}"
    echo ""
}

# 运行主函数
main
