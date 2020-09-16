from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from . import db


class family_input2(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(225), nullable=False)
    image = db.Column(db.String(225), default="Grandma.jpg")
    father = db.Column(db.String(225))
    mother = db.Column(db.String(225))
    spouse = db.Column(db.String(225))
    userid = db.Column(db.Integer, db.ForeignKey("user.id"))


class users(UserMixin, db.Model):
    id = db.relationship("family_input2", backref="user")
    # id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(225), unique=True)
    password = db.Column(db.String(225), unique=True)
