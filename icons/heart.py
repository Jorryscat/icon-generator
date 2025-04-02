# shapes/heart.py
import math

def draw_heart(draw, size, color, border_color, border):
    width, height = size
    points = []
    for t in range(0, 361, 1):  # 从 0 到 360 生成更精细的点
        t_rad = math.radians(t)  # 将角度转换为弧度
        x = 16 * math.sin(t_rad)**3
        y = 13 * math.cos(t_rad) - 5 * math.cos(2 * t_rad) - 2 * math.cos(3 * t_rad) - math.cos(4 * t_rad)

        # 缩放并平移心形以适应给定的尺寸
        scaled_x = width / 2 + x * (width / 30)
        scaled_y = height / 2 - y * (height / 30)
        points.append((scaled_x, scaled_y))

    draw.polygon(points, fill=color, outline=border_color if border else None)
