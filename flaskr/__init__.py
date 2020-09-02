import os

from flask import Flask

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:test@localhost/test"

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        
