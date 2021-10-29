from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.debug = True
app.config['UPLOAD_FOLDER'] = './static/data/'


@app.route("/")
@app.route("/home")
def index():
    return render_template('index.html')


@app.route('/header')
def header():
    return render_template('header.html')


@app.route('/linkedlist')
def linkedlist():
    return render_template('linkedlist.html')


@app.route("/dijkstra")
def dijkstra():
    return render_template('d3.html')


@app.route("/dragndrop")
def dragndrop():
    return render_template('dragndrop.html')


@app.route('/plotGraph', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        try:
            f = request.files['file']
            f.save(os.path.join(
                app.config['UPLOAD_FOLDER'], secure_filename(f.filename)))
            return render_template('plotGraphDijkstra.html', filename=f.filename)
        except:
            return render_template('plotGraphDijkstra.html', filename='defaultGraph.csv')
    else:
        return render_template('plotGraphDijkstra.html', filename='defaultGraph.csv')


@app.route('/BST-Insertion')
def hello():
    return render_template('BST_Insertion.html')


@app.route('/newdijkstra')
def input_graph():
    return render_template('inputGraph.html')
