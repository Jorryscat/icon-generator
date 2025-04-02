# icons/star.py
import math

def draw_star(draw, size, color, border_color, border):
    width, height = size
    # 星形的五个角
    center_x, center_y = width // 2, height // 2
    radius_outer = min(width, height) // 2  # 外部半径
    radius_inner = radius_outer // 2  # 内部半径
    
    points = []
    
    # 计算五角星的每个角
    for i in range(5):
        outer_angle = i * 2 * math.pi / 5 - math.pi / 2  # 外部角度（从正上方开始）
        inner_angle = (i + 0.5) * 2 * math.pi / 5 - math.pi / 2  # 内部角度（五角星的凹点）
        
        outer_x = center_x + radius_outer * math.cos(outer_angle)
        outer_y = center_y + radius_outer * math.sin(outer_angle)
        inner_x = center_x + radius_inner * math.cos(inner_angle)
        inner_y = center_y + radius_inner * math.sin(inner_angle)
        
        points.append((outer_x, outer_y))  # 外部角
        points.append((inner_x, inner_y))  # 内部角
    
    # 绘制五角星
    draw.polygon(points, fill=color, outline=border_color if border else None)
