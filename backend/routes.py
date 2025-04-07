from flask import Flask, jsonify, request, Response
from services.icon_generator import generate_flat_icon

def initialize_routes(app):
    """初始化 API 路由"""
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
                svg_output = generate_flat_icon(icon_name, shape, icon_color, background_color, output_format='svg',icon_scale = icon_scale, corner_radius=corner_radius, border_color=border_color, border_width=border_width)
                return Response(svg_output, mimetype="image/svg+xml")  # 返回 SVG 响应
            else:
                raise ValueError("Unsupported output format")
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
