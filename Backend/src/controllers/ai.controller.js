const generateResponse = require("../services/ai.service");

const aiReview = async (req, res) => {
  try {
    const code = req.body.code;

    if (!code) {
      return res.status("400").json({error: "Code is required"});
    }
    const response = await generateResponse(code);

    return res.json({ reply: response });
  } catch (error) {
    console.log("Controller error:", error.message)
    return res.status(500).json({ error: "Something went wrong with AI service", details: error.message})
  }
};

module.exports = aiReview;