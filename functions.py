from flask import Flask, render_template, url_for, request, redirect, json
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///family_tree.db"
db = SQLAlchemy(app)
# # app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://%s:@localhost/family_output" % (
#     pw
# )


class family_input(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(225), nullable=False, default="Sasha")
    parent = db.Column(db.String(225), nullable=False, default="Sasha")
    # spouse = db.Column(db.String(225), nullable=True, default="")
    have_children = db.Column(db.String(225), nullable=False)

    def __repr__(self):
        return "<Fam %r>" % self.id


# class database(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(225), nullable=False, default="Sasha")
#     parent = db.Column(db.String(225), nullable=False, default="Sasha")
#     spouse = db.Column(db.String(225), nullable=True, default="")
#     have_children = db.Column(db.String(225), nullable=False)
#     img =???????????????

#     def __repr__(self):
#         return "<Datbase_Entry %r>" % self.id


@app.route("/display")
def render_tree():
    entries = family_input.query.order_by(family_input.id).all()
    return render_template("tree2.html", entries=entries)


@app.route("/", methods=["POST", "GET"])
def index():
    if request.method == "POST":
        name = request.form.get("Your Name")
        father = request.form.get("Father's Name")
        # spouse = request.form.get("Spouse's Name")
        children = request.form.get("Any Children?")
        entry = family_input(name=name, parent=father, have_children=children)

        try:
            db.session.add(entry)
            db.session.commit()
            return redirect("/")
        except:
            return "don goofed"
    else:
        entries = family_input.query.order_by(family_input.id).all()
        return render_template(
            "index2.html", entries=entries, entries_length=len(entries)
        )


@app.route("/delete/<int:id>")
def delete(id):
    entry_to_delete = family_input.query.get_or_404(id)

    try:
        db.session.delete(entry_to_delete)
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
        # entry.spouse = request.form["Spouse's Name"]
        entry.have_children = request.form["Any Children?"]

        try:
            db.session.commit()
            return redirect("/")
        except:
            return "There was an issue updating your task"

    else:
        return render_template("update2.html", entry=entry)


if __name__ == "__main__":
    app.run(debug=True)
