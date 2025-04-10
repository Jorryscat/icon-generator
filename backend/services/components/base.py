# components/base.py
import math
import colorsys

def generate_base_color(base_color, richness):
    """生成基础颜色或渐变颜色的 SVG 定义"""
    if richness <= 1:
        # 如果色彩丰富度为 1，仅返回基础颜色
        return f"rgb{tuple(base_color)}", ""

    # 如果色彩丰富度大于 1，生成渐变颜色
    r, g, b = base_color
    gradient_colors = []

    # 根据 richness 动态调整色相跨度
    if richness == 2:
        hue_range = 30  # 色相变化范围 ±30 度
    elif richness == 3:
        hue_range = 60  # 色相变化范围 ±60 度
    elif richness >= 4:
        hue_range = 90  # 色相变化范围 ±90 度
    else:
        hue_range = 30  # 默认色相变化范围 ±30 度

    step = hue_range / (richness - 1)  # 根据色彩丰富度计算步长
    for i in range(richness):
        # 调整颜色的亮度和饱和度
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        h = (h + (step * i - step * (richness - 1) / 2) / 360) % 1.0  # 在指定范围内调整色相
        new_r, new_g, new_b = colorsys.hsv_to_rgb(h, s, v)
        gradient_colors.append(f"rgb({int(new_r * 255)}, {int(new_g * 255)}, {int(new_b * 255)})")

    # 生成渐变填充字符串
    gradient_def = f'''
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {''.join([f'<stop offset="{int((i / (len(gradient_colors) - 1)) * 100)}%" stop-color="{color}" />' for i, color in enumerate(gradient_colors)])}
        </linearGradient>
    </defs>
    '''
    return "url(#gradient)", gradient_def

def generate_circle_base(background_color, size=(256, 256), padding=20, border_color=None, border_width=0, color_richness=1):
    """生成圆形底托"""
    radius = size[0] // 2 - padding
    center = (size[0] // 2, size[1] // 2)

    # 处理基础颜色
    fill_color, gradient_def = generate_base_color(background_color, color_richness)

    # 使用基础颜色填充
    svg_content = f'''
    {gradient_def}
    <circle cx="{center[0]}" cy="{center[1]}" r="{radius}" fill="{fill_color}" />
    '''
    # 如果传递了边框颜色和宽度，添加边框
    if border_color and border_width > 0:
        svg_content = f'''
        <circle cx="{center[0]}" cy="{center[1]}" r="{radius}" stroke="rgb{border_color}" stroke-width="{border_width}" fill="none" />
        {svg_content}  <!-- 添加边框到底托上 -->'''

    return svg_content.strip()

def generate_square_base(background_color, size=(256, 256), padding=20, corner_radius=20, border_color=None, border_width=0, color_richness=1):
    """生成方形底托"""
    inner_size = (size[0] - 2 * padding, size[1] - 2 * padding)

    # 处理基础颜色
    fill_color, gradient_def = generate_base_color(background_color, color_richness)

    # 使用基础颜色填充
    svg_content = f'''
    {gradient_def}
    <rect x="{padding}" y="{padding}" width="{inner_size[0]}" height="{inner_size[1]}" fill="{fill_color}" rx="{corner_radius}" ry="{corner_radius}" />
    '''
    # 如果传递了边框颜色和宽度，添加边框
    if border_color and border_width > 0:
        svg_content = f'''
        <rect x="{padding}" y="{padding}" width="{inner_size[0]}" height="{inner_size[1]}" stroke="rgb{border_color}" stroke-width="{border_width}" fill="none" rx="{corner_radius}" ry="{corner_radius}" />
        {svg_content}  <!-- 添加边框到底托上 -->'''

    return svg_content.strip()

def generate_hexagon_base(background_color, size=(256, 256), padding=20, border_color=None, border_width=0, color_richness=1):
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

    # 处理基础颜色
    fill_color, gradient_def = generate_base_color(background_color, color_richness)

    # 使用基础颜色填充
    svg_content = f'''
    {gradient_def}
    <polygon points="{points_str}" fill="{fill_color}" />
    '''
    # 如果传递了边框颜色和宽度，添加边框
    if border_color and border_width > 0:
        svg_content = f'''
        <polygon points="{points_str}" stroke="rgb{border_color}" stroke-width="{border_width}" fill="none" />
        {svg_content}  <!-- 添加边框到底托上 -->'''

    return svg_content.strip()
