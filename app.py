from flask import Flask, jsonify, render_template, request

from calculator import OPERATIONS, calculate

app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/api/calculate")
def api_calculate():
    data = request.get_json(silent=True) or {}
    try:
        a = float(data["a"])
        b = float(data["b"])
        op = str(data["op"])
        if op not in OPERATIONS:
            raise ValueError(f"Unknown operation: {op}")
        result = calculate(a, b, op)
    except (KeyError, TypeError):
        return jsonify(error="Missing or invalid input"), 400
    except ValueError as exc:
        return jsonify(error=str(exc)), 400
    if isinstance(result, float) and result.is_integer():
        result = int(result)
    return jsonify(result=result)


if __name__ == "__main__":
    app.run(debug=True)
