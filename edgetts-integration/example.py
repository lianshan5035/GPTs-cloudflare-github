#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EdgeTTS 使用示例
"""

import asyncio
import edge_tts


async def example_list_voices():
    """列出可用语音"""
    print("正在获取语音列表...")
    voices = await edge_tts.list_voices()
    
    # 筛选中文语音
    chinese_voices = [v for v in voices if v['Locale'].startswith('zh-')]
    
    print("\n中文语音列表：")
    for voice in chinese_voices[:10]:  # 只显示前10个
        print(f"  - {voice['ShortName']}: {voice['FriendlyName']}")


async def example_generate_audio():
    """生成音频"""
    text = "你好，这是 EdgeTTS 语音合成测试。"
    voice = "zh-CN-XiaoxiaoNeural"  # 使用晓晓语音
    output_file = "output.mp3"
    
    print(f"正在生成语音: {text}")
    
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)
    
    print(f"✅ 语音已保存到: {output_file}")


async def example_generate_ssml():
    """使用 SSML 生成语音"""
    ssml = """
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
        <voice name="zh-CN-XiaoxiaoNeural">
            <prosody rate="+20%">
                这是加速的语音
            </prosody>
            <break time="500ms"/>
            <prosody pitch="high">
                这是高音调
            </prosody>
            <break time="500ms"/>
            正常语音
        </voice>
    </speak>
    """
    
    communicate = edge_tts.Communicate(ssml, "zh-CN-XiaoxiaoNeural")
    await communicate.save("ssml_output.mp3")
    
    print("✅ SSML 语音已保存")


async def main():
    """主函数"""
    print("=" * 60)
    print("EdgeTTS 使用示例")
    print("=" * 60)
    print()
    
    # 示例1: 列出语音
    await example_list_voices()
    print()
    
    # 示例2: 生成音频
    await example_generate_audio()
    print()
    
    # 示例3: 使用 SSML
    await example_generate_ssml()
    print()
    
    print("=" * 60)
    print("✅ 所有示例执行完成！")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
