import React, { CSSProperties } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

// ============================================
// 动画配置常量
// ============================================
const TOTAL_DURATION_SECONDS = 18; // 总时长 18 秒

// ============================================
// 粒子组件 - 漂浮的小元素
// ============================================
interface ParticleProps {
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  size: number;
  color: string;
}

const Particle: React.FC<ParticleProps> = ({ delay, duration, startX, startY, size, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // 粒子出现时间
  const appearStart = delay * fps;
  const appearEnd = (delay + 0.5) * fps;
  
  // 粒子透明度 - 淡入后保持
  const opacity = interpolate(
    frame,
    [appearStart, appearEnd],
    [0, 0.6],
    { extrapolateRight: 'clamp' }
  );
  
  // 粒子水平漂浮 - 正弦波运动
  const time = (frame - appearStart) / fps;
  const offsetX = Math.sin(time * 0.5 + delay) * 30;
  const offsetY = Math.cos(time * 0.3 + delay) * 20;
  
  const style: CSSProperties = {
    position: 'absolute',
    left: startX + offsetX,
    top: startY + offsetY,
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    opacity,
    filter: 'blur(1px)',
  };
  
  return <div style={style} />;
};

// ============================================
// 打字机效果文字组件
// ============================================
interface TypewriterTextProps {
  text: string;
  startFrame: number;
  charsPerFrame?: number;
  style?: CSSProperties;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  startFrame, 
  charsPerFrame = 1.5,
  style 
}) => {
  const frame = useCurrentFrame();
  
  // 计算当前应该显示的字符数
  const charsToShow = Math.min(
    text.length,
    Math.floor((frame - startFrame) / charsPerFrame)
  );
  
  const visibleText = charsToShow > 0 ? text.slice(0, charsToShow) : '';
  
  // 光标闪烁效果
  const cursorOpacity = interpolate(
    frame % 20,
    [0, 10, 20],
    [1, 1, 0],
    { extrapolateRight: 'clamp' }
  );
  
  return (
    <span style={style}>
      {visibleText}
      {charsToShow < text.length && (
        <span style={{ opacity: cursorOpacity, color: '#e94560' }}>|</span>
      )}
    </span>
  );
};

// ============================================
// 缩放进入组件
// ============================================
interface ScaleInProps {
  children: React.ReactNode;
  startFrame: number;
  duration?: number;
  style?: CSSProperties;
}

const ScaleIn: React.FC<ScaleInProps> = ({ children, startFrame, duration = 30, style }) => {
  const frame = useCurrentFrame();
  
  // 缩放插值 - 从 0 到 1
  const scale = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  
  // 透明度插值
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  
  return (
    <div
      style={{
        ...style,
        transform: `scale(${scale})`,
        opacity,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </div>
  );
};

// ============================================
// 滑入组件 - 从左侧或右侧
// ============================================
interface SlideInProps {
  children: React.ReactNode;
  startFrame: number;
  direction: 'left' | 'right';
  duration?: number;
  distance?: number;
  style?: CSSProperties;
}

const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  startFrame, 
  direction, 
  duration = 40,
  distance = 200,
  style 
}) => {
  const frame = useCurrentFrame();
  
  // 位移插值
  const translateX = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [direction === 'left' ? -distance : distance, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  
  // 透明度插值
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  
  return (
    <div
      style={{
        ...style,
        transform: `translateX(${translateX}px)`,
        opacity,
      }}
    >
      {children}
    </div>
  );
};

// ============================================
// 旋转组件 - 持续旋转
// ============================================
interface RotateProps {
  children: React.ReactNode;
  startFrame: number;
  duration?: number; // 旋转一周的帧数
  style?: CSSProperties;
}

const Rotate: React.FC<RotateProps> = ({ children, startFrame, duration = 120, style }) => {
  const frame = useCurrentFrame();
  
  // 计算从开始帧到现在经过的帧数
  const elapsedFrames = Math.max(0, frame - startFrame);
  
  // 旋转角度 - 持续旋转
  const rotation = (elapsedFrames / duration) * 360;
  
  // 淡入效果
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  
  return (
    <div
      style={{
        ...style,
        transform: `rotate(${rotation}deg)`,
        opacity,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </div>
  );
};

// ============================================
// 颜色渐变文字组件
// ============================================
interface GradientTextProps {
  text: string;
  startFrame: number;
  duration?: number;
  style?: CSSProperties;
}

const GradientText: React.FC<GradientTextProps> = ({ 
  text, 
  startFrame, 
  duration = 180,
  style 
}) => {
  const frame = useCurrentFrame();
  
  // 计算渐变位置 - 在 0-3 之间循环
  const gradientPosition = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 3],
    { extrapolateRight: 'clamp' }
  );
  
  // 创建流动的渐变
  const gradient = `linear-gradient(
    ${90 + gradientPosition * 30}deg,
    #e94560 0%,
    #ff6b6b 25%,
    #feca57 50%,
    #e94560 75%,
    #ff6b6b 100%
  )`;
  
  // 淡入效果
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 30],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  
  return (
    <div
      style={{
        ...style,
        background: gradient,
        backgroundSize: '200% 200%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        opacity,
      }}
    >
      {text}
    </div>
  );
};

// ============================================
// 主视频组件
// ============================================
export const GasTownVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // 关键时间点（以帧为单位）
  const INTRO_START = 0;
  const TITLE_START = 10;
  const SUBTITLE_START = 50;
  const PARTICLES_START = 80;
  const DECORATIONS_START = 120;
  const BOTTOM_TEXT_START = 180;
  
  // 背景颜色流动动画
  const bgHue = interpolate(
    frame,
    [0, fps * TOTAL_DURATION_SECONDS],
    [220, 260],
    { extrapolateRight: 'clamp' }
  );
  
  const backgroundColor = `hsl(${bgHue}, 50%, 10%)`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ========== 背景渐变层 ========== */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(
            135deg, 
            hsl(${bgHue}, 50%, 10%) 0%, 
            hsl(${bgHue + 20}, 60%, 15%) 50%, 
            hsl(${bgHue + 40}, 70%, 20%) 100%
          )`,
          transition: 'background 0.1s linear',
        }}
      />

      {/* ========== 粒子效果层 ========== */}
      {/* 多个粒子在不同时间出现，创建漂浮效果 */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Particle
          key={i}
          delay={i * 0.3 + PARTICLES_START / fps}
          duration={8}
          startX={Math.random() * width}
          startY={Math.random() * height}
          size={Math.random() * 8 + 4}
          color={`hsla(${Math.random() * 60 + 330}, 80%, 60%, 0.8)`}
        />
      ))}

      {/* ========== 主内容容器 ========== */}
      <div
        style={{
          textAlign: 'center',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          zIndex: 10,
          position: 'relative',
        }}
      >
        {/* 主标题 - 打字机效果 */}
        <div style={{ marginBottom: 40 }}>
          <TypewriterText
            text="⛽ Gas Town"
            startFrame={TITLE_START}
            charsPerFrame={2}
            style={{
              fontSize: 120,
              margin: 0,
              fontWeight: 'bold',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              display: 'inline-block',
            }}
          />
        </div>
        
        {/* 副标题 - 颜色渐变动画 */}
        <div style={{ marginBottom: 60 }}>
          <GradientText
            text="Welcome to the Future of Energy"
            startFrame={SUBTITLE_START}
            duration={300}
            style={{
              fontSize: 48,
              margin: 0,
              fontWeight: '300',
            }}
          />
        </div>

        {/* ========== 装饰元素 ========== */}
        {/* 左侧滑入的装饰 */}
        <SlideIn
          startFrame={DECORATIONS_START}
          direction="left"
          duration={50}
          distance={150}
          style={{
            position: 'absolute',
            left: -100,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <Rotate
            startFrame={DECORATIONS_START + 50}
            duration={180}
            style={{
              width: 80,
              height: 80,
              border: '3px solid #e94560',
              borderRadius: '50%',
              borderStyle: 'dashed',
            }}
          >
            <div style={{ width: '100%', height: '100%' }} />
          </Rotate>
        </SlideIn>

        {/* 右侧滑入的装饰 */}
        <SlideIn
          startFrame={DECORATIONS_START + 20}
          direction="right"
          duration={50}
          distance={150}
          style={{
            position: 'absolute',
            right: -100,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <Rotate
            startFrame={DECORATIONS_START + 70}
            duration={150}
            style={{
              width: 60,
              height: 60,
              border: '2px solid #feca57',
              borderRadius: '50%',
              borderStyle: 'dotted',
            }}
          >
            <div style={{ width: '100%', height: '100%' }} />
          </Rotate>
        </SlideIn>

        {/* 中心缩放进入的装饰点 */}
        <ScaleIn
          startFrame={DECORATIONS_START + 40}
          duration={40}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: '2px solid rgba(233, 69, 96, 0.3)',
            }}
          />
        </ScaleIn>

        {/* 脉冲装饰点 - 三个点依次出现 */}
        <div
          style={{
            marginTop: 60,
            display: 'flex',
            justifyContent: 'center',
            gap: 30,
          }}
        >
          {[0, 1, 2].map((i) => (
            <ScaleIn
              key={i}
              startFrame={DECORATIONS_START + 60 + i * 15}
              duration={20}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#e94560',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: '#e94560',
                }}
              />
            </ScaleIn>
          ))}
        </div>
      </div>

      {/* ========== 底部信息 - 从下滑入 ========== */}
      <SlideIn
        startFrame={BOTTOM_TEXT_START}
        direction="left"
        duration={60}
        distance={100}
        style={{
          position: 'absolute',
          bottom: 60,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 24,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          A Remotion Video Project
        </div>
      </SlideIn>

      {/* ========== 时间进度指示器 ========== */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 40,
          right: 40,
          height: 4,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${(frame / (fps * TOTAL_DURATION_SECONDS)) * 100}%`,
            height: '100%',
            backgroundColor: '#e94560',
            transition: 'width 0.05s linear',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
