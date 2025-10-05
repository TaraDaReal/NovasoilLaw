from flask import Flask, jsonify, request
from pathlib import Path
import json

app = Flask(__name__)

# Path to your cloned GitHub repo with laws
LAW_DIR = Path("/srv/lawapp/laws_repo/laws")

def load_laws():
    laws = {}
    for file in LAW_DIR.glob("*.json"):
        with open(file, "r", encoding="utf-8") as f:
            law = json.load(f)
            laws[law["code"]] = law
    return laws

laws = load_laws()

@app.route("/")
def index():
    return jsonify({"message": "Welcome to Polynesia Laws API", "total_laws": len(laws)})

@app.route("/laws")
def get_all_laws():
    return jsonify(list(laws.values()))

@app.route("/laws/<code>")
def get_law(code):
    law = laws.get(code.upper())
    if not law:
        return jsonify({"error": "Law not found"}), 404
    return jsonify(law)

@app.route("/search")
def search_laws():
    query = request.args.get("q", "").lower()
    results = [law for law in laws.values() if query in law["title"].lower() or query in law["content"].lower()]
    return jsonify(results)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
