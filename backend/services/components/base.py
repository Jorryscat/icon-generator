# components/base.py
import math

def generate_circle_base(background_color, size=(256, 256), padding=20, border_color=None, border_width=0):
    """生成圆形底托"""
    radius = size[0] // 2 - padding
    center = (size[0] // 2, size[1] // 2)
    svg_content = f'''
    <circle cx="{center[0]}" cy="{center[1]}" r="{radius}" fill="rgb{background_color}" />'''
    # 如果传递了边框颜色和宽度，添加边框
    if border_color and border_width > 0:
        svg_content = f'''
        <circle cx="{center[0]}" cy="{center[1]}" r="{radius}" stroke="rgb{border_color}" stroke-width="{border_width}" fill="none" />
        {svg_content}  <!-- 添加边框到底托上 -->'''
         
    return svg_content.strip()

def generate_square_base(background_color, size=(256, 256), padding=20, corner_radius=20, border_color=None, border_width=0):
    """生成方形底托"""
    inner_size = (size[0] - 2 * padding, size[1] - 2 * padding)
    svg_content = f'''
    <rect x="{padding}" y="{padding}" width="{inner_size[0]}" height="{inner_size[1]}" fill="rgb{background_color}" rx="{corner_radius}" ry="{corner_radius}" />'''
    # 如果传递了边框颜色和宽度，添加边框
    if border_color and border_width > 0:
        svg_content = f'''
        <rect x="{padding}" y="{padding}" width="{inner_size[0]}" height="{inner_size[1]}" stroke="rgb{border_color}" stroke-width="{border_width}" fill="none" rx="{corner_radius}" ry="{corner_radius}" />
        {svg_content}  <!-- 添加边框到底托上 -->'''
         
    return svg_content.strip()

def generate_hexagon_base(background_color, size=(256, 256), padding=20, border_color=None, border_width=0):
    """生成六边形底托"""
    radius = size[0] // 2 - padding
    center = (size[0] // 2, size[1] // 2)

    # 计算六边形的6个顶点坐标
    points = []
    for i in range(6):
        angle = math.radians(i * 60)  # 每个角度是60度
        x = center[0] + radius * math.cos(angle)
        y = center[1] + radius * math.sin(angle)
        points.append(f"{x},{y}")

    points_str = " ".join(points)

    # 创建六边形底托的SVG
    svg_content = f'''
    <polygon points="{points_str}" fill="rgb{background_color}" />'''

    # 如果传递了边框颜色和宽度，添加边框
    if border_color and border_width > 0:
        svg_content = f'''
        <polygon points="{points_str}" stroke="rgb{border_color}" stroke-width="{border_width}" fill="none" />
        {svg_content}  <!-- 添加边框到底托上 -->'''

    return svg_content.strip()
