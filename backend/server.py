# """Flask backend for Rookie Play."""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    """
    Hello World test endpoints 
    """
    return jsonify(message="Hello, World!")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)

# Hello World - Anish 