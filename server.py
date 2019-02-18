from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'motif_data'
COLLECTION_NAME = 'motif_kc'
FIELDS = {'_id': False, 'promoter': True, 'enhancer': True, 'encode_no': True, 'chr_type': True, 'enhancer_width': True, 'promoter_width': True, 'pair_no': True, 'enhancer_matrix': True}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/motif_data/motif_kc")
def donorschoose_projects():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find(projection=FIELDS)
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
