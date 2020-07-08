from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# sets up application
app = Flask(__name__)  # references this file, "turn this file into a web app   "
app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "sqlite:///test.db"  # 3 slashes for relative path, 4 for absolute
db = SQLAlchemy(app)  # initializes database

# create modle
class Todo(db.Model):
    id = db.Column(
        db.Integer, primary_key=True
    )  # integer that reference sthe id of each entry
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return "<Task %r>" % self.id


# create index route so browse url don't get 404
@app.route(
    "/", methods=["POST", "GET"]
)  # default is just get, but now can also post (send data to database)
def index():
    if request.method == "POST":  # basically when we hit "Add Task"
        task_content = request.form[
            "content"
        ]  # this var = whatever u put in that input text bar
        new_task = Todo(content=task_content)
        try:
            db.session.add(new_task)
            db.session.commit()
            return redirect("/")
        except:
            return "there was na issue adding your task"
    else:
        # tasks = Todo.query.order_by(Todo.date_created).all()
        return render_template("extension.html")


# unnecessary 
# if __name__ == "__main__":
#     app.run(debug=True)
