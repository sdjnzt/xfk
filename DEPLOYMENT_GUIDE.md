# 山东西曼克技术有限公司视频监控系统部署指南

## 概述

本文档详细说明如何将山东西曼克技术有限公司视频监控系统部署到生产环境，包括环境准备、构建部署、配置优化等步骤。

## 环境要求

### 服务器环境
- **操作系统**: CentOS 7+, Ubuntu 18.04+, Windows Server 2016+
- **内存**: 最低 4GB，推荐 8GB+
- **存储**: 最低 50GB，推荐 100GB+
- **网络**: 千兆网络，支持 HTTPS

### 软件环境
- **Node.js**: 16.x 或 18.x LTS版本
- **Nginx**: 1.18+ 或 Apache 2.4+
- **数据库**: MySQL 5.7+ 或 PostgreSQL 10+（可选，用于生产环境数据存储）

## 部署步骤

### 1. 环境准备

#### 安装 Node.js
```bash
# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

#### 安装 Nginx
```bash
# CentOS/RHEL
sudo yum install -y nginx

# Ubuntu/Debian
sudo apt-get install -y nginx

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. 项目构建

#### 克隆项目
```bash
git clone https://github.com/your-username/ximanke-video-system.git
cd ximanke-video-system
```

#### 安装依赖
```bash
npm install
```

#### 构建生产版本
```bash
npm run build
```

构建完成后，会在 `build/` 目录下生成生产环境的静态文件。

### 3. 部署配置

#### Nginx 配置

创建 Nginx 配置文件 `/etc/nginx/conf.d/ximanke-video.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;  # 替换为您的域名
    
    # SSL 证书配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # 静态文件根目录
    root /var/www/ximanke-video-system;
    index index.html;
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 主应用路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理（如果有后端服务）
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 日志配置
    access_log /var/log/nginx/ximanke-video-access.log;
    error_log /var/log/nginx/ximanke-video-error.log;
}
```

#### 部署文件

将构建文件部署到服务器：

```bash
# 创建部署目录
sudo mkdir -p /var/www/ximanke-video-system

# 复制构建文件
sudo cp -r build/* /var/www/ximanke-video-system/

# 设置权限
sudo chown -R nginx:nginx /var/www/ximanke-video-system
sudo chmod -R 755 /var/www/ximanke-video-system
```

#### 重启 Nginx

```bash
# 测试配置
sudo nginx -t

# 重新加载配置
sudo nginx -s reload
```

### 4. 环境配置

#### 环境变量配置

创建 `.env.production` 文件：

```bash
# 生产环境配置
REACT_APP_API_BASE_URL=https://your-api-domain.com
REACT_APP_APP_NAME=山东西曼克技术有限公司视频监控系统
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production

# 监控配置
REACT_APP_CAMERA_COUNT=50
REACT_APP_STORAGE_DAYS=30
REACT_APP_MAX_USERS=100

# 安全配置
REACT_APP_ENABLE_HTTPS=true
REACT_APP_SESSION_TIMEOUT=3600
```

#### 系统服务配置

创建 systemd 服务文件 `/etc/systemd/system/ximanke-video.service`：

```ini
[Unit]
Description=山东西曼克技术有限公司视频监控系统
After=network.target

[Service]
Type=simple
User=nginx
WorkingDirectory=/var/www/ximanke-video-system
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 5. 安全配置

#### 防火墙配置

```bash
# 开放必要端口
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

#### SSL 证书配置

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo yum install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加以下行
0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. 监控和维护

#### 日志监控

```bash
# 查看 Nginx 访问日志
sudo tail -f /var/log/nginx/ximanke-video-access.log

# 查看错误日志
sudo tail -f /var/log/nginx/ximanke-video-error.log

# 查看系统日志
sudo journalctl -u nginx -f
```

#### 性能监控

```bash
# 查看系统资源使用
htop
df -h
free -h

# 查看网络连接
netstat -tulpn | grep :80
netstat -tulpn | grep :443
```

#### 备份策略

```bash
# 创建备份脚本
sudo nano /usr/local/bin/backup-ximanke.sh

#!/bin/bash
BACKUP_DIR="/backup/ximanke-video"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份应用文件
tar -czf $BACKUP_DIR/ximanke-video-$DATE.tar.gz /var/www/ximanke-video-system

# 备份配置文件
cp /etc/nginx/conf.d/ximanke-video.conf $BACKUP_DIR/nginx-config-$DATE.conf

# 删除7天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.conf" -mtime +7 -delete

echo "备份完成: $DATE"
```

设置执行权限和定时任务：

```bash
sudo chmod +x /usr/local/bin/backup-ximanke.sh
sudo crontab -e
# 添加以下行，每天凌晨2点执行备份
0 2 * * * /usr/local/bin/backup-ximanke.sh
```

## 故障排除

### 常见问题

#### 1. 页面无法访问
```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 检查端口监听
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# 检查防火墙
sudo firewall-cmd --list-all
```

#### 2. 静态资源加载失败
```bash
# 检查文件权限
ls -la /var/www/ximanke-video-system/

# 检查 Nginx 配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

#### 3. SSL 证书问题
```bash
# 检查证书有效期
sudo certbot certificates

# 手动续期
sudo certbot renew --force-renewal

# 检查证书文件
sudo ls -la /etc/letsencrypt/live/your-domain.com/
```

### 性能优化

#### 1. 启用 Gzip 压缩

在 Nginx 配置中添加：

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

#### 2. 启用浏览器缓存

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}
```

#### 3. 启用 HTTP/2

```nginx
listen 443 ssl http2;
```

## 更新部署

### 自动部署脚本

创建部署脚本 `/usr/local/bin/deploy-ximanke.sh`：

```bash
#!/bin/bash
set -e

PROJECT_DIR="/opt/ximanke-video-system"
DEPLOY_DIR="/var/www/ximanke-video-system"
BACKUP_DIR="/backup/ximanke-video"

echo "开始部署..."

# 进入项目目录
cd $PROJECT_DIR

# 拉取最新代码
git pull origin main

# 安装依赖
npm install

# 构建项目
npm run build

# 创建备份
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf $BACKUP_DIR/backup-$DATE.tar.gz $DEPLOY_DIR

# 部署新版本
sudo rm -rf $DEPLOY_DIR/*
sudo cp -r build/* $DEPLOY_DIR/

# 设置权限
sudo chown -R nginx:nginx $DEPLOY_DIR
sudo chmod -R 755 $DEPLOY_DIR

# 重启 Nginx
sudo nginx -s reload

echo "部署完成: $DATE"
```

## 联系支持

如果在部署过程中遇到问题，请联系：

- **技术支持**: tech-support@ximanke.com
- **系统管理员**: admin@ximanke.com
- **紧急联系**: 400-xxx-xxxx

---

*山东西曼克技术有限公司视频监控系统部署指南 - 让部署更简单，让系统更稳定* 