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

def generate_glass_mask():
    """生成玻璃质感的蒙层"""
    return '''
    <defs>
        <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.8)" />
            <stop offset="50%" stop-color="rgba(255, 255, 255, 0.7)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.8)" />
        </linearGradient>
        <mask id="glass-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#glass-gradient)" />
        </mask>
    </defs>
    '''

def generate_svg_base(shape, points=None, background_color=None, size=(256, 256), padding=20, corner_radius=20, border_color=None, border_width=0, color_richness=1, glassmorphism=False):
    """通用的 SVG 图形生成逻辑"""
    # 处理基础颜色
    fill_color, gradient_def = generate_base_color(background_color, color_richness)

    # 玻璃质感蒙层
    glass_mask = ""
    if glassmorphism:
        glass_mask = generate_glass_mask()

    # 生成图形主体
    if shape == "circle":
        radius = size[0] // 2 - padding
        center = (size[0] // 2, size[1] // 2)
        shape_element = f'<circle cx="{center[0]}" cy="{center[1]}" r="{radius}" fill="{fill_color}" {("mask='url(#glass-mask)'" if glassmorphism else "")} />'
    elif shape == "square":
        inner_size = (size[0] - 2 * padding, size[1] - 2 * padding)
        shape_element = f'<rect x="{padding}" y="{padding}" width="{inner_size[0]}" height="{inner_size[1]}" fill="{fill_color}" rx="{corner_radius}" ry="{corner_radius}" {("mask='url(#glass-mask)'" if glassmorphism else "")} />'
    elif shape == "hexagon":
        shape_element = f'<polygon points="{points}" fill="{fill_color}" {("mask='url(#glass-mask)'" if glassmorphism else "")} />'
    elif shape == "polygon":
        shape_element = f'<polygon points="{points}" fill="{fill_color}" {("mask='url(#glass-mask)'" if glassmorphism else "")} />'
    else:
        raise ValueError("Unsupported shape")

    # 如果传递了边框颜色和宽度，添加边框
    border = ""
    if border_color and border_width > 0:
        border = f'''
        <{shape} {f'points="{points}"' if shape == "polygon" else f'x="{padding}" y="{padding}" width="{size[0] - 2 * padding}" height="{size[1] - 2 * padding}" rx="{corner_radius}" ry="{corner_radius}"'} 
        stroke="rgb{border_color}" stroke-width="{border_width}" fill="none" />
        '''

    # 组合 SVG 内容
    svg_content = f'''
    {gradient_def}
    {glass_mask}
    {border}
    {shape_element}
    '''
    return svg_content.strip()

def generate_circle_base(background_color, size=(256, 256), padding=20, border_color=None, border_width=0, color_richness=1, glassmorphism=False):
    """生成圆形底托"""
    return generate_svg_base("circle", background_color=background_color, size=size, padding=padding, border_color=border_color, border_width=border_width, color_richness=color_richness, glassmorphism=glassmorphism)

def generate_square_base(background_color, size=(256, 256), padding=20, corner_radius=20, border_color=None, border_width=0, color_richness=1, glassmorphism=False):
    """生成方形底托"""
    return generate_svg_base("square", background_color=background_color, size=size, padding=padding, corner_radius=corner_radius, border_color=border_color, border_width=border_width, color_richness=color_richness, glassmorphism=glassmorphism)

def generate_hexagon_base(background_color, size=(256, 256), padding=20, corner_radius=20, border_color=None, border_width=0, color_richness=1, glassmorphism=False):
    """生成带圆角的六边形底托，确保顶点在 Y 轴上"""
    radius = size[0] // 2 - padding
    center = (size[0] // 2, size[1] // 2)

    # 计算六边形的6个顶点坐标，确保第一个顶点在正上方
    points = []
    for i in range(6):
        angle = math.radians(i * 60 - 90)  # 从 -90 度开始，确保第一个顶点在正上方
        x = center[0] + radius * math.cos(angle)
        y = center[1] + radius * math.sin(angle)
        points.append((x, y))

    # 如果 corner_radius 大于 0，则为每个角生成圆角
    if corner_radius > 0:
        rounded_points = []
        for i in range(6):
            # 获取每对相邻的顶点
            p1 = points[i]
            p2 = points[(i + 1) % 6]  # 循环回来

            # 计算圆角方向，生成插值点
            # 计算两点之间的方向向量
            angle = math.atan2(p2[1] - p1[1], p2[0] - p1[0])
            # 计算圆角的切线位置
            p1_tangent = (p1[0] + corner_radius * math.cos(angle), p1[1] + corner_radius * math.sin(angle))
            p2_tangent = (p2[0] - corner_radius * math.cos(angle), p2[1] - corner_radius * math.sin(angle))

            # 插入圆角点
            rounded_points.append(p1)
            rounded_points.append(p1_tangent)
            rounded_points.append(p2_tangent)
        
        # 最后添加最后一个顶点
        rounded_points.append(points[-1])

        # 将圆角后的顶点转换为字符串形式
        points_str = " ".join([f"{x},{y}" for x, y in rounded_points])

        # 生成 SVG 图形并返回
        return generate_svg_base("hexagon", points=points_str, background_color=background_color, size=size, padding=padding, border_color=border_color, border_width=border_width, color_richness=color_richness, glassmorphism=glassmorphism)

    else:
        # 如果没有圆角，则使用原始顶点数据生成普通六边形
        points_str = " ".join([f"{x},{y}" for x, y in points])
        return generate_svg_base("hexagon", points=points_str, background_color=background_color, size=size, padding=padding, border_color=border_color, border_width=border_width, color_richness=color_richness, glassmorphism=glassmorphism)


def adjust_points_for_corner_radius(points, corner_radius):
    """调整点以生成圆角路径"""
    path_data = []
    num_points = len(points)

    for i in range(num_points):
        p1 = points[i]
        p2 = points[(i + 1) % num_points]  # 下一个点
        p0 = points[i - 1]  # 上一个点

        # 计算方向向量
        v1 = ((p1[0] - p0[0]), (p1[1] - p0[1]))
        v2 = ((p2[0] - p1[0]), (p2[1] - p1[1]))

        # 归一化方向向量
        v1_length = math.sqrt(v1[0] ** 2 + v1[1] ** 2)
        v2_length = math.sqrt(v2[0] ** 2 + v2[1] ** 2)
        v1 = (v1[0] / v1_length, v1[1] / v1_length)
        v2 = (v2[0] / v2_length, v2[1] / v2_length)

        # 计算切点
        p1_tangent_start = (p1[0] - corner_radius * v1[0], p1[1] - corner_radius * v1[1])
        p1_tangent_end = (p1[0] + corner_radius * v2[0], p1[1] + corner_radius * v2[1])

        # 添加路径数据
        if i == 0:
            path_data.append(f"M {p1_tangent_start[0]},{p1_tangent_start[1]}")  # 起点
        else:
            path_data.append(f"L {p1_tangent_start[0]},{p1_tangent_start[1]}")  # 直线到切点

        path_data.append(f"Q {p1[0]},{p1[1]} {p1_tangent_end[0]},{p1_tangent_end[1]}")  # 圆角曲线

    path_data.append("Z")  # 闭合路径
    return " ".join(path_data)

def generate_triangle_base(background_color, size=(256, 256), padding=20, corner_radius=0, border_color=None, border_width=0, color_richness=1, glassmorphism=False):
    """生成带圆角的三角形底托"""
    radius = size[0] // 2 - padding
    center = (size[0] // 2, size[1] // 2)
    
    # 计算三角形的3个顶点坐标，确保第一个顶点在正上方
    points = []
    for i in range(3):
        angle = math.radians(i * 120 - 90)  # 从 -90 度开始，确保第一个顶点在正上方
        x = center[0] + radius * math.cos(angle)
        y = center[1] + radius * math.sin(angle)
        points.append((x, y))

    # 如果 corner_radius 大于 0，则为每个角生成圆角
    if corner_radius > 0:
        # 调用 adjust_points_for_corner_radius 函数生成圆角路径
        path_str = adjust_points_for_corner_radius(points, corner_radius)

        # 生成 SVG 图形并返回
        return f'''
        <svg width="{size[0]}" height="{size[1]}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                {generate_base_color(background_color, color_richness)[1]}
            </defs>
            <path d="{path_str}" fill="{generate_base_color(background_color, color_richness)[0]}" {("mask='url(#glass-mask)'" if glassmorphism else "")} />
        </svg>
        '''

    else:
        # 如果没有圆角，则使用原始顶点数据生成普通三角形
        points_str = " ".join([f"{x},{y}" for x, y in points])
        return generate_svg_base("polygon", points=points_str, background_color=background_color, size=size, padding=padding, border_color=border_color, border_width=border_width, color_richness=color_richness, glassmorphism=glassmorphism)