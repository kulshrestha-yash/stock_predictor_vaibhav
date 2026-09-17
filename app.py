from sympy import python
from flask import Flask, render_template, request, jsonify
from model import train_model



app = Flask(__name__)




@app.route("/")
def home():

    return render_template(
        "index.html"
    )


# --------------------------------
# PREDICTION API
# --------------------------------

@app.route(
    "/predict",
    methods=["POST"]
)
def predict():

    try:

        # Get JSON sent by JavaScript
        request_data = request.get_json()

        # Get ticker
        ticker = request_data.get(
            "ticker",
            ""
        ).strip().upper()

        # Check ticker
        if not ticker:

            return jsonify({
                "error": "Please enter a stock symbol."
            }), 400

        print(
            "Stock requested:",
            ticker
        )

        # --------------------------------
        # TRAIN MODEL + MAKE PREDICTION
        # --------------------------------

        result = train_model(ticker)

        # --------------------------------
        # SEND RESULT TO JAVASCRIPT
        # --------------------------------

        return jsonify(result)

    except Exception as e:

        print(
            "Prediction error:",
            str(e)
        )

        return jsonify({
            "error": str(e)
        }), 500


# --------------------------------
# START FLASK SERVER
# --------------------------------

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )