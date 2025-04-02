# shapes/square.py

def draw_square(draw, size, color, border_color, border):
    width, height = size
    max_square_size = min(width, height)  # 最大边长
    draw.rectangle((width//2 - max_square_size//2, height//2 - max_square_size//2,
                    width//2 + max_square_size//2, height//2 + max_square_size//2),
                   fill=color, outline=border_color if border else None, width=3)
