#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
A3 标准语音生成脚本 - 完全符合 GPTs-A3 文档规范
包含：12种情绪参数、动态数学公式、防检测机制、批量处理优化
"""

import asyncio
import edge_tts
import json
import os
import hashlib
import random
from datetime import datetime
from pathlib import Path
import argparse
import numpy as np


# A3 标准12种情绪参数配置（完全符合文档）
EMOTION_CONFIG = {
    "Excited": {"rate": +15, "pitch": +12, "volume": +15, "style": "cheerful", "products": "新品/促销"},
    "Confident": {"rate": +8, "pitch": +5, "volume": +8, "style": "assertive", "products": "高端/科技"},
    "Empathetic": {"rate": -12, "pitch": -8, "volume": -10, "style": "friendly", "products": "护肤/健康"},
    "Calm": {"rate": -10, "pitch": -3, "volume": 0, "style": "soothing", "products": "家居/教育"},
    "Playful": {"rate": +18, "pitch": +15, "volume": +5, "style": "friendly", "products": "美妆/时尚"},
    "Urgent": {"rate": +22, "pitch": +8, "volume": +18, "style": "serious", "products": "限时/秒杀"},
    "Authoritative": {"rate": +5, "pitch": +3, "volume": +10, "style": "serious", "products": "投资/专业"},
    "Friendly": {"rate": +12, "pitch": +8, "volume": +5, "style": "friendly", "products": "日用/社群"},
    "Inspirational": {"rate": +10, "pitch": +10, "volume": +12, "style": "cheerful", "products": "自提升/健身"},
    "Serious": {"rate": 0, "pitch": 0, "volume": +5, "style": "serious", "products": "金融/公告"},
    "Mysterious": {"rate": -8, "pitch": +5, "volume": -5, "style": "serious", "products": "预告/悬念"},
    "Grateful": {"rate": +5, "pitch": +8, "volume": +8, "style": "friendly", "products": "感谢/复购"}
}

# Edge-TTS 安全范围（符合文档规定）
SAFE_RANGES = {
    'rate': (-25, 35),    # -25% to +35%
    'pitch': (-15, 20),   # -15% to +20%
    'volume': (-50, 50)   # -50% to +50%
}


class DynamicParameterGenerator:
    """动态参数生成器 - 基于 A3 数学动态参数库"""
    
    def __init__(self, product_name, script_id):
        self.product_hash = self._generate_product_hash(product_name)
        self.script_id = script_id
        self.seed = self._generate_seed()
    
    def _generate_product_hash(self, product_name):
        """生成产品哈希值"""
        return int(hashlib.md5(product_name.encode()).hexdigest()[:8], 16) % 10000
    
    def _generate_seed(self):
        """生成种子值"""
        return (self.product_hash + self.script_id * 137) % 1000000
    
    def dynamic_rate(self, base_rate, emotion_type):
        """动态语速调整公式"""
        np.random.seed(self.seed)
        
        emotion_ranges = {
            'Excited': (0.08, 0.15),
            'Calm': (0.03, 0.08),  
            'Urgent': (0.10, 0.18),
            'Empathetic': (0.05, 0.10),
            'Playful': (0.12, 0.20),
            'Confident': (0.05, 0.12)
        }
        
        min_range, max_range = emotion_ranges.get(emotion_type, (0.05, 0.12))
        sine_wave = np.sin(self.script_id * 0.1) * 0.05
        random_noise = np.random.uniform(-min_range, max_range)
        
        dynamic_adjustment = base_rate + sine_wave + random_noise
        return np.clip(dynamic_adjustment, -0.20, 0.30)
    
    def dynamic_pitch(self, base_pitch, emotion_type):
        """动态音调调整公式"""
        np.random.seed(self.seed + 1000)
        
        fib_sequence = [0, 1, 1, 2, 3, 5, 8, 13]
        fib_factor = fib_sequence[self.script_id % 8] / 13.0 * 0.1
        log_perturb = np.log1p(self.script_id % 100) * 0.02
        
        dynamic_pitch = base_pitch + fib_factor + log_perturb
        return np.clip(dynamic_pitch, -0.12, 0.18)
    
    def dynamic_volume(self, base_volume, emotion_type):
        """动态音量调整公式"""
        np.random.seed(self.seed + 2000)
        
        prime_sequence = [2, 3, 5, 7, 11, 13, 17, 19]
        prime_factor = prime_sequence[self.script_id % 8] / 19.0 * 0.15
        cosine_wave = np.cos(self.script_id * 0.15) * 0.08
        
        dynamic_volume = base_volume + prime_factor + cosine_wave
        return np.clip(dynamic_volume, -0.10, 0.20)


class EdgeTTSConverter:
    """Edge-TTS 参数转换器"""
    
    def convert_to_ssml_params(self, rate_pct, pitch_pct, volume_pct):
        """转换为 SSML 格式参数"""
        # 确保在安全范围内
        rate_pct = np.clip(rate_pct, *SAFE_RANGES['rate'])
        pitch_pct = np.clip(pitch_pct, *SAFE_RANGES['pitch'])
        volume_pct = np.clip(volume_pct, *SAFE_RANGES['volume'])
        
        return {
            'rate': f"{rate_pct:+.1f}%",
            'pitch': f"{pitch_pct:+.1f}%",
            'volume': f"{volume_pct:+.1f}dB"
        }


def create_ssml(text, voice, emotion="Friendly", dynamic_params=None):
    """创建 SSML 文本（支持动态参数）"""
    config = EMOTION_CONFIG.get(emotion, EMOTION_CONFIG["Friendly"])
    
    # 使用动态参数（如果提供）
    if dynamic_params:
        rate_val = dynamic_params['rate']
        pitch_val = dynamic_params['pitch']
        volume_val = dynamic_params['volume']
    else:
        rate_val = config['rate']
        pitch_val = config['pitch']
        volume_val = config['volume']
    
    ssml = f"""<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
<voice name="{voice}">
<prosody rate="{rate_val:+.1f}%" pitch="{pitch_val:+.1f}%" volume="{volume_val:+.1f}dB">
{text}
</prosody>
</voice>
</speak>"""
    return ssml.strip()


async def generate_single_audio(text, voice, emotion, output_file, script_id=0, enable_dynamic=True):
    """生成单个音频文件（支持动态参数）"""
    
    # 动态参数生成
    if enable_dynamic:
        product_hash = int(hashlib.md5(output_file.encode()).hexdigest()[:8], 16) % 10000
        param_gen = DynamicParameterGenerator(product_hash, script_id)
        
        base_config = EMOTION_CONFIG.get(emotion, EMOTION_CONFIG["Friendly"])
        
        # 计算动态调整
        base_rate = base_config['rate'] / 100.0
        base_pitch = base_config['pitch'] / 100.0
        base_volume = base_config['volume'] / 10.0
        
        dynamic_rate = param_gen.dynamic_rate(base_rate, emotion) * 100
        dynamic_pitch = param_gen.dynamic_pitch(base_pitch, emotion) * 100
        dynamic_volume = param_gen.dynamic_volume(base_volume, emotion) * 10
        
        dynamic_params = {
            'rate': dynamic_rate,
            'pitch': dynamic_pitch,
            'volume': dynamic_volume
        }
    else:
        dynamic_params = None
    
    # 创建 SSML
    ssml = create_ssml(text, voice, emotion, dynamic_params)
    
    # 生成音频
    communicate = edge_tts.Communicate(ssml, voice)
    await communicate.save(output_file)
    
    print(f"✅ [{script_id:03d}] {emotion:12s} → {os.path.basename(output_file)}")


async def batch_generate(product_name, scripts, output_dir="outputs", 
                        emotion=None, voice=None, enable_dynamic=True):
    """批量生成音频"""
    
    # 默认配置
    if not voice:
        voice = "en-US-JennyNeural"
    if not emotion:
        emotion = "Friendly"
    
    # 创建输出目录
    output_path = Path(output_dir) / product_name
    output_path.mkdir(parents=True, exist_ok=True)
    
    print(f"\n{'='*70}")
    print(f"🎤 A3 标准语音生成")
    print(f"{'='*70}")
    print(f"产品名称: {product_name}")
    print(f"语音选择: {voice}")
    print(f"情感模式: {emotion}")
    print(f"动态参数: {'启用' if enable_dynamic else '禁用'}")
    print(f"输出目录: {output_path}")
    print(f"脚本数量: {len(scripts)}")
    print(f"{'='*70}\n")
    
    # 生成任务列表
    tasks = []
    for i, script in enumerate(scripts):
        filename = f"tts_{i+1:03d}_{emotion}.mp3"
        output_file = output_path / filename
        
        tasks.append(
            generate_single_audio(
                script, voice, emotion, str(output_file), 
                script_id=i+1, enable_dynamic=enable_dynamic
            )
        )
    
    # 批量执行
    await asyncio.gather(*tasks)
    
    # 保存配置
    config_file = output_path / "config.json"
    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump({
            'product_name': product_name,
            'scripts_count': len(scripts),
            'emotion': emotion,
            'voice': voice,
            'dynamic_params': enable_dynamic,
            'generated_at': datetime.now().isoformat(),
            'emotion_config': EMOTION_CONFIG.get(emotion, {})
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*70}")
    print(f"✅ 生成完成！共 {len(scripts)} 个音频文件")
    print(f"📁 输出目录: {output_path}")
    print(f"⚙️  配置文件: {config_file}")
    print(f"{'='*70}\n")
    
    return str(output_path)


def load_config_file(config_file):
    """加载配置文件"""
    with open(config_file, 'r', encoding='utf-8') as f:
        if config_file.endswith('.json'):
            return json.load(f)
        elif config_file.endswith('.yaml') or config_file.endswith('.yml'):
            import yaml
            return yaml.safe_load(f)
    return None


async def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='A3 标准语音生成工具 - 符合 GPTs-A3 文档规范')
    parser.add_argument('--product', '-p', required=True, help='产品名称')
    parser.add_argument('--scripts', '-s', nargs='+', required=True, help='文案列表')
    parser.add_argument('--emotion', '-e', default='Friendly', 
                       choices=list(EMOTION_CONFIG.keys()),
                       help='情感选择（12种可选）')
    parser.add_argument('--voice', '-v', default='en-US-JennyNeural', help='语音名称')
    parser.add_argument('--output', '-o', default='outputs', help='输出目录')
    parser.add_argument('--config', '-c', help='配置文件路径')
    parser.add_argument('--no-dynamic', action='store_true', help='禁用动态参数')
    
    args = parser.parse_args()
    
    # 加载配置（如果提供）
    if args.config:
        config = load_config_file(args.config)
        if config:
            args.product = config.get('product_name', args.product)
            args.scripts = config.get('scripts', args.scripts)
            args.emotion = config.get('emotion', args.emotion)
            args.voice = config.get('voice', args.voice)
    
    # 生成音频
    await batch_generate(
        product_name=args.product,
        scripts=args.scripts,
        output_dir=args.output,
        emotion=args.emotion,
        voice=args.voice,
        enable_dynamic=not args.no_dynamic
    )


if __name__ == "__main__":
    asyncio.run(main())
