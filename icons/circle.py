# shapes/circle.py

def draw_circle(draw, size, color, border_color, border):
    width, height = size
    max_radius = min(width, height) // 2  # 最大半径
    draw.ellipse((width//2 - max_radius, height//2 - max_radius,
                  width//2 + max_radius, height//2 + max_radius), 
                 fill=color, outline=border_color if border else None, width=3)
