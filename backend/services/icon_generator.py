import math
import os
import re
from .components.base import generate_circle_base, generate_square_base, generate_hexagon_base  # 导入底托生成函数

def load_icon(icon_name, icon_color):
    """加载 SVG 图标并改变填充颜色"""
    icons_dir = os.path.join(os.path.dirname(__file__), '../icons')  # 获取icons文件夹路径
    icon_path = os.path.join(icons_dir, f"{icon_name}.svg")

    try:
        with open(icon_path, 'r', encoding='utf-8') as file:
            svg_content = file.read().strip()
            # 移除 XML 和 DOCTYPE 声明
            svg_content = re.sub(r'^\s*<\?xml[^>]+\?>', '', svg_content)  # 删除 XML 声明
            svg_content = re.sub(r'<!DOCTYPE svg[^>]*>', '', svg_content)  # 删除 DOCTYPE 声明
            # 替换 fill 属性
            svg_content = re.sub(r'fill="[^"]*"', f'fill="rgb{icon_color}"', svg_content)  # 使用正则表达式替换
            # print("导入的 SVG:\n", svg_content)
            return svg_content
    except FileNotFoundError:
        raise ValueError(f"Icon '{icon_name}' not found")

def convert_svg_to_svg(base_svg, icon_svg, icon_scale=0.6):
    """将底托和图标合成生成 SVG，并调整图标位置与大小"""
    base_width = 256
    base_height = 256

    # 计算图标视口大小
    icon_viewbox_match = re.search(r'viewBox="([^"]*)"', icon_svg)
    if not icon_viewbox_match:
        raise ValueError("Icon SVG没有找到viewBox属性")
    
    icon_viewbox = icon_viewbox_match.group(1).split(' ')
    original_icon_width = float(icon_viewbox[2]) - float(icon_viewbox[0])
    original_icon_height = float(icon_viewbox[3]) - float(icon_viewbox[1])

    # 计算缩放后的图标大小
    scaled_icon_width = base_width * icon_scale
    scaled_icon_height = base_height * icon_scale

    # 计算居中位置
    x_position = (base_width - scaled_icon_width) / 2  # 居中对齐
    y_position = (base_height - scaled_icon_height) / 2  # 居中对齐

    # 提取图标内容，不包含外层的 <svg> 标签
    icon_content = re.sub(r'<svg[^>]*>|</svg>', '', icon_svg)

    # 为图标添加缩放和位置变换
    scaled_icon_content = f'''
    <g transform="translate({x_position}, {y_position}) scale({scaled_icon_width / original_icon_width}, {scaled_icon_height / original_icon_height})">
        {icon_content}
    </g>'''


    combined_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{base_width}" height="{base_height}">
        {base_svg}
        {scaled_icon_content}  <!-- 插入缩放后的图标内容 -->
    </svg>'''

    # print("组合后的最终 SVG:\n", combined_svg)  # 打印组合后的 SVG 信息
    return combined_svg.strip()

def generate_flat_icon(icon_name, shape, icon_color, background_color, output_format='svg', icon_scale=0.6, corner_radius=0, border_color=None, border_width=0):
    """生成玻璃效果图标并返回 SVG 格式"""
    base_size = (256, 256)  # 设置基础尺寸
    base_padding = 20 # 设置内边距

    # 限制 icon_size_ratio 的范围在 0 到 1 之间
    if icon_scale < 0:
        icon_scale = 0
    elif icon_scale > 1:
        icon_scale = 1


    if shape == "circle":
        base_svg = generate_circle_base(
            background_color=background_color, 
            size=base_size, 
            padding=base_padding, 
            border_color=border_color,  # 传递边框颜色
            border_width=border_width   # 传递边框宽度
        )
    elif shape == "square":
        base_svg = generate_square_base(
            background_color=background_color, 
            size=base_size, 
            padding=base_padding, 
            corner_radius=corner_radius,
            border_color=border_color,  # 传递边框颜色
            border_width=border_width   # 传递边框宽度
        )
    elif shape == "hexagon":  # 新增六边形支持
        base_svg = generate_hexagon_base(
            background_color=background_color, 
            size=base_size, 
            padding=base_padding, 
            border_color=border_color,  # 传递边框颜色
            border_width=border_width   # 传递边框宽度
        )
    else:
        raise ValueError("Unsupported shape")

    icon_svg = load_icon(icon_name, icon_color)
    combined_svg = convert_svg_to_svg(base_svg, icon_svg, icon_scale)  # 生成合并后的 SVG

    # 返回 SVG 输出
    if output_format == 'svg':
        return combined_svg
    else:
        raise ValueError("Unsupported output format")