#!/bin/bash

# 山东西曼克技术有限公司视频监控系统启动脚本
# 适用于开发环境快速启动

echo "=========================================="
echo "山东西曼克技术有限公司视频监控系统"
echo "=========================================="
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到Node.js，请先安装Node.js 16+版本"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未检测到npm，请先安装npm"
    exit 1
fi

# 显示版本信息
echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"
echo ""

# 检查项目依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装项目依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败，请检查网络连接或npm配置"
        exit 1
    fi
    echo "✅ 依赖安装完成"
    echo ""
fi

# 检查环境配置文件
if [ ! -f ".env" ]; then
    echo "⚙️  创建环境配置文件..."
    cat > .env << EOF
# 山东西曼克技术有限公司视频监控系统环境配置
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_APP_NAME=山东西曼克技术有限公司视频监控系统
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development

# 监控配置
REACT_APP_CAMERA_COUNT=50
REACT_APP_STORAGE_DAYS=30
REACT_APP_MAX_USERS=100

# 开发配置
REACT_APP_ENABLE_HTTPS=false
REACT_APP_SESSION_TIMEOUT=3600
REACT_APP_DEBUG_MODE=true
EOF
    echo "✅ 环境配置文件已创建"
    echo ""
fi

# 启动开发服务器
echo "🚀 启动开发服务器..."
echo "📍 访问地址: http://localhost:3000"
echo "🔄 热重载: 已启用"
echo "📱 响应式: 支持移动端预览"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 启动应用
npm start
