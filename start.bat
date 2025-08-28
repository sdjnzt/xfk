@echo off
chcp 65001 >nul

echo ==========================================
echo 山东西曼克技术有限公司视频监控系统
echo ==========================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到Node.js，请先安装Node.js 16+版本
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查npm是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到npm，请先安装npm
    pause
    exit /b 1
)

REM 显示版本信息
for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js版本: %%i
for /f "tokens=*" %%i in ('npm --version') do echo ✅ npm版本: %%i
echo.

REM 检查项目依赖是否已安装
if not exist "node_modules" (
    echo 📦 正在安装项目依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败，请检查网络连接或npm配置
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
    echo.
)

REM 检查环境配置文件
if not exist ".env" (
    echo ⚙️  创建环境配置文件...
    (
        echo # 山东西曼克技术有限公司视频监控系统环境配置
        echo REACT_APP_API_BASE_URL=http://localhost:3000
        echo REACT_APP_APP_NAME=山东西曼克技术有限公司视频监控系统
        echo REACT_APP_VERSION=1.0.0
        echo REACT_APP_ENVIRONMENT=development
        echo.
        echo # 监控配置
        echo REACT_APP_CAMERA_COUNT=50
        echo REACT_APP_STORAGE_DAYS=30
        echo REACT_APP_MAX_USERS=100
        echo.
        echo # 开发配置
        echo REACT_APP_ENABLE_HTTPS=false
        echo REACT_APP_SESSION_TIMEOUT=3600
        echo REACT_APP_DEBUG_MODE=true
    ) > .env
    echo ✅ 环境配置文件已创建
    echo.
)

REM 启动开发服务器
echo 🚀 启动开发服务器...
echo 📍 访问地址: http://localhost:3000
echo 🔄 热重载: 已启用
echo 📱 响应式: 支持移动端预览
echo.
echo 按 Ctrl+C 停止服务器
echo.

REM 启动应用
npm start

pause
