import os
from flask import (
    Flask,
    render_template,
    url_for,
    request,
    redirect,
    json,
    flash,
    Blueprint,
)
from flask_sqlalchemy import SQLAlchemy
from flask_login import (
    LoginManager,
    login_required,
    UserMixin,
    login_user,
    logout_user,
    current_user,
)

from .models import family_input2, users
from . import db

main = Blueprint("main", __name__)


@main.route("/pivot/<int:id>", methods=["GET", "POST"])
def pivot():
    entry = family_input2.query.get_or_404(id)
    entries = family_input2.query.order_by(family_input2.id).all()
    entries.remove(entry)
    return redirect("/tree")

    # return render_template("index.html", entries=entries)


@main.route("/tree", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        name = request.form.get("Your Name")
        father = request.form.get("Father's Name")
        mother = request.form.get("Mother's Name")
        image = request.form.get("Image's Name")
        spouse = request.form.get("Spouse's Name")

        # pivot = request.form.get(pivot)

        entry = family_input2(
            name=name,
            father=father,
            mother=mother,
            image=image,
            spouse=spouse,
            userid=current_user.id,
        )

        if request.files:
            image = request.files["image"]
            image.save(os.path.join("flaskr/static/images/", image.filename))
        try:
            db.session.add(entry)
            db.session.commit()
            db.session.close()
            return redirect("/tree")
        except:
            return "don goofed"
    else:
        # entries = family_input2.query.order_by(family_input2.id).all()
        entries = family_input2.query.filter_by(userid=current_user.id).all()
        return render_template("index.html", entries=entries)


@main.route("/delete/<int:id>")
def delete(id):
    entry = family_input2.query.get_or_404(id)
    db.session.delete(entry)
    db.session.commit()
    db.session.close()
    return redirect("/tree")


@main.route("/update/<int:id>", methods=["GET", "POST"])
def update(id):
    entry = family_input2.query.get_or_404(id)
    if request.method == "POST":
        entry.name = request.form["Your Name"]
        entry.father = request.form["Father's Name"]
        entry.mother = request.form["Mother's Name"]
        entry.image = request.form["Image's Name"]
        entry.spouse = request.form["Spouse's Name"]
        db.session.commit()
        return redirect("/tree")
        # just return http status code n some json response
        # then through fetch API, make a request to this endpoint w/ the ID
    else:  # would not render anything, instead when post, commit
        return render_template("update.html", entry=entry)
