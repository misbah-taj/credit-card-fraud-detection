const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Middleware is running!");
});

app.post("/api/predict", async (req, res) => {
    try {
        console.log("Data received from frontend:");
        console.log(req.body);

        const response = await fetch("https://credit-card-fraud-detection-1-hzi2.onrender.com/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            throw new Error(`Flask returned status ${response.status}`);
        }

        const result = await response.json();

        console.log("Prediction received from Flask:");
        console.log(result);

        res.json(result);

    } catch (error) {
        console.error("Error connecting to Flask:", error);

        res.status(500).json({
            error: "Error connecting to Flask backend"
        });
    }
});

app.listen(3000, () => {
    console.log("Middleware running on http://localhost:3000");
});