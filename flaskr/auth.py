from flask import Blueprint, render_template, redirect, url_for, request, flash, Flask
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required

from . import db

auth = Blueprint("auth", __name__, static_folder="static", template_folder="templates")


@auth.route("/")
@auth.route("/login", methods=["GET"])
def login():
    return render_template("login.html")


from .models import users


@auth.route("/login", methods=["POST"])
def login_post():
    username = request.form.get("username")
    password = request.form.get("password")

    remember = True if request.form.get("remember") else False

    user = users.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        flash("Please check your login details and try again.")
        return redirect(url_for("auth.login"))

    login_user(user, remember=remember)  # ?

    return redirect(url_for("main.index"))


@auth.route("/signup", methods=["GET"])
def signup():
    return render_template("signup.html")


@auth.route("/signup", methods=["POST"])
def signup_post():
    username = request.form.get("username")
    password = request.form.get("password")

    user = users.query.filter_by(username=username).first()

    if user:
        flash("username already exists.")
        return redirect(url_for("auth.signup"))

    new_user = users(
        username=username, password=generate_password_hash(password, method="sha256")
    )
    db.session.add(new_user)
    db.session.commit()

    return redirect(url_for("auth.login"))


@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect("/")  # same thing as redirect('/login')
