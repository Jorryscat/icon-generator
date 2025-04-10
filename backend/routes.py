import os
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from services.icon_generator import generate_flat_icon

def initialize_routes(app):
    """初始化 API 路由"""
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # 仅允许特定来源

    @app.route("/api/generate-flat-icon", methods=["POST"])
    def generate_glass_icon_route():
        data = request.get_json()
        
        # 确保解析出所有需要的字段
        icon_name = data.get("icon")
        shape = data.get("shape")
        icon_color = data.get("icon_color")
        background_color = data.get("background_color")
        output_format = data.get("format", "svg")  # 默认输出为 svg
        corner_radius = data.get("corner_radius", 40)  # 获取圆角参数，默认为20
        border_color = data.get("border_color", None)  # 获取边框颜色参数，默认为None
        border_width = data.get("border_width", 0) ## 获取边框宽度参数，默认为0
        icon_scale = data.get("icon_scale", 0.6)  # 获取图标缩放比例，默认为0.6
        glassmorphism = data.get("glassmorphism", False)  # 新增参数，默认 False
        color_richness = data.get("color_richness", 1)  # 新增参数，默认 1
        
        # 检查所需参数是否存在
        if icon_color is None or background_color is None:
            return jsonify({"error": "Missing required color parameters"}), 400

        # 将颜色转换为元组
        try:
            icon_color = tuple(icon_color)
            background_color = tuple(background_color)
        except TypeError:
            return jsonify({"error": "Color parameters must be arrays"}), 400

        try:
            if output_format == 'svg':
                svg_output = generate_flat_icon(icon_name, shape, icon_color, background_color, output_format='svg',icon_scale = icon_scale, corner_radius=corner_radius, border_color=border_color, border_width=border_width, glassmorphism=glassmorphism, color_richness=color_richness)
                return jsonify({"data": {"svg": svg_output}})
            else:
                raise ValueError("Unsupported output format")
        except ValueError as e:
            return jsonify({"error": str(e)}), 404

    @app.route("/api/icon-name", methods=["GET"])
    def get_all_icons():
        """返回 icons 文件夹下所有图标名称（去掉 .svg 后缀）"""
        icons_folder = os.path.join(os.getcwd(), "icons")  # 假设 icons 文件夹在项目根目录
        if not os.path.exists(icons_folder):
            return jsonify({"error": "Icons folder not found"}), 404
        
        # 获取所有 .svg 文件的文件名并去掉后缀
        icon_names = [
            os.path.splitext(filename)[0]
            for filename in os.listdir(icons_folder)
            if filename.endswith(".svg")
        ]
        return jsonify({"data":{"icons": icon_names}})
