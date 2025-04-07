from flask import Flask
from routes import initialize_routes
import config

app = Flask(__name__)

# 注册路由
initialize_routes(app)

if __name__ == "__main__":
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
