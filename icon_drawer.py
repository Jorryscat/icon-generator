# icon_drawer.py
from PIL import Image, ImageDraw
import math
import svgwrite

# 公共函数：绘制图标的逻辑（支持所有形状）
def draw_shape(draw, shape, size, color, border_color, border):
    width, height = size
    if shape == "circle":
        draw.ellipse((width//4, height//4, 3*width//4, 3*height//4), fill=color, outline=border_color if border else None, width=3)
    
    elif shape == "square":
        draw.rectangle((width//4, height//4, 3*width//4, 3*height//4), fill=color, outline=border_color if border else None, width=3)

    elif shape == "triangle":
        points = [(width//2, height//4), (width//4, 3*height//4), (3*width//4, 3*height//4)]
        draw.polygon(points, fill=color, outline=border_color if border else None)

    elif shape == "star":
        points = [
            (width//2, height//6), (width//3, height//3), (width//6, height//3),
            (width//4, height//2), (width//6, 5*height//6), (width//2, 2*height//3),
            (5*width//6, 5*height//6), (3*width//4, height//2), (5*width//6, height//3), (2*width//3, height//3)
        ]
        draw.polygon(points, fill=color, outline=border_color if border else None)

    # 增加常见图形：矩形
    elif shape == "rectangle":
        draw.rectangle((width//4, height//4, 3*width//4, 3*height//4), fill=color, outline=border_color if border else None, width=3)

    # 增加常见图形：心形
    elif shape == "heart":
        # 使用数学公式绘制心形
        points = []
        for t in range(0, 361, 1):  # 生成更精细的点，t 从 0 到 360
            t_rad = math.radians(t)  # 将角度转换为弧度
            x = 16 * math.sin(t_rad)**3
            y = 13 * math.cos(t_rad) - 5 * math.cos(2 * t_rad) - 2 * math.cos(3 * t_rad) - math.cos(4 * t_rad)

            # 缩放并平移心形以适应给定的尺寸
            scaled_x = width / 2 + x * (width / 30)
            scaled_y = height / 2 - y * (height / 30)
            
            points.append((scaled_x, scaled_y))

        draw.polygon(points, fill=color, outline=border_color if border else None)

# 公共函数：生成SVG图标
def generate_svg_icon(shape, color, size, border, border_color):
    width, height = size
    dwg = svgwrite.Drawing(size=(width, height))
    
    # 使用公共函数来绘制图形
    draw_shape(dwg, shape, size, color, border_color, border)

    return dwg.tostring()

# 公共函数：生成PNG图标
def generate_png_icon(shape, color, size, border, border_color):
    width, height = size
    image = Image.new("RGBA", (width, height), (255, 255, 255, 0))  # 创建一个透明背景的图片
    draw = ImageDraw.Draw(image)

    # 使用公共函数来绘制图形
    draw_shape(draw, shape, size, color, border_color, border)

    return image
