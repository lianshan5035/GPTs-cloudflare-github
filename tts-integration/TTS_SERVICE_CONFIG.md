# TTS服务集成模块

## 🎵 TTS服务配置

### 服务状态
- ✅ **Flask服务**: 正常运行在 `http://127.0.0.1:8000`
- ✅ **TTS服务**: 正常运行在 `http://127.0.0.1:5001`
- ✅ **Cloudflare隧道**: 使用新令牌正常运行
- ✅ **外部访问**: `https://ai.maraecowell.com` 返回 HTTP/2 200

### 🔧 配置信息

**Cloudflare隧道配置**:
- **隧道ID**: `c863d089-16f0-487a-81cf-507500c16367`
- **隧道名称**: `a3-tt-live-ai`
- **隧道Token**: `eyJhIjoiMTgwOGMwMzFjYmU4NmE4YTAyMTJmNDlkZTFiMzI0NzAiLCJ0IjoiYzg2M2QwODktMTZmMC00ODdhLTgxY2YtNTA3NTAwYzE2MzY3IiwicyI6Ik1qY3daVFUxT0RrdE5XSmlNQzAwWkRkaUxUZzBOV010T1RBNVlqQTFORE0xWldSbCJ9`
- **API令牌**: `2vyptbH_jzcQwSYYuMIIyQNPYs79jZIlfr4mtKSS`
- **Zone ID**: `5e032fda6ac7f3050d8ed6d3d68be5dc`

**访问地址**:
- **本地访问**: `http://127.0.0.1:8000`
- **外部访问**: `https://ai.maraecowell.com`

## 🚀 启动命令

### 方法1: 手动启动
```bash
# 启动Flask服务
cd /Volumes/M2/TT_Live_AI_TTS
python web_dashboard_simple.py &

# 启动Cloudflare隧道
cloudflared tunnel run --token eyJhIjoiMTgwOGMwMzFjYmU4NmE4YTAyMTJmNDlkZTFiMzI0NzAiLCJ0IjoiYzg2M2QwODktMTZmMC00ODdhLTgxY2YtNTA3NTAwYzE2MzY3IiwicyI6Ik1qY3daVFUxT0RrdE5XSmlNQzAwWkRkaUxUZzBOV010T1RBNVlqQTFORE0xWldSbCJ9
```

### 方法2: 一键启动脚本
```bash
cd /Volumes/M2/TT_Live_AI_TTS
./start_services_一键启动所有服务.sh
```

## 📊 服务验证

### 测试命令
```bash
# 测试外部访问
curl -I https://ai.maraecowell.com --resolve ai.maraecowell.com:443:172.67.132.166

# 检查隧道状态
cloudflared tunnel info a3-tt-live-ai

# 检查DNS解析
nslookup ai.maraecowell.com

# 测试本地服务
curl http://127.0.0.1:8000/api/status
curl http://127.0.0.1:5001/health
```

### 预期结果
- HTTP/2 200 响应
- 隧道有活跃连接
- DNS正确解析到Cloudflare隧道
- 本地服务正常响应

## 🔍 故障排除

如果遇到问题：
1. 检查Flask服务是否运行: `curl http://127.0.0.1:8000`
2. 检查TTS服务是否运行: `curl http://127.0.0.1:5001/health`
3. 检查隧道状态: `cloudflared tunnel info a3-tt-live-ai`
4. 重启隧道: `pkill -f cloudflared` 然后重新运行

---

**配置完成时间**: 2025-10-27 09:00
**状态**: ✅ 完全成功
**访问地址**: https://ai.maraecowell.com
