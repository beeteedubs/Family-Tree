from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
db = SQLAlchemy(app)


@app.route("/", methods=["POST", "GET"])
def data_file():
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(225), nullable=False, default="Sasha")
    parent = db.Column(db.String(225), nullable=False, default="Sasha")
    have_children = db.Column(db.Boolean, nullable=False)


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///fam_tree.db"

