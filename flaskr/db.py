from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from flask_login import UserMixin
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

app = Flask(__name__)
# app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:test@localhost/test"
db = SQLAlchemy(app)

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command("db", MigrateCommand)


class family_input(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(225), nullable=False, default="Sasha")
    image = db.Column(db.String(225), nullable=False, default="Grandma.jpg")
    parent = db.Column(db.String(225))
    spouse = db.Column(db.String(225))
    userid = db.Column(db.Integer, db.ForeignKey("users.id"))


class users(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(225), unique=True)
    password = db.Column(db.String(225), unique=True)


if __name__ == "__main__":
    manager.run()
