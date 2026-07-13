# CozyPaws 上线部署指南

## 一、购买云服务器

### 推荐配置
| 配置项 | 推荐 |
|-------|------|
| CPU | 2 核 |
| 内存 | 4 GB |
| 系统盘 | 40 GB |
| 操作系统 | **Ubuntu 22.04** 或 CentOS 7+ |
| 带宽 | 3 Mbps 起 |

### 推荐厂商
- **阿里云** — https://ecs-buy.aliyun.com (选择"突发性能实例 t6"或"通用型 g7")
- **腾讯云** — https://buy.cloud.tencent.com/cvm (选择"轻量应用服务器"最划算)

### 安全组/防火墙放行以下端口
购买服务器后，在云控制台找到"安全组"或"防火墙"，添加规则：

| 端口 | 用途 |
|------|------|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 8080 | API（可选，可以通过 Nginx 反代）|

---

## 二、购买域名 + 备案

### 步骤
1. 在**阿里云万网**或**腾讯云DNSPod**购买域名，如 `cozypaws.cn`
2. 在云控制台提交**ICP备案**（首次约 5-14 天）
3. 备案通过后，在 DNS 解析中添加 **A 记录**，指向你的服务器 IP

---

## 三、服务器初始化（Ubuntu 22.04）

SSH 登录服务器后逐条执行：

### 3.1 更新系统
```bash
apt update && apt upgrade -y
```

### 3.2 安装 JDK 17
```bash
apt install -y openjdk-17-jdk
java -version   # 确认显示 17.x
```

### 3.3 安装 MySQL 8
```bash
apt install -y mysql-server
```

### 3.4 安装 Nginx
```bash
apt install -y nginx
nginx -v        # 确认显示 nginx 版本
```

### 3.5 安装 Node.js（用于构建前端）
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v         # 确认显示 v20.x
npm -v
```

---

## 四、配置 MySQL

### 4.1 设置 root 密码并创建数据库

```bash
# 启动 MySQL
systemctl start mysql
systemctl enable mysql

# 进入 MySQL 控制台
mysql
```

在 MySQL 控制台中执行：

```sql
-- 设置 root 密码（把 YourPassword123 换成你的密码）
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourPassword123';

-- 创建数据库（注意字符集）
CREATE DATABASE cozypaws CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建专用用户（可选，更安全）
CREATE USER 'cozypaws'@'localhost' IDENTIFIED BY 'YourPassword123';
GRANT ALL PRIVILEGES ON cozypaws.* TO 'cozypaws'@'localhost';
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

---

## 五、部署后端

### 5.1 在本地打包后端

在你本地电脑（Windows）上执行：

```bash
# 在 cozypaws 项目目录下
cd backend
mvn clean package -DskipTests -f pom.xml
```

打包完成后，在 `backend/target/` 目录下会生成 `cozypaws-backend-0.0.1-SNAPSHOT.jar`。

### 5.2 上传 jar 到服务器

```bash
# 在本地 Windows 上执行（将文件上传到服务器）
scp backend/target/cozypaws-backend-0.0.1-SNAPSHOT.jar root@你的服务器IP:/root/cozypaws/
scp -r uploads root@你的服务器IP:/root/cozypaws/  # 如果有历史上传文件
```

### 5.3 在服务器上启动后端

SSH 登录服务器：

```bash
# 创建目录
mkdir -p /root/cozypaws/uploads

# 启动后端（建议先测试）
cd /root/cozypaws
DB_PASSWORD=YourPassword123 JWT_SECRET=你的随机密钥 CORS_ORIGINS=https://你的域名 nohup java -jar cozypaws-backend-0.0.1-SNAPSHOT.jar > app.log 2>&1 &

# 查看是否启动成功
tail -f app.log
# 看到 "Started CozyPawsApplication" 即成功
```

> **生成 JWT 密钥**：在命令行执行 `openssl rand -hex 32` 生成一个随机字符串

### 5.4 配置后端为系统服务（推荐，开机自启）

```bash
cat > /etc/systemd/system/cozypaws-backend.service << 'EOF'
[Unit]
Description=CozyPaws Backend
After=mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=/root/cozypaws
Environment=DB_PASSWORD=YourPassword123
Environment=DB_URL=jdbc:mysql://localhost:3306/cozypaws?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai
Environment=JWT_SECRET=你的随机密钥
Environment=CORS_ORIGINS=https://你的域名
Environment=PORT=8080
ExecStart=/usr/bin/java -jar /root/cozypaws/cozypaws-backend-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 启用并启动服务
systemctl daemon-reload
systemctl enable cozypaws-backend
systemctl start cozypaws-backend

# 检查状态
systemctl status cozypaws-backend
```

---

## 六、构建并部署前端

### 6.1 在本地构建前端

```bash
# 在 cozypaws 项目目录下
npm run build
```

构建完成后，`dist/` 目录下就是前端静态文件。

### 6.2 上传前端文件到服务器

```bash
# 在本地 Windows 上执行
scp -r dist/* root@你的服务器IP:/var/www/cozypaws/
```

### 6.3 配置 Nginx

```bash
cat > /etc/nginx/sites-available/cozypaws << 'EOF'
server {
    listen 80;
    server_name 你的域名;

    # 前端静态文件
    root /var/www/cozypaws;
    index index.html;

    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 大文件上传支持
        client_max_body_size 10M;
    }

    # 上传文件访问
    location /uploads/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
    }

    # SPA 路由（所有非文件请求返回 index.html）
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/cozypaws /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

---

## 七、配置 HTTPS（SSL 证书）

### 使用 Certbot（免费自动方案）

```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 申请证书（会自动修改 Nginx 配置）
certbot --nginx -d 你的域名 --non-interactive --agree-tos -m 你的邮箱@example.com

# 证书会自动续期（测试续期是否正常）
certbot renew --dry-run
```

申请成功后，你的站点就会自动启用 HTTPS。

---

## 八、验证上线

1. 在浏览器访问 `https://你的域名` — 能看到首页
2. 访问 `https://你的域名/shop` — 商品列表正常
3. 访问 `https://你的域名/admin` — 用 `admin@cozypaws.com` 登录后台
4. 测试注册、登录、加购物车、下单完整流程

---

## 九、生成二维码

用任意在线工具生成（推荐这些免费工具）：

- https://cli.im/ — 草料二维码
- https://qrcode.antfu.me/ — 简洁风格

填入 `https://你的域名`，生成二维码图片，保存到手机相册或打印出来即可。

---

## 十、常用维护命令

```bash
# 查看后端日志
journalctl -u cozypaws-backend -f

# 重启后端
systemctl restart cozypaws-backend

# 重启 Nginx
systemctl restart nginx

# 更新后端（上传新 jar 后）
systemctl stop cozypaws-backend
cp 新.jar /root/cozypaws/cozypaws-backend-0.0.1-SNAPSHOT.jar
systemctl start cozypaws-backend

# 更新前端（上传新文件后）
# 无需重启任何服务，Nginx 直接使用新文件

# 查看 MySQL 状态
systemctl status mysql
```

---

## 附：环境变量速查

| 环境变量 | 说明 | 示例 |
|---------|------|------|
| `DB_PASSWORD` | 数据库密码 | `YourPassword123` |
| `DB_URL` | 数据库连接地址 | `jdbc:mysql://localhost:3306/cozypaws?...` |
| `JWT_SECRET` | JWT 签名密钥（32字节hex） | `a1b2c3...` |
| `JWT_EXPIRATION` | Token 过期时间（毫秒） | `86400000`（24小时） |
| `CORS_ORIGINS` | 允许的跨域来源 | `https://你的域名` |
| `PORT` | 后端端口 | `8080` |
| `UPLOAD_DIR` | 图片上传目录 | `./uploads` |
