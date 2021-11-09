from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.debug = True
app.config['UPLOAD_FOLDER'] = './static/data/'


@app.route("/")
def index():
    '''
    Renders the index/home page which contains links to all the algorithms.

    .. :quickref: Home; The home page

    responses:
      -  200 OK – when page successfully rendered
      -  404 Not Found – when an element or file missing
    
    '''
    return render_template('index.html')


@app.route('/header')
def header():
    '''
    To display header navigation bar.
    This navigation bar is loaded in every page.
    
    .. :quickref: Header; The header in top of the page

    responses:
      -  200 OK – everytime when page successfully rendered on each page
    '''
    return render_template('header.html')


@app.route('/linkedlist')
def linkedlist():
    '''
    Renders the page for linked list reversal

    .. :quickref:  The linked list reversal page

    
    responses:
      -  200 OK – when page successfully rendered
    '''
    return render_template('linkedlist.html')


@app.route("/dijkstra")
def dijkstra():
    '''
    To display the dijkstra algorithm via file
    Not used currently as can input is from page itself
    Can be updated for later use

    '''
    return render_template('d3.html')


@app.route("/dragndrop")
def dragndrop():
    '''
    To add the dragndrop features for file
    Not used currently as no file input needed
    Can be updated for later use
    
    '''
    return render_template('dragndrop.html')


@app.route('/plotGraph', methods=['GET', 'POST'])
def upload_file():
    '''
    To check the file and proceed to graph when new or default file.
    Not used currently as input graph can be added only page without file support
    Can be updated for later use

    '''
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
def bst_insertion():
    '''
    Renders Page for Binary Search Tree Insertion Algorithm

    .. :quickref: BST Insertion Page

    
    responses:
      -  200 OK – when page successfully rendered

    '''
    return render_template('BST_Insertion.html')


@app.route('/newdijkstra')
def input_graph():
    '''
    Renders Page for Dijkstra Algorithm which contains Minheap, Graph, and Code Highlight sections

    .. :quickref: Dijkstra Algorithm
    
    responses:
      -  200 OK – when page successfully rendered

    '''
    return render_template('inputGraph.html')
