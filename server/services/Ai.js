const OpenAI = require('openai');
const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const flightService = require('../services/Flight');

async function callOpenAIWithTools(context) {
  // Configure chat tools (first openAI call)
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: context,
    tools: [
      {
        type: 'function',
        function: {
          name: 'getFlights',
          description: 'Fetch flight options based on search parameters',
          parameters: {
            type: 'object',
            properties: {
              originLocationCode: { type: 'string', description: 'Origin airport code' },
              destinationLocationCode: { type: 'string', description: 'Destination airport code' },
              departureDate: { type: 'string', description: 'Departure date in YYYY-MM-DD format' },
              adults: { type: 'integer', description: 'Number of adult passengers' },
              returnDate: { type: 'string', description: 'Return date in YYYY-MM-DD format' }
            },
            required: ['originLocationCode', 'destinationLocationCode', 'departureDate', 'adults']
          }
        }
      }
    ],
    tool_choice: 'auto'
  });


  const willInvokeFunction = response.choices[0].finish_reason === 'tool_calls';
  const toolCall = response.choices[0].message.tool_calls ? response.choices[0].message.tool_calls[0] : null;

  if (willInvokeFunction && toolCall) {
    const toolName = toolCall.function.name;

    if (toolName === 'getFlights') {
      const rawArgument = toolCall.function.arguments;
      const parsedArguments = JSON.parse(rawArgument);
      const searchParams = {
        originLocationCode: parsedArguments.originLocationCode,
        destinationLocationCode: parsedArguments.destinationLocationCode,
        departureDate: parsedArguments.departureDate,
        adults: parsedArguments.adults,
        ...(parsedArguments.returnDate && { returnDate: parsedArguments.returnDate })
      };
      const flights = await flightService.getFlights(searchParams);

      if (flights && flights.data && Array.isArray(flights.data)) {
        const firstFlight = flights.data[0];

        const toolResponse = `Here is the first flight option:\n${JSON.stringify(firstFlight, null, 2)}`;

        context.push(response.choices[0].message);
        context.push({
          role: 'tool',
          content: toolResponse,
          tool_call_id: toolCall.id
        });
      } else {
        throw new Error('Expected flights to be an array');
      }
    }
  }

  const secondResponse = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: context
  });

  return secondResponse.choices[0].message;
}

module.exports = {
  callOpenAIWithTools
};
