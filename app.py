from flask import Flask, jsonify, render_template
import pymongo

# Creates the webpage app
app = Flask(__name__)
# Creates connection and connects the database to python
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# Calls out starbucks database
Starbucks_Information_db = client.StarbucksDB

# Calls out the collection
Information = Starbucks_Information_db.Information
Store_Numbers = Starbucks_Information_db.Store_List

# Creates an empty variable to store the python database as a dict
API_Data = ""
API_Data_Store = ""
# Finds the information and imports the library as a dict
for info in Information.find():
    API_Data = info

for info in Store_Numbers.find():
    API_Data_Store = info

# Fixes the one object item because you cannot jsonify an object()
API_Data['_id'] = str(API_Data['_id'])
API_Data_Store['_id'] = str(API_Data_Store['_id'])



# Returns homepage as is
@app.route("/")
def index():
    return render_template("index.html")

# Creates a http://localhost.5000/api page to display json
@app.route("/api")
def api():
    return jsonify(API_Data)

@app.route("/store_numbers")
def store_numbers():
    return jsonify(API_Data_Store)


# Keeps the server running
if __name__ == "__main__":
    app.run()
