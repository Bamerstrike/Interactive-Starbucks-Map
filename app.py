from flask import Flask, jsonify, render_template
import pymongo

app = Flask(__name__)

conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

Starbucks_Information_db = client.StarbucksDB
Information = Starbucks_Information_db.Information

API_Data = ""

for info in Information.find():
    API_Data = info

API_Data['_id'] = str(API_Data['_id'])

# print(API_Data)

# print(jsonify(API_Data))

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api")
def api():
    return jsonify(API_Data)

if __name__ == "__main__":
    app.run()
