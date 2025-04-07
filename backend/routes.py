from flask import Flask, jsonify, request, Response
from services.icon_generator import generate_glass_icon

def initialize_routes(app):
    """初始化 API 路由"""
    @app.route("/api/generate-glass-icon", methods=["POST"])
    def generate_glass_icon_route():
        data = request.get_json()
        
        # 确保解析出所有需要的字段
        icon_name = data.get("icon")
        shape = data.get("shape")
        icon_color = data.get("icon_color")
        background_color = data.get("background_color")
        output_format = data.get("format", "svg")  # 默认输出为 svg
        corner_radius = data.get("corner_radius", 20)  # 获取圆角参数，默认为20
        
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
                svg_output = generate_glass_icon(icon_name, shape, icon_color, background_color, output_format='svg', corner_radius=corner_radius)
                return Response(svg_output, mimetype="image/svg+xml")  # 返回 SVG 响应
            else:
                raise ValueError("Unsupported output format")
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
