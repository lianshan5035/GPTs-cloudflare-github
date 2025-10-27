#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EdgeTTS 图形界面 (GUI)
基于 tkinter 的简单易用界面
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog, scrolledtext
import asyncio
import threading
import edge_tts
import os


class EdgeTTSGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("EdgeTTS 语音合成工具")
        self.root.geometry("800x600")
        self.root.resizable(True, True)
        
        # 设置图标（如果有的话）
        try:
            self.root.iconbitmap("icon.ico")
        except:
            pass
        
        # 变量
        self.voices = []
        self.selected_voice = tk.StringVar(value="zh-CN-XiaoxiaoNeural")
        self.output_path = tk.StringVar(value=os.path.expanduser("~/Desktop"))
        
        # 创建界面
        self.create_widgets()
        
        # 异步加载语音列表
        self.load_voices()
    
    def create_widgets(self):
        """创建界面组件"""
        
        # 主容器
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 配置网格权重
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        
        # 标题
        title_label = ttk.Label(
            main_frame, 
            text="🎤 EdgeTTS 语音合成工具",
            font=("Arial", 16, "bold")
        )
        title_label.grid(row=0, column=0, pady=(0, 20))
        
        # 文本输入区域
        text_frame = ttk.LabelFrame(main_frame, text="输入文本", padding="10")
        text_frame.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        text_frame.columnconfigure(0, weight=1)
        text_frame.rowconfigure(0, weight=1)
        
        self.text_input = scrolledtext.ScrolledText(
            text_frame, 
            height=8,
            wrap=tk.WORD,
            font=("Arial", 11)
        )
        self.text_input.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        self.text_input.insert("1.0", "在这里输入要转换成语音的文本...")
        
        # 语音选择区域
        voice_frame = ttk.LabelFrame(main_frame, text="语音设置", padding="10")
        voice_frame.grid(row=2, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        voice_frame.columnconfigure(1, weight=1)
        
        # 语音选择
        ttk.Label(voice_frame, text="选择语音:").grid(row=0, column=0, sticky=tk.W, padx=(0, 10))
        
        self.voice_combo = ttk.Combobox(
            voice_frame,
            textvariable=self.selected_voice,
            width=40,
            state="readonly"
        )
        self.voice_combo.grid(row=0, column=1, sticky=(tk.W, tk.E), padx=(0, 10))
        self.voice_combo.set("加载中...")
        
        # 刷新按钮
        refresh_btn = ttk.Button(voice_frame, text="🔄 刷新", command=self.load_voices)
        refresh_btn.grid(row=0, column=2)
        
        # 输出设置区域
        output_frame = ttk.LabelFrame(main_frame, text="输出设置", padding="10")
        output_frame.grid(row=3, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        output_frame.columnconfigure(1, weight=1)
        
        ttk.Label(output_frame, text="保存位置:").grid(row=0, column=0, sticky=tk.W, padx=(0, 10))
        
        output_entry = ttk.Entry(output_frame, textvariable=self.output_path, width=50)
        output_entry.grid(row=0, column=1, sticky=(tk.W, tk.E), padx=(0, 10))
        
        browse_btn = ttk.Button(output_frame, text="📁 浏览", command=self.browse_output)
        browse_btn.grid(row=0, column=2)
        
        # 按钮区域
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=4, column=0, pady=(10, 0))
        
        self.generate_btn = ttk.Button(
            button_frame,
            text="🎵 生成语音",
            command=self.generate_audio,
            width=20
        )
        self.generate_btn.pack(side=tk.LEFT, padx=5)
        
        self.preview_btn = ttk.Button(
            button_frame,
            text="▶️ 预览",
            command=self.preview_audio,
            width=20
        )
        self.preview_btn.pack(side=tk.LEFT, padx=5)
        
        # 进度条
        self.progress = ttk.Progressbar(main_frame, mode='indeterminate')
        self.progress.grid(row=5, column=0, sticky=(tk.W, tk.E), pady=(10, 0))
        
        # 状态栏
        self.status_var = tk.StringVar(value="准备就绪")
        status_label = ttk.Label(main_frame, textvariable=self.status_var, relief=tk.SUNKEN)
        status_label.grid(row=6, column=0, sticky=(tk.W, tk.E), pady=(10, 0))
        
        # 配置主框架行权重
        main_frame.rowconfigure(1, weight=1)
    
    def browse_output(self):
        """浏览输出文件夹"""
        path = filedialog.askdirectory(initialdir=self.output_path.get())
        if path:
            self.output_path.set(path)
    
    def load_voices(self):
        """加载语音列表"""
        def _load():
            try:
                self.status_var.set("正在加载语音列表...")
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                voices = loop.run_until_complete(edge_tts.list_voices())
                loop.close()
                
                # 筛选中文语音
                chinese_voices = [v for v in voices if v['Locale'].startswith('zh-')]
                english_voices = [v for v in voices if v['Locale'].startswith('en-')]
                
                # 中文优先
                self.voices = chinese_voices + english_voices
                
                # 更新下拉框
                voice_names = [f"{v['ShortName']} - {v['FriendlyName']}" for v in self.voices]
                self.voice_combo['values'] = voice_names
                
                if self.voices:
                    self.voice_combo.current(0)
                
                self.status_var.set(f"已加载 {len(self.voices)} 个语音")
            except Exception as e:
                messagebox.showerror("错误", f"加载语音列表失败: {str(e)}")
                self.status_var.set("加载失败")
        
        threading.Thread(target=_load, daemon=True).start()
    
    def get_voice_short_name(self, display_name):
        """从显示名称获取语音短名称"""
        for voice in self.voices:
            if f"{voice['ShortName']} - {voice['FriendlyName']}" == display_name:
                return voice['ShortName']
        return "zh-CN-XiaoxiaoNeural"
    
    def generate_audio(self):
        """生成音频"""
        text = self.text_input.get("1.0", tk.END).strip()
        
        if not text or text == "在这里输入要转换成语音的文本...":
            messagebox.showwarning("警告", "请输入要转换的文本")
            return
        
        def _generate():
            try:
                self.generate_btn.config(state='disabled')
                self.progress.start()
                self.status_var.set("正在生成语音...")
                
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                
                voice_name = self.get_voice_short_name(self.voice_combo.get())
                output_file = os.path.join(
                    self.output_path.get(),
                    f"output_{os.path.basename(voice_name)}.mp3"
                )
                
                communicate = edge_tts.Communicate(text, voice_name)
                loop.run_until_complete(communicate.save(output_file))
                loop.close()
                
                self.progress.stop()
                self.generate_btn.config(state='normal')
                self.status_var.set(f"✅ 语音已保存到: {output_file}")
                
                messagebox.showinfo("成功", f"语音文件已保存到:\n{output_file}")
                
            except Exception as e:
                self.progress.stop()
                self.generate_btn.config(state='normal')
                self.status_var.set("生成失败")
                messagebox.showerror("错误", f"生成语音失败:\n{str(e)}")
        
        threading.Thread(target=_generate, daemon=True).start()
    
    def preview_audio(self):
        """预览音频（保存到临时文件）"""
        text = self.text_input.get("1.0", tk.END).strip()
        
        if not text or text == "在这里输入要转换成语音的文本...":
            messagebox.showwarning("警告", "请输入要转换的文本")
            return
        
        def _preview():
            try:
                self.preview_btn.config(state='disabled')
                self.progress.start()
                self.status_var.set("正在生成预览...")
                
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                
                voice_name = self.get_voice_short_name(self.voice_combo.get())
                output_file = os.path.join(
                    os.path.expanduser("~/Desktop"),
                    "preview.mp3"
                )
                
                communicate = edge_tts.Communicate(text, voice_name)
                loop.run_until_complete(communicate.save(output_file))
                loop.close()
                
                self.progress.stop()
                self.preview_btn.config(state='normal')
                self.status_var.set(f"✅ 预览已保存到: {output_file}")
                
                # 尝试自动播放（macOS）
                if os.name == 'posix':
                    os.system(f'open "{output_file}"')
                
            except Exception as e:
                self.progress.stop()
                self.preview_btn.config(state='normal')
                self.status_var.set("预览失败")
                messagebox.showerror("错误", f"生成预览失败:\n{str(e)}")
        
        threading.Thread(target=_preview, daemon=True).start()


def main():
    root = tk.Tk()
    app = EdgeTTSGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
