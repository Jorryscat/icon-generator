# icons/rectangle.py

def draw_rectangle(draw, size, color, border_color, border):
    width, height = size
    # 确保矩形不会超出画布范围
    draw.rectangle((width // 4, height // 4, 3 * width // 4, 3 * height // 4),
                   fill=color, outline=border_color if border else None, width=3)
