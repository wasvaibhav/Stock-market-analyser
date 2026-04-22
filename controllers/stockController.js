const stocks = [
    { name: "RELIANCE", prices: [2400, 2420, 2450, 2485, 2500, 2525, 2550] },
    { name: "TCS", prices: [3500, 3480, 3490, 3510, 3535, 3550, 3575] },
    { name: "INFY", prices: [1500, 1510, 1520, 1535, 1540, 1555, 1570] },
    { name: "HDFC", prices: [1600, 1580, 1570, 1590, 1605, 1610, 1620] },
    { name: "ITC", prices: [420, 425, 430, 435, 438, 442, 445] },
    { name: "WIPRO", prices: [420, 415, 418, 422, 426, 430, 434] },
    { name: "HCLTECH", prices: [1100, 1120, 1115, 1130, 1140, 1155, 1170] },
    { name: "LT", prices: [2900, 2920, 2950, 2975, 3000, 3020, 3050] },
    { name: "SBIN", prices: [600, 610, 605, 620, 625, 630, 640] },
    { name: "AXISBANK", prices: [900, 910, 920, 930, 935, 940, 950] },
    { name: "KOTAKBANK", prices: [1800, 1820, 1810, 1835, 1850, 1860, 1880] },
    { name: "ICICIBANK", prices: [950, 960, 970, 980, 990, 1000, 1010] },
    { name: "BAJFINANCE", prices: [7000, 7100, 7200, 7300, 7350, 7420, 7500] },
    { name: "MARUTI", prices: [10000, 10150, 10200, 10300, 10420, 10550, 10680] },
    { name: "TITAN", prices: [3000, 3050, 3100, 3150, 3180, 3220, 3270] }
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function forecastPrices(prices, days, k) {
    const simulated = [...prices];
    const result = [];

    for (let i = 0; i < days; i++) {
        const windowSize = Math.min(k, simulated.length);
        const recent = simulated.slice(simulated.length - windowSize);
        const average = recent.reduce((sum, price) => sum + price, 0) / windowSize;

        const momentum = simulated.length > 1
            ? simulated[simulated.length - 1] - simulated[simulated.length - 2]
            : 0;

        const next = Math.max(1, average + (momentum * 0.35));
        const rounded = Number(next.toFixed(2));

        simulated.push(rounded);
        result.push(rounded);
    }

    return result;
}

function getAnalytics(previous, forecast) {
    const current = previous[previous.length - 1];
    const finalForecast = forecast[forecast.length - 1];
    const movement = ((finalForecast - current) / current) * 100;
    const trend = movement >= 0 ? "Uptrend" : "Downtrend";

    const volatilityBase = previous.slice(-4);
    const mean = volatilityBase.reduce((sum, p) => sum + p, 0) / volatilityBase.length;
    const variance = volatilityBase.reduce((sum, p) => sum + ((p - mean) ** 2), 0) / volatilityBase.length;
    const volatilityPercent = (Math.sqrt(variance) / mean) * 100;

    let recommendation = "HOLD";
    if (movement >= 1.2) {
        recommendation = "BUY";
    } else if (movement <= -1.2) {
        recommendation = "SELL";
    }

    const confidence = Math.round(clamp(90 - (volatilityPercent * 2.5), 55, 92));

    let riskLevel = "Low";
    if (volatilityPercent > 2) {
        riskLevel = "High";
    } else if (volatilityPercent > 1) {
        riskLevel = "Medium";
    }

    return {
        trend,
        recommendation,
        confidence,
        riskLevel
    };
}

exports.predictStock = (req, res) => {
    const { company, mode = "price", days = 7, k = 3 } = req.body;
    const normalizedCompany = typeof company === "string" ? company.toUpperCase() : "";
    const stock = stocks.find((item) => item.name === normalizedCompany);

    if (!stock) {
        return res.json({ error: "Company not found" });
    }

    const safeDays = Math.max(1, Math.min(Number(days) || 7, 14));
    const safeWindow = Math.max(2, Math.min(Number(k) || 3, stock.prices.length));

    const predictedPrices = forecastPrices(stock.prices, safeDays, safeWindow);
    const analytics = getAnalytics(stock.prices, predictedPrices);

    if (mode === "trend") {
        return res.json({
            stock: stock.name,
            trend: analytics.trend,
            recommendation: analytics.recommendation,
            confidence: analytics.confidence,
            riskLevel: analytics.riskLevel
        });
    }

    return res.json({
        stock: stock.name,
        predictedPrices,
        trend: analytics.trend,
        recommendation: analytics.recommendation,
        confidence: analytics.confidence,
        riskLevel: analytics.riskLevel
    });
};

exports.getStocks = (req, res) => {
    res.json(stocks);
};