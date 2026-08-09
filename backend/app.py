from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, bcrypt, jwt
from routes.auth_routes import auth_bp
from routes.watchlist_routes import watchlist_bp
from routes.reviews_routes import reviews_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r'/api/*': {'origins': '*'}})

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(watchlist_bp, url_prefix='/api/watchlist')
    app.register_blueprint(reviews_bp, url_prefix='/api/reviews')

    with app.app_context():
        db.create_all()

    @app.route('/api/health')
    def health():
        return {'status': 'ok'}

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
