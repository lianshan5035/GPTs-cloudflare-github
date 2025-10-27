@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ═══════════════════════════════════════════════════════
echo     EdgeTTS 一键安装脚本 (Windows)
echo ═══════════════════════════════════════════════════════
echo.

set INSTALL_DIR=%USERPROFILE%\.edgetts
set EDGETTS_VERSION=7.2.3

REM 检查 Python
echo [1/5] 检查 Python 环境...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 Python
    echo.
    echo 请安装 Python 3.8 或更高版本
    echo 下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)
python --version
echo ✅ Python 已安装

REM 检查 pip
echo [2/5] 检查 pip 环境...
python -m pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 pip
    echo 正在安装 pip...
    python -m ensurepip --upgrade
)
echo ✅ pip 已就绪

REM 创建虚拟环境
echo [3/5] 创建虚拟环境...
if exist "%INSTALL_DIR%\venv" (
    echo ⚠️  虚拟环境已存在，跳过创建
) else (
    python -m venv "%INSTALL_DIR%\venv"
    if errorlevel 1 (
        echo ❌ 虚拟环境创建失败
        pause
        exit /b 1
    )
    echo ✅ 虚拟环境创建成功
)

REM 安装依赖
echo [4/5] 安装 EdgeTTS 及依赖...
call "%INSTALL_DIR%\venv\Scripts\activate.bat"
pip install --upgrade pip --quiet
pip install "edge-tts>=%EDGETTS_VERSION%" --quiet
if errorlevel 1 (
    echo ❌ 安装失败
    pause
    exit /b 1
)
echo ✅ EdgeTTS %EDGETTS_VERSION% 安装完成

REM 创建批处理脚本
echo [5/5] 创建启动脚本...
echo @echo off > "%INSTALL_DIR%\edgetts.bat"
echo call "%%~dp0venv\Scripts\activate.bat" >> "%INSTALL_DIR%\edgetts.bat"
echo python -m edge_tts %%* >> "%INSTALL_DIR%\edgetts.bat"

REM 添加到 PATH
echo.
echo ⚠️  请手动添加到 PATH:
echo %INSTALL_DIR%
echo.
echo 或直接使用:
echo "%INSTALL_DIR%\edgetts.bat" -t "Hello World"
echo.

REM 测试安装
echo 正在测试安装...
python -m edge_tts --version
if errorlevel 1 (
    echo ❌ 安装失败
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════
echo ✅ EdgeTTS 安装完成！
echo ═══════════════════════════════════════════════════════
echo.
echo 📋 使用说明：
echo    1. 使用命令: "%INSTALL_DIR%\edgetts.bat" --help
echo    2. 查看语音列表: "%INSTALL_DIR%\edgetts.bat" --list-voices
echo.
echo 🎯 快速开始：
echo    "%INSTALL_DIR%\edgetts.bat" -t "Hello World" -v en-US-JennyNeural -o output.mp3
echo.
pause
