// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.static("public"));

// app.post("/predict", (req, res) => {
//     const { prices, k } = req.body;

//     if (!prices || prices.length < k) {
//         return res.json({ error: "Invalid input" });
//     }

//     let sum = 0;


//     for (let i = prices.length - k; i < prices.length; i++) {
//         sum += prices[i];
//     }

//     let prediction = sum / k;

//     let trend = prices[prices.length - 1] > prediction ?
//         "Uptrend" :
//         "Downtrend";

//     res.json({
//         prediction: prediction.toFixed(2),
//         trend
//     });
// });


// app.get("/stocks", (req, res) => {
//     let stocks = [
//         { name: "RELIANCE", prices: [2400, 2420, 2450, 2500] },
//         { name: "TCS", prices: [3500, 3480, 3490, 3510] },
//         { name: "INFY", prices: [1500, 1510, 1520, 1535] },
//         { name: "HDFC", prices: [1600, 1580, 1570, 1590] },
//         { name: "ITC", prices: [420, 425, 430, 435] },

//         { name: "WIPRO", prices: [420, 415, 418, 422] },
//         { name: "HCLTECH", prices: [1100, 1120, 1115, 1130] },
//         { name: "LT", prices: [2900, 2920, 2950, 2975] },
//         { name: "SBIN", prices: [600, 610, 605, 620] },
//         { name: "AXISBANK", prices: [900, 910, 920, 930] },

//         { name: "KOTAKBANK", prices: [1800, 1820, 1810, 1835] },
//         { name: "ICICIBANK", prices: [950, 960, 970, 980] },
//         { name: "BAJFINANCE", prices: [7000, 7100, 7200, 7300] },
//         { name: "MARUTI", prices: [10000, 10150, 10200, 10300] },
//         { name: "TITAN", prices: [3000, 3050, 3100, 3150] },
//     ];

//     res.json(stocks);
// });

// app.listen(3000, () => {
//     console.log("Server running on http://localhost:3000");
// });

const express = require("express");
const cors = require("cors");

const app = express();

// import routes
const stockRoutes = require("./routes/stockRoutes");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// use routes
app.use("/", stockRoutes);

// start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});