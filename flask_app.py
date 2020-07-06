from flask import Flask, render_template

# sets up application
app = Flask(__name__)  # references this file

# create index route so browse url don't get 404
@app.route("/")
def index():
    return render_template("index2.html")


if __name__ == "__main__":
    app.run(debug=True)
