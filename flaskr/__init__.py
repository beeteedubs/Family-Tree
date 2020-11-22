from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = "thisismysecretkeydonotstealit"
    app.config[
        "SQLALCHEMY_DATABASE_URI"
    ] = "postgres://slozrruqglhjzd:20cbe4d1fe35bb4bd382cf7fc57342bbc643bd87eef584b4b9e45717b88d1f28@ec2-23-20-168-40.compute-1.amazonaws.com:5432/d3jd4jqhcdrlb2"
    # app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:test@localhost/test"
    # "postgresql://postgres:test@127.0.0.1:5432/test"
    # user     pwd   ip       database
    # app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///with_spouse.db"
    app.config["IMAGE_UPLOADS"] = "static\images"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = "auth.login"  # ?
    login_manager.init_app(app)  # ?

    from .models import users

    @login_manager.user_loader
    def load_user(user_id):
        return users.query.get(int(user_id))

    from .auth import auth as auth_blueprint

    app.register_blueprint(auth_blueprint)

    from .main import main as main_blueprint

    app.register_blueprint(main_blueprint)

    return app