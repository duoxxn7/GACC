# GACC 项目

基于 **uni-app + Node.js + SQL Server** 的商品交易管理系统，包含前端用户界面、后端接口服务与数据库备份脚本，适用于商品上传、交易记录、订单处理等场景。

---

## 📁 项目结构

```
gacc_project/
    gacc/
        app.js
        App.vue
        gacc1.sql
        index.html
        main.js
        manifest.json
        package-lock.json
        package.json
        pages.json
        uni.promisify.adaptor.js
        uni.scss
```

---

## 🚀 快速开始

### 🔧 环境要求

- Node.js ≥ 16
- SQL Server ≥ 2019
- HBuilderX（推荐）或 CLI 构建工具（如 @vue/cli）

### 📦 安装依赖

```bash
cd gacc
npm install
```

### ▶️ 启动后端服务

```bash
node app.js
```

确保你已根据实际数据库地址修改 `app.js` 中的 MSSQL 连接配置。

---

## 💻 启动前端项目（uni-app）

1. 使用 HBuilderX 打开 `gacc/` 目录；
2. 点击“运行”选择目标平台（浏览器、小程序等）；
3. 或使用 CLI 构建命令：

```bash
npm run dev:%platform%   # 如 dev:h5、dev:mp-weixin 等
```

## 前端在微信小程序的模拟运行视频
下载链接：https://gacc.obs.cn-north-4.myhuaweicloud.com/vedio_for_show/%E8%BF%90%E8%A1%8C%E5%B1%95%E7%A4%BA.mp4


```bash
npm run dev:%platform%   # 如 dev:h5、dev:mp-weixin 等
```
---

## 🗄 数据库说明

- 数据库初始化脚本：`gacc1.sql`
- 建议使用 SQL Server Management Studio (SSMS) 执行脚本或还原 `.bak` 文件

### 示例连接配置（位于 `app.js`）：

```js
const sqlConfig = {
  user: 'your_user',
  password: 'your_password',
  server: 'localhost',
  database: 'gacc',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};
```

---

## ✨ 功能模块

- 商品上传与展示
- 用户交易与订单处理
- 管理员操作日志记录
- 数据库定期备份支持（备份文件存储在 `gacc_database_backup/`）

---

## 📄 License

MIT License

---

> 本 README.md 由项目结构自动生成。根据需要可补充接口说明和使用截图。
