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
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, UserMixin
import os, sys
print(*sys.path, sep='\n')
print('\n\n\n\n')
print(*sys.modules, sep='\n')

app = Flask(__name__)
app.config.update(
    SQLALCHEMY_DATABASE_URI="postgresql://postgres:test@localhost/test",
    IMAGE_UPLOADS="static/images",
)
db = SQLAlchemy(app)


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


@app.route("/", methods=["POST", "GET"])
def index():
    if request.method == "POST":
        name = request.form.get("Your Name")
        father = request.form.get("Father's Name")
        image = request.form.get("Image's Name")
        spouse = request.form.get("Spouse's Name")
        entry = family_input(name=name, parent=father, image=image, spouse=spouse)
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
    try:
        db.session.delete(entry)
        db.session.commit()
        return redirect("/")
    except:
        return "There was a problem deleting that task"


@app.route("/update/<int:id>", methods=["GET", "POST"])
def update(id):
    entry = family_input.query.get_or_404(id)
    if request.method == "POST":
        entry.name = request.form["Your Name"]
        entry.parent = request.form["Father's Name"]
        entry.image = request.form["Image's Name"]
        entry.spouse = request.form["Spouse's Name"]
        try:
            db.session.commit()
            return redirect("/")
        except:
            return "There was an issue updating your task"
    else:
        return render_template("update2.html", entry=entry)


if __name__ == "__main__":
    app.run(debug=True)
