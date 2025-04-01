from flask import Flask, request, jsonify, send_file

from icon_drawer import generate_svg_icon, generate_png_icon
import io


app = Flask(__name__)


# API 路由：生成图标
@app.route('/generate-icon', methods=['POST'])
def generate_icon():
    data = request.json
    shape = data.get("shape", "circle")  # 形状
    color = data.get("color", "blue")  # 颜色
    size = tuple(data.get("size", [256, 256]))  # 尺寸
    border = data.get("border", False)  # 是否有边框
    border_color = data.get("border_color", "black")  # 边框颜色
    format_type = data.get("format", "png")  # 输出格式：svg或png

    if format_type == "svg":
        svg_data = generate_svg_icon(shape, color, size, border, border_color)
        return svg_data, 200, {'Content-Type': 'image/svg+xml'}

    elif format_type == "png":
        img = generate_png_icon(shape, color, size, border, border_color)
        img_io = io.BytesIO()
        img.save(img_io, "PNG", dpi=(300, 300))  # 增加 dpi 参数，提升图片清晰度
        img_io.seek(0)  # 重置文件指针
        return send_file(img_io, mimetype='image/png')

    else:
        return jsonify({"error": "Unsupported format"}), 400  # 返回错误信息，格式不支持

if __name__ == '__main__':
    app.run(debug=True)
