# icon-generator# Icon Generator

## 项目简介
本项目是一个基于 Flask 的图标生成器，使用 `Pillow`、`svgwrite` 和 `cairosvg` 处理图像和 SVG。

## 环境要求
- Python 3.12 及以上
- pip 版本最新（建议运行 `python -m pip install --upgrade pip` 更新）

## 安装依赖
1. `pip install -r requirements.txt`
2. 手动安装所需库：`pip install flask pillow svgwrite cairosvg`

### 运行项目
1. `python app.py`

### 目录结构
project-root/<br/>
│── app.py               # Flask 入口文件<br/>
│── static/              # 静态资源（如图片、CSS、JS）<br/> 
│── templates/           # HTML 模板文件<br/>    
│── requirements.txt     # 依赖文件<br/>
│── README.md<br/>           


### 建议在虚拟环境运行
1. `python -m venv venv` 根目录创建虚拟环境
2. `venv\Scripts\activate` 激活虚拟环境（wins + cmd）
3. 安装依赖
4. `deactivate` 关闭虚拟环境