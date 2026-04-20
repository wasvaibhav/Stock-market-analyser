const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve frontend

// 🎯 Prediction API (DAA logic)
app.post("/predict", (req, res) => {
    const { prices, k } = req.body;

    if (!prices || prices.length < k) {
        return res.json({ error: "Invalid input" });
    }

    let sum = 0;


    for (let i = prices.length - k; i < prices.length; i++) {
        sum += prices[i];
    }

    let prediction = sum / k;

    let trend = prices[prices.length - 1] > prediction ?
        "Downtrend" :
        "Uptrend";

    res.json({
        prediction: prediction.toFixed(2),
        trend
    });
});


app.get("/stocks", (req, res) => {
    let stocks = [
        { name: "RELIANCE", prices: [2400, 2420, 2450, 2500] },
        { name: "TCS", prices: [3500, 3480, 3490, 3510] },
        { name: "INFY", prices: [1500, 1510, 1520, 1535] },
        { name: "HDFC", prices: [1600, 1580, 1570, 1590] },
        { name: "ITC", prices: [420, 425, 430, 435] }
    ];

    res.json(stocks);
});

// start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});