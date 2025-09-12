const express = require("express")
const router = express.Router();
const aiReview = require("../controllers/ai.controller")

router.post('/get-response', aiReview);


module.exports = router;