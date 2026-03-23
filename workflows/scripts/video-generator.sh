#!/bin/bash

# ============================================================
# 短视频生成工作流 - 最小闭环 v1.0
# 输入：文案文本
# 输出：MP4 视频 (1080x1920 竖版)
# ============================================================

set -e

# 配置
PEXELS_API_KEY="6dyX1zMebDkuzprGES7hNBkrlFMDhkH5eRZSm8azy11JgdEwGupneC9c"
WORKDIR="$HOME/openclaw-videos"
INPUT_DIR="$WORKDIR/input"
OUTPUT_DIR="$WORKDIR/output"
ASSETS_DIR="$WORKDIR/assets"

# 视频参数
WIDTH=1080
HEIGHT=1920
FPS=30

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 创建目录
init_dirs() {
    mkdir -p "$INPUT_DIR" "$OUTPUT_DIR" "$ASSETS_DIR"
    # 清理旧文件
    rm -f "$INPUT_DIR"/*.jpg "$INPUT_DIR"/*.mp3 "$INPUT_DIR"/*.txt "$INPUT_DIR"/*.json "$INPUT_DIR"/*.srt 2>/dev/null || true
}

# ============================================================
# Step 1: 接收文案并分析
# ============================================================
analyze_text() {
    local input="$1"
    
    log_info "分析文案..."
    
    # 直接使用输入的文案，拆分成段落
    # 这里简化处理，实际可以用 AI 来拆分
    
    # 按句号拆分
    echo "$input" | sed 's/[。！？]/&\n/g' | grep -v '^$' | head -5 > "$INPUT_DIR/segments.txt"
    
    local segment_count=$(wc -l < "$INPUT_DIR/segments.txt")
    log_info "拆分出 $segment_count 个段落"
    
    # 每个段落分配一个预计时长（根据字数）
    local i=0
    while IFS= read -r line; do
        local len=${#line}
        local duration=$((len / 8 + 3))  # 每8字约1秒
        [ $duration -lt 4 ] && duration=4
        [ $duration -gt 10 ] && duration=10
        
        echo "{\"text\": \"$line\", \"duration\": $duration}" >> "$INPUT_DIR/segments.json"
        ((i++))
    done < "$INPUT_DIR/segments.txt"
    
    # 提取关键词（简化版：取每段前几个字 + 技术相关词）
    local keywords="technology,ai,computer,robot,digital"
    echo "$keywords" > "$INPUT_DIR/keywords.txt"
    
    log_info "文案分析完成"
}

# ============================================================
# Step 2: 搜索 Pexels 素材
# ============================================================
fetch_images() {
    log_info "搜索素材..."
    
    local keywords=$(cat "$INPUT_DIR/keywords.txt")
    local segment_count=$(wc -l < "$INPUT_DIR/segments.txt")
    
    # 搜图
    local response=$(curl -s -H "Authorization: $PEXELS_API_KEY" \
        "https://api.pexels.com/v1/search?query=$keywords&per_page=$segment_count&orientation=portrait")
    
    # 下载图片
    echo "$response" | jq -r '.photos[:'"$segment_count"'] | .[] | .src.large2x' 2>/dev/null | while read -r url; do
        if [ -n "$url" ] && [ "$url" != "null" ]; then
            local fname=$(echo "$url" | md5 | cut -c1-8).jpg
            log_info "下载: $fname"
            curl -sL "$url" -o "$INPUT_DIR/$fname" --max-time 30 || true
            echo "$fname"
        fi
    done > "$INPUT_DIR/image_list.txt"
    
    local count=$(wc -l < "$INPUT_DIR/image_list.txt")
    log_info "下载了 $count 张图片"
    
    if [ "$count" -lt "$segment_count" ]; then
        log_warn "图片数量不足，用现有图片循环"
    fi
}

# ============================================================
# Step 3: 生成 TTS 配音
# ============================================================
generate_tts() {
    log_info "生成配音..."
    
    # 合并所有段落成一段文案
    local full_text=$(cat "$INPUT_DIR/segments.txt" | tr '\n' ' ')
    
    # 用 OpenClaw TTS 生成配音
    # 输出为 MP3 格式
    local tts_output="$INPUT_DIR/narration.mp3"
    
    # 直接调用 tts 工具
    if command -v tts &> /dev/null; then
        echo "$full_text" | tts --output_path "$tts_output" --speaker "nova" 2>/dev/null || {
            log_warn "TTS 生成失败，将生成无声视频"
            touch "$tts_output"
        }
    else
        log_warn "TTS 工具未安装，生成无声视频"
        touch "$tts_output"
    fi
    
    log_info "配音生成完成"
}

# ============================================================
# Step 4: 合成视频
# ============================================================
compose_video() {
    log_info "合成视频..."
    
    local output_file="$OUTPUT_DIR/video_$(date +%Y%m%d_%H%M%S).mp4"
    
    # 读取segments生成时长
    local total_duration=0
    local inputs=""
    local filters=""
    local i=1
    
    while IFS= read -r img; do
        [ -z "$img" ] && continue
        [ ! -f "$INPUT_DIR/$img" ] && continue
        
        # 获取该图片对应的时长
        local duration=$(jq -r ".segments[$((i-1))].duration // 5" "$INPUT_DIR/segments.json" 2>/dev/null || echo "5")
        local frames=$((duration * FPS))
        
        inputs="$inputs -loop 1 -i $INPUT_DIR/$img"
        filters="$filters[$i:v]scale=$WIDTH:$HEIGHT:force_original_aspect_ratio=decrease,pad=$WIDTH:$HEIGHT:(ow-iw)/2:(oh-ih)/2:black,zoompan=z='min(zoom+0.001,1.1)':d=$frames:s=${WIDTH}x${HEIGHT}:fps=$FPS[v$i];"
        
        total_duration=$((total_duration + duration))
        ((i++))
        
        # 最多5张
        [ $i -gt 5 ] && break
    done < "$INPUT_DIR/image_list.txt"
    
    local img_count=$((i - 1))
    
    if [ $img_count -eq 0 ]; then
        log_error "没有可用的图片"
        return 1
    fi
    
    # 构建拼接滤镜
    local concat_parts=""
    for ((j=1; j<=img_count; j++)); do
        concat_parts="${concat_parts}[v$j]"
    done
    filters="${filters}${concat_parts}concat=n=${img_count}:v=1:a=0[outv]"
    
    log_info "合成 $img_count 张图片，总时长约 ${total_duration}s"
    
    # 执行 ffmpeg
    local audio_input=""
    if [ -f "$INPUT_DIR/narration.mp3" ] && [ -s "$INPUT_DIR/narration.mp3" ]; then
        audio_input="-i $INPUT_DIR/narration.mp3"
    fi
    
    # 编译命令
    local cmd="ffmpeg -y $inputs -filter_complex \"$filters\" $audio_input -map \"[outv]\""
    
    if [ -n "$audio_input" ]; then
        cmd="$cmd -c:v libx264 -tune stillimage -c:a aac -b:a 128k -shortest"
    else
        cmd="$cmd -c:v libx264 -tune stillimage -pix_fmt yuv420p -r $FPS"
    fi
    
    cmd="$cmd \"$output_file\""
    
    # 执行（忽略 ffmpeg 的部分警告）
    eval $cmd 2>&1 | grep -E "(Error|error|failed)|Duration|video:" || true
    
    if [ -f "$output_file" ] && [ -s "$output_file" ]; then
        log_info "✅ 视频生成成功: $output_file"
        echo "$output_file"
    else
        log_error "视频生成失败"
        return 1
    fi
}

# ============================================================
# 主流程
# ============================================================
main() {
    local input="$1"
    
    if [ -z "$input" ]; then
        echo "用法: $0 \"文案内容\""
        echo "示例: $0 \"今天给大家介绍一个超强的AI工具。它叫OpenClaw，是一个自托管的AI网关。\""
        exit 1
    fi
    
    echo "========================================"
    echo "🎥 短视频生成工作流 v1.0"
    echo "========================================"
    
    init_dirs
    analyze_text "$input"
    fetch_images
    generate_tts
    local output=$(compose_video)
    
    echo "========================================"
    echo "🎉 完成！"
    echo "📁 视频: $output"
    echo "========================================"
}

main "$1"