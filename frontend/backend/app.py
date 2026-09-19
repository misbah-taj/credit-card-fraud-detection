from flask import Flask, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

model = joblib.load("fraud_model.pkl")
scaler = joblib.load("scaler.pkl")


@app.route("/")
def home():
    return "Credit Card Fraud Detection API is running!"


@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.json

        print("Received data:", data)

        df = pd.DataFrame([data])

        print("Received columns:", list(df.columns))
        print("Model columns:", list(model.feature_names_in_))

        # Arrange columns exactly like the model
        df = df[model.feature_names_in_]

        # Scale Amount
        df["Amount"] = scaler.transform(df[["Amount"]])

        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0][1]

        if prediction == 1:
            result = "Fraudulent Transaction"
        else:
            result = "Legitimate Transaction"

        return jsonify({
            "prediction": int(prediction),
            "result": result,
            "fraud_probability": round(float(probability) * 100, 2)
        })

    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=False)