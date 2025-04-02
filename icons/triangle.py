# icons/triangle.py

def draw_triangle(draw, size, color, border_color, border):
    width, height = size
    # 三角形的三个顶点位置，确保适配给定尺寸
    points = [
        (width // 2, height // 4),  # 顶点
        (width // 4, 3 * height // 4),  # 左下角
        (3 * width // 4, 3 * height // 4)  # 右下角
    ]
    draw.polygon(points, fill=color, outline=border_color if border else None)
