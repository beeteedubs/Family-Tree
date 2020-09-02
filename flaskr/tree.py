import os
from flask import (
    Flask,
    render_template,
    url_for,
    request,
    redirect,
    json,
    flash,
)
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

from migrate import *
from auth import *

from flask_login import (
    LoginManager,
    login_required,
    UserMixin,
    login_user,
    logout_user,
    current_user,
)


app = Flask(__name__)
db = SQLAlchemy(app)
db.init_app(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:test@localhost/test"
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///with_spouse.db"

app.config["SECRET_KEY"] = "greensquared"


UPLOAD_FOLDER = "static/images"
app.config["IMAGE_UPLOADS"] = UPLOAD_FOLDER


# @app.route("/display/<string:pivot>") Shoumyo's idea for onclick


@app.route("/home")
@login_required
def home():
    return "The current user is " + current_user.username


@app.route("/", methods=["POST", "GET"])
def index():
    if request.method == "POST":
        name = request.form.get("Your Name")
        father = request.form.get("Father's Name")
        image = request.form.get("Image's Name")
        spouse = request.form.get("Spouse's Name")
        entry = family_input(name=name, parent=father, image=image, spouse=spouse)
        print(
            "\nentry:\n",
            entry.id,
            entry.name,
            entry.parent,
            entry.image,
            entry.spouse,
            "\n",
        )
        if request.files:
            image = request.files["image"]
            image.save(os.path.join(app.config["IMAGE_UPLOADS"], image.filename))
        try:
            db.session.add(entry)
            db.session.commit()
            db.session.close()
            return redirect("/")
        except:
            return "don goofed"
    else:
        entries = family_input.query.order_by(family_input.id).all()
        return render_template("index2.html", entries=entries)


@app.route("/delete/<int:id>")
def delete(id):
    entry = family_input.query.get_or_404(id)
    print(
        "\nentry:\n",
        entry.id,
        entry.name,
        entry.parent,
        entry.image,
        entry.spouse,
        entry.userid,
        type(entry.parent),
        type(entry.userid),
        entry,
        "\n\n\n",
    )
    db.session.delete(entry)
    db.session.commit()
    db.session.close()
    return redirect("/")

    return "There was a problem deleting that task"
    # try:
    #     db.session.delete(entry)
    #     db.session.commit()
    #     return redirect("/")
    # except:
    #     return "There was a problem deleting that task"


@app.route("/update/<int:id>", methods=["GET", "POST"])
def update(id):
    entry = family_input.query.get_or_404(id)
    print(entry.id, entry.name, entry.parent, entry.image, entry.spouse, "\n\n\n\n")
    if request.method == "POST":
        entry.name = "JNJ"  # request.form["Your Name"]
        entry.parent = request.form["Father's Name"]
        entry.image = request.form["Image's Name"]
        entry.spouse = request.form["Spouse's Name"]

        try:
            print(
                entry.id,
                entry.name,
                entry.parent,
                entry.image,
                entry.spouse,
                "\n\n\n\n",
            )
            db.session.commit()
            return redirect("/")  # just return http status code n some json response
            # then through fetch API, make a request to this endpoint w/ the ID
            #
        except:
            return "There was an issue updating your task"

    else:  # would not render anything, instead when post, commit
        return render_template("update2.html", entry=entry)


if __name__ == "__main__":
    app.run(debug=True)

