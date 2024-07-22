const { getFlightsAI } = require('../services/flightAIService');

const chatController = async (req, res) => {
  try {
    let context = [
      {
        role: 'system',
        content: 'You are a vacation planner and helper that gives information about vacations and helps in booking flights.'
      }
    ];

    const userMessage = req.body.message;
    context.push({
      role: 'user',
      content: userMessage
    });

    let aiResponse = await getFlightsAI(context);
    context.push(aiResponse);

    // Keep interacting until a final answer is provided
    while (true) {
      const userNextMessage = req.body.message;
      context.push({
        role: 'user',
        content: userNextMessage
      });

      aiResponse = await getFlightsAI(context);
      context.push(aiResponse);

      if (aiResponse.finish_reason !== 'tool_calls') {
        break;
      }
    }

    res.json({ response: aiResponse.content });
  } catch (error) {
    res.status(500).json({ error: error.message || 'An error occurred during the chat interaction.' });
  }
};

module.exports = {
  chatController
};