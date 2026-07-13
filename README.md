# CozyPaws — 宠物用品电商平台

一个中英双语的宠物用品电商平台，基于 React + Spring Boot 构建。支持商品浏览、购物车、结账、用户认证、博客文章和完整后台管理。

> 本项目截图预留位置，请在下方添加你的实际截图。

---

## 页面预览

| 页面 | 截图 |
|------|------|
| 首页 | <!-- 在此处添加首页截图: ![首页](./screenshots/home.png) --> |
| 商品列表 | <!-- 在此处添加商品列表截图: ![商品列表](./screenshots/shop.png) --> |
| 商品详情 | <!-- 在此处添加商品详情截图: ![商品详情](./screenshots/product.png) --> |
| 购物车 | <!-- 在此处添加购物车截图: ![购物车](./screenshots/cart.png) --> |
| 管理后台 | <!-- 在此处添加后台截图: ![后台](./screenshots/admin.png) --> |

> 提示：截图请放入 `screenshots/` 目录，然后在上面表格中替换对应的 `<!-- -->` 注释为 `![描述](./screenshots/文件名.png)` 格式。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | React 19, TypeScript 6, Tailwind CSS v4, Vite |
| **后端** | Spring Boot 3.x, JDK 17, Maven |
| **数据库** | MySQL 8, Flyway（迁移管理）, Spring Data JPA |
| **认证** | Spring Security, JWT（无状态） |
| **状态管理** | Zustand（localStorage 持久化） |
| **图标** | Lucide React |
| **API 文档** | SpringDoc OpenAPI（Swagger UI） |

## 功能特性

- **公开访问** — 商品分类、搜索、排序、分页；博客；响应式设计
- **用户系统** — 注册、登录、购物车（持久化）、结账、订单历史
- **后台管理** — 数据面板、商品/分类/博客 CRUD、订单管理、图片上传、中英文切换
- **国际化** — 公共页面和管理界面均支持完整的中英文翻译

## 项目结构

```
cozypaws/
├── public/                   # 静态资源（favicon）
├── screenshots/              # 项目截图（自行添加）
├── src/                      # React 前端
│   ├── api/                  # Axios API 客户端与接口模块
│   ├── components/           # UI 与布局组件
│   │   ├── ui/               # 可复用组件（ImageUpload 等）
│   │   └── layout/           # Header, Footer, Layout
│   ├── pages/                # 路由页面
│   │   └── admin/            # 后台管理页面
│   ├── store/                # Zustand 状态仓库
│   ├── hooks/                # 自定义 Hooks
│   ├── i18n/                 # 翻译资源与上下文
│   ├── types/                # TypeScript 类型定义
│   ├── App.tsx               # 路由配置
│   └── main.tsx              # 入口文件
├── backend/                  # Spring Boot 后端
│   ├── src/main/java/com/cozypaws/
│   │   ├── config/           # 安全、CORS、Swagger 配置
│   │   ├── controller/       # REST 控制器
│   │   ├── service/          # 业务逻辑层
│   │   ├── repository/       # JPA 仓库
│   │   ├── entity/           # JPA 实体
│   │   ├── dto/              # 请求/响应 DTO
│   │   ├── exception/        # 全局异常处理
│   │   └── security/         # JWT 提供者、过滤器、UserDetailsService
│   └── src/main/resources/
│       ├── application.yml   # 主配置（环境变量注入）
│       ├── application-prod.yml
│       └── db/migration/     # Flyway 迁移脚本（V1-V4）
├── DEPLOY.md                 # 生产部署指南
├── README.md                 # 本文件
└── vite.config.ts            # Vite 配置（含代理）
```

## 快速开始

### 前置要求

- Node.js 20+
- JDK 17+
- MySQL 8
- Maven

### 1. 创建数据库

```sql
CREATE DATABASE cozypaws CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 启动后端

```bash
cd backend

# 可配置环境变量：DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET
# application.yml 中有本地开发默认值

mvn clean package -DskipTests
java -jar target/cozypaws-0.0.1-SNAPSHOT.jar
```

后端启动在 `http://localhost:8080`。Flyway 会在首次启动时自动执行 V1-V4 迁移脚本，完成建表和插入种子数据。

### 3. 启动前端

```bash
# 在项目根目录
npm install
npm run dev
```

前端启动在 `http://localhost:5173`（或下一个可用端口）。Vite 会自动将 `/api` 和 `/uploads` 请求代理到后端。

### 4. 管理员登录

V4 迁移创建的默认管理员账号：

- **邮箱：** `admin@cozypaws.com`
- **密码：** `admin123`

登录后访问 `/admin` 进入后台管理面板。

## API 接口概览

| 接口 | 权限 | 说明 |
|------|------|------|
| `GET /api/products` | 公开 | 商品列表（参数：category, sort, page, size） |
| `GET /api/products/featured` | 公开 | 推荐商品 |
| `GET /api/products/:id` | 公开 | 商品详情 |
| `GET /api/categories` | 公开 | 分类列表 |
| `GET /api/blog` | 公开 | 博客列表 |
| `GET /api/blog/:slug` | 公开 | 博客详情 |
| `POST /api/auth/register` | 公开 | 用户注册 |
| `POST /api/auth/login` | 公开 | 登录，返回 JWT |
| `GET /api/auth/me` | 用户 | 当前用户信息 |
| `GET /api/cart` | 用户 | 获取购物车 |
| `POST /api/cart/items` | 用户 | 添加购物车 |
| `POST /api/orders` | 用户 | 提交订单 |
| `GET /api/orders` | 用户 | 订单历史 |
| `GET /api/admin/dashboard` | 管理员 | 数据面板统计 |
| `POST /api/admin/products` | 管理员 | 创建商品 |
| `PUT /api/admin/products/:id` | 管理员 | 更新商品 |
| `DELETE /api/admin/products/:id` | 管理员 | 删除商品 |
| `POST /api/upload` | 管理员 | 上传图片 |

完整 API 文档：启动后端后访问 `http://localhost:8080/swagger-ui.html`

## 数据库迁移说明

| 文件 | 说明 |
|------|------|
| `V1__init.sql` | 核心建表：categories, products, users, carts, cart_items, orders, order_items, blog_posts |
| `V2__seed_data.sql` | 示例分类、商品（英文）、博客文章（英文） |
| `V3__i18n_update.sql` | 中文名称/描述更新 |
| `V4__add_admin_user.sql` | 创建默认管理员（admin@cozypaws.com / admin123） |

## 环境变量配置

所有敏感值通过环境变量注入，`application.yml` 中设有本地开发默认值：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `DB_URL` | `jdbc:mysql://localhost:3306/cozypaws?...` | 数据库 JDBC URL |
| `DB_USERNAME` | `root` | 数据库用户名 |
| `DB_PASSWORD` | （空） | 数据库密码 |
| `JWT_SECRET` | （内嵌开发密钥） | JWT 签名密钥（生产环境务必修改！） |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:5174` | 允许的跨域来源 |
| `UPLOAD_DIR` | `./uploads` | 图片上传目录 |

## 生产部署

详见 **[DEPLOY.md](./DEPLOY.md)** 的完整部署指南，涵盖：

- 云服务器搭建（Ubuntu + Nginx）
- Let's Encrypt SSL 证书
- MySQL 8 安装与数据库创建
- 后端 systemd 服务配置
- 前端构建与 Nginx 反向代理
- 图片上传目录设置
- 微信扫码访问配置

## 本地开发

```bash
# 前端开发（热更新）
npm run dev

# 后端开发（DevTools 热加载）
cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 构建前端
npm run build

# 构建后端
cd backend && mvn clean package -DskipTests
```

## 截图指南

请将你的实际截图放入 `screenshots/` 目录，然后在顶部的"页面预览"表格中替换 `<!-- -->` 注释。

推荐截图：
1. `screenshots/home.png` — 首页效果
2. `screenshots/shop.png` — 商品列表页
3. `screenshots/product.png` — 商品详情页
4. `screenshots/cart.png` — 购物车页面
5. `screenshots/admin.png` — 后台管理面板

## 许可证

私有项目 — 保留所有权利。
