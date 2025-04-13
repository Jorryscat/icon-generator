# icon-generator# Icon Generator

## 项目简介
本项目是一个基于 Flask 的svg图标生成器。

## 后端（flask）
### 环境要求
- Python 3.12 及以上
- pip 版本最新（建议运行 `python -m pip install --upgrade pip` 更新）

### 安装依赖
1. `pip install -r requirements.txt`

### 运行项目
1. `python app.py`


### 建议在虚拟环境运行
1. `python -m venv venv` 根目录创建虚拟环境
2. `venv\Scripts\activate` 激活虚拟环境（wins + cmd）
3. 安装依赖
4. `deactivate` 关闭虚拟环境

## 前端（React/typescript/nextjs/tailwind css）
### 环境要求 
1. node >= 16
2. npm 或 yarn 包管理工具

### 安装依赖
1. cd frontend/icon-generate-app
2. npm install 或 yarn install

### 运行项目
1. npm run dev
2. 项目默认3000端口

## 运行效果
![image](https://pic1.imgdb.cn/item/67fb9fe288c538a9b5cdd8d0.jpg)
![image](https://pic1.imgdb.cn/item/67fba02e88c538a9b5cdda00.jpg)


## 目录结构
icon-generator/ <br/>
├── backend/ # Flask 后端 <br/>
│ ├── app.py # 应用入口 <br/>
│ ├── config.py # 配置文件 <br/>
│ ├── routes.py # API 路由 <br/>
│ ├── icons/ # 基础样式图标库 <br/>
│ ├── services/ # 业务逻辑 <br/>
│ │ └── icon_generator.py # 图标生成器 <br/>
│ └── style.css # 样式文件 <br/>
├── frontend/icon-generate-app/ # React 前端 <br/>
│ ├── package.json # 依赖管理文件 <br/>
│ ├── src/ # 源代码目录 <br/>
│ │ ├── app/ # 应用页面 <br/>
│ │ │ ├── main/ # 主页面 <br/>
│ │ │ │ └── page.tsx # 主页面逻辑 <br/>
│ │ │ ├── layout.tsx # 全局布局 <br/>
│ │ │ └── globals.css # 全局样式 <br/>
│ │ ├── hooks/ # 自定义 Hook <br/>
│ │ │ └── useDebounce.ts # 防抖 Hook <br/>
│ │ ├── utils/ # 工具函数 <br/>
│ │ │ └── api.ts # Axios 配置 <br/>
│ ├── public/ # 公共静态资源 <br/>
│ │ ├── cover1.png # 背景图片 <br/>
│ │ └── logo.png # Logo 图片 <br/>
│ ├── tailwind.config.js # Tailwind CSS 配置 <br/>
│ ├── next.config.ts # Next.js 配置文件 <br/>
│ └── tsconfig.json # TypeScript 配置 <br/>
└── README.md # 项目说明文档 <br/>