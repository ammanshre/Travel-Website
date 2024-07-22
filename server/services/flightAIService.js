// flightAIService.js
const { callOpenAIWithTools } = require('./Ai');

async function getFlightsAI(context) {
  const initialContext = [
    {
      role: 'system',
      content: 'You are a vacation planner and helper that gives information about vacations and helps in booking flights.'
    },
    ...context
  ];

  const response = await callOpenAIWithTools(initialContext);
  return response;
}

module.exports = {
  getFlightsAI
};
