# Gas Town Video - Remotion Project

一个使用 [Remotion](https://www.remotion.dev/) 创建的视频页面项目。

## 🎬 项目结构

```
gas-town-video/
├── src/
│   ├── index.ts          # Remotion 入口文件
│   ├── Root.tsx          # 根组件，定义 Composition
│   └── GasTownVideo.tsx  # 主视频组件
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 预览视频（Remotion Studio）

```bash
npm run dev
# 或
npm start
```

这将在浏览器中打开 Remotion Studio，你可以：
- 实时预览视频
- 调整播放进度
- 修改代码并即时看到效果

### 渲染视频

```bash
npm run build
```

渲染后的视频将输出到 `out/video.mp4`

## 📐 视频规格

- **分辨率**: 1920x1080 (Full HD)
- **帧率**: 30 FPS
- **时长**: 10 秒 (300 帧)

## 🎨 自定义

编辑 `src/GasTownVideo.tsx` 来修改视频内容：

- 修改标题文字
- 调整颜色和样式
- 添加更多动画效果
- 使用 Remotion 的 `useCurrentFrame()` 和 `interpolate()` 创建复杂动画

## 📚 学习资源

- [Remotion 官方文档](https://www.remotion.dev/docs)
- [Remotion 示例库](https://www.remotion.dev/docs/examples)
- [React 文档](https://react.dev/)

## 🛠️ 下一步建议

1. **添加更多场景**: 创建多个 Composition 并切换
2. **导入媒体**: 添加图片、视频或音频文件
3. **动态内容**: 使用 props 传递数据，创建动态视频
4. **导出预设**: 创建不同尺寸的视频（社交媒体、故事等）
5. **添加转场**: 使用 Remotion 的过渡效果
6. **集成 API**: 从外部数据源获取内容生成视频

---

Made with ⚡ Remotion + React
