import json
import os
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from services.icon_generator import generate_flat_icon

def initialize_routes(app):
    """初始化 API 路由"""
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # 允许跨域访问

    @app.route("/api/generate-flat-icon", methods=["POST"])
    def generate_glass_icon_route():
        """生成图标并返回 SVG 数据"""
        data = request.get_json()

        # 获取并校验参数
        icon_name = data.get("icon")
        shape = data.get("shape")
        if shape not in ["circle", "square", "hexagon", "triangle"]:
            return jsonify({"error": "Unsupported shape"}), 400

        icon_color = data.get("icon_color")
        background_color = data.get("background_color")
        output_format = data.get("format", "svg")
        corner_radius = data.get("corner_radius", 0)
        border_color = data.get("border_color", None)
        border_width = data.get("border_width", 0)
        icon_scale = data.get("icon_scale", 0.6)
        glassmorphism = data.get("glassmorphism", False)
        color_richness = data.get("color_richness", 1)

        # 检查必要参数
        if not icon_name or not icon_color or not background_color:
            return jsonify({"error": "Missing required parameters"}), 400

        # 转换颜色为元组
        try:
            icon_color = tuple(icon_color)
            background_color = tuple(background_color)
            if border_color:
                border_color = tuple(border_color)
        except TypeError:
            return jsonify({"error": "Invalid color format"}), 400

        # 调用生成图标的函数
        try:
            svg_output = generate_flat_icon(
                icon_name=icon_name,
                shape=shape,
                icon_color=icon_color,
                background_color=background_color,
                output_format=output_format,
                corner_radius=corner_radius,
                border_color=border_color,
                border_width=border_width,
                icon_scale=icon_scale,
                glassmorphism=glassmorphism,
                color_richness=color_richness,
            )
            return jsonify({"data": {"svg": svg_output}})
            return Response(svg_output, mimetype="image/svg+xml")
        except ValueError as e:
            return jsonify({"error": str(e)}), 400

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
    
    
    @app.route("/api/recipes", methods=["GET"])
    def get_recipes():
        """返回配方列表，包括 SVG 数据和配置参数"""
        recipes_file = os.path.join(os.getcwd(), "data", "recipes.json")
        if not os.path.exists(recipes_file):
            return jsonify({"error": "Recipes file not found"}), 404

        with open(recipes_file, "r", encoding="utf-8") as file:
            recipes_data = json.load(file)

        # 为每个 svg_item 动态生成唯一的 gradient 定义
        for i, recipe in enumerate(recipes_data["recipes"]):
            recipe["svg_item"] = recipe["svg_item"].replace("id=\"gradient\"", f"id=\"gradient{i}\"")
            recipe["svg_item"] = recipe["svg_item"].replace("url(#gradient)", f"url(#gradient{i})")

        return jsonify({"data": recipes_data})
