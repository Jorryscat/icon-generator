# icon_drawer.py
from PIL import Image, ImageDraw
import svgwrite
from icons import draw_circle, draw_square, draw_triangle, draw_star, draw_rectangle, draw_heart
# from icons import draw_ellipse, draw_donut  # 新形状导入


# 定义形状名称与绘制函数的映射字典
SHAPE_DRAWERS = {
    "circle": draw_circle,          # 新增圆形
    "square": draw_square,          # 新增正方形
    "triangle": draw_triangle,      # 新增三角形
    "star": draw_star,    # 新增星形
    "rectangle": draw_rectangle, # 新增矩形
    "heart": draw_heart,       # 新增心形
    # "ellipse": draw_ellipse,   # 新增椭圆
    # "donut": draw_donut,       # 新增圆环
}

# 公共函数：绘制图标的逻辑（支持所有形状）
def draw_shape(draw, shape, size, color, border_color, border):
    # 动态选择对应的绘制函数
    shape_drawer = SHAPE_DRAWERS.get(shape)
    
    if shape_drawer:
        shape_drawer(draw, size, color, border_color, border)
    else:
        raise ValueError(f"Unsupported shape: {shape}")
    
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
