# icon-generator# Icon Generator

## 项目简介
本项目是一个基于 Flask 的图标生成器，使用 `Pillow`、`svgwrite` 和 `cairosvg` 处理图像和 SVG。

## 后端（flask）
### 环境要求
- Python 3.12 及以上
- pip 版本最新（建议运行 `python -m pip install --upgrade pip` 更新）

### 安装依赖
1. `pip install -r requirements.txt`
2. 手动安装所需库：`pip install flask pillow svgwrite cairosvg`

### 运行项目
1. `python app.py`


### 建议在虚拟环境运行
1. `python -m venv venv` 根目录创建虚拟环境
2. `venv\Scripts\activate` 激活虚拟环境（wins + cmd）
3. 安装依赖
4. `deactivate` 关闭虚拟环境

## 前端（React）


<hr/>

## 目录结构
icon-generator/ <br/>
├── backend/ # Flask 后端 <br/>
│ ├── app.py # 应用入口 <br/>
│ ├── config.py # 配置文件 <br/>
│ ├── routes.py # API 路由 <br/>
│ ├── icons/ #基础样式图标库 <br/>
│ ├── services/ # 业务逻辑 <br/>
│ │ └── icon_generator.py # 图标生成器 <br/>
│ └── style.css # 样式文件 <br/>
├── frontend/ # React 前端 <br/>
│ ├── package.json # 依赖管理文件 <br/>
│ ├── src/ # 源代码目录 <br/>
│ │ ├── App.jsx # 主组件 <br/>
│ │ ├── components/ # 组件目录 <br/>
│ │ │ └── IconGenerator.js # 图标生成器组件 <br/>
│ │ ├── styles/ # 样式目录 <br/>
│ │ │ └── App.css # 样式文件 <br/>
│ └── public/ # 公共静态资源（如 favicon.ico） <br/>
└── README.md # 项目说明文档    