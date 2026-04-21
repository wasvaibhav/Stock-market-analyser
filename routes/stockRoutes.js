const express = require("express");
const router = express.Router();

const {
    predictStock,
    getStocks
} = require("../controllers/stockController");

router.post("/predict", predictStock);
router.get("/stocks", getStocks);

module.exports = router;