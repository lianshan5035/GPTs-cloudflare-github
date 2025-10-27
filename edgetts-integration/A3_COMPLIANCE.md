# A3 标准合规说明

## 完全符合 GPTs-A3 文档规范

本安装包中的 `a3_voice_generator.py` 脚本完全符合 GPTs-A3 文档规范。

### 🔄 最新更新 (EdgeTTS 7.2.3)

- ✅ 更新到 EdgeTTS 7.2.3 最新版本
- ✅ 新增 tabulate 和 typing-extensions 依赖
- ✅ 优化安装脚本支持版本控制
- ✅ 增强 A3 标准配置示例
- ✅ 完善 TikTok 合规规则

### ✅ 符合的核心规范

#### 1. 12种情绪参数（文档3）
- Excited, Confident, Empathetic, Calm, Playful, Urgent
- Authoritative, Friendly, Inspirational, Serious, Mysterious, Grateful
- 每种情绪包含：rate, pitch, volume, style, products

#### 2. 动态数学参数库（文档4）
- rate = base_rate + sin(script_id × 0.1) × 0.05 + random(-0.08, 0.15)
- pitch = base_pitch + fib(script_id % 8) / 13 × 0.1 + log(script_id % 100) × 0.02
- volume = base_volume + prime(script_id % 8) / 19 × 0.15 + cos(script_id × 0.15) × 0.08

#### 3. Edge-TTS 安全范围
- rate: -25% to +35%
- pitch: -15% to +20%
- volume: -50% to +50%

#### 4. 输出文件格式
- 标准命名：`tts_{序号:03d}_{情感}.mp3`
- 自动生成配置文件：`config.json`

### 🎯 使用示例

```bash
# 使用配置文件
python a3_voice_generator.py -c a3_config_example.json

# 命令行方式
python a3_voice_generator.py \
  --product "Dark Spot Patch" \
  --scripts "Text 1" "Text 2" "Text 3" \
  --emotion Excited \
  --voice en-US-JennyNeural

# 禁用动态参数（使用固定参数）
python a3_voice_generator.py \
  --product "Product Name" \
  --scripts "Text 1" "Text 2" \
  --emotion Friendly \
  --no-dynamic
```

### 📋 支持的所有情绪

| 情绪 | Rate | Pitch | Volume | 适用产品 |
|------|------|-------|--------|----------|
| Excited | +15% | +12% | +15% | 新品/促销 |
| Confident | +8% | +5% | +8% | 高端/科技 |
| Empathetic | -12% | -8% | -10% | 护肤/健康 |
| Calm | -10% | -3% | 0% | 家居/教育 |
| Playful | +18% | +15% | +5% | 美妆/时尚 |
| Urgent | +22% | +8% | +18% | 限时/秒杀 |
| Authoritative | +5% | +3% | +10% | 投资/专业 |
| Friendly | +12% | +8% | +5% | 日用/社群 |
| Inspirational | +10% | +10% | +12% | 自提升/健身 |
| Serious | 0% | 0% | +5% | 金融/公告 |
| Mysterious | -8% | +5% | -5% | 预告/悬念 |
| Grateful | +5% | +8% | +8% | 感谢/复购 |

### 🔧 核心技术特性

1. **动态参数生成**：基于数学公式动态调整每个音频的参数
2. **防检测机制**：使用哈希、斐波那契序列、素数序列引入随机性
3. **批量处理**：支持一次性生成多个音频文件
4. **配置保存**：自动生成配置文件，记录所有参数

