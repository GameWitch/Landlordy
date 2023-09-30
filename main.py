from flask import Flask, render_template, json, request
from geojson import Point, Feature, FeatureCollection
import json
import os

app = Flask(__name__)

with open("static/fullData.json", 'r') as j:
    loaded = json.load(j)


def showjson():
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "static", "map_features.json")
    with open(json_url) as f:
        return json.load(f)


@app.route("/")
def home():
    return render_template("index.html", addresses=showjson())


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/owner", methods=['GET'])
def owner_address():
    if request.method == 'GET':
        args = request.args.to_dict()
        owner_addy = args["owner"]
        owned_list = loaded[owner_addy]
        return owned_list


if __name__ == "__main__":
    app.run(debug=True)

