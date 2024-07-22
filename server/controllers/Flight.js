const flightService = require('../services/Flight');


const autocompleteController = async (req, res) => {
  try {
    const { keyword } = req.query;
    const suggestions = await flightService.autocompleteLocations(keyword);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred during the autocomplete request." });
  }
};

const getAirportsController = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    if (!keyword) {
      return res.status(400).json({ error: "Keyword query parameter is required." });
    }
    console.log(keyword)
    const airports = await flightService.getAirports(keyword);
    res.json(airports);
  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred during the airport search." });
  }
};


const getFlightsController = async (req, res) => {
  try {
    const { originLocationCode, destinationLocationCode, departureDate, adults, returnDate } = req.query;

    if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
      return res.status(400).json({ error: "Missing required query parameters. originLocationCode, destinationLocationCode, departureDate, and adults are required." });
    }

    const searchParams = {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      ...(returnDate && { returnDate })
    };
    const flights = await flightService.getFlights(searchParams);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred during the flight search." });
  }
};




const getFlightOfferPricingController = async (req, res) => {
  try {
    const { flightOffers } = req.body;

    if (!flightOffers || flightOffers.length === 0) {
      return res.status(400).json({ error: "Invalid input: Flight offers are required." });
    }

    const pricing = await flightService.getFlightOffersPricing(flightOffers);

    res.json(pricing);
  } catch (error) {
    console.error("Error in getFlightOfferPricingController:", error);
    res.status(500).json({ error: error.message || "An error occurred while fetching flight offer pricing." });
  }
};



const bookFlightController = async (req, res) => {
  try {
    const { flightOffer, travelerInfo, contacts, userId } = req.body;

    if (!flightOffer || !travelerInfo || travelerInfo.length === 0 || !contacts || contacts.length === 0 || !userId) {
      return res.status(400).json({ error: "Missing required booking details: flightOffer, travelerInfo, contacts, and userId are required." });
    }

    const bookingDetails = await flightService.confirmBooking({ flightOffer, travelerInfo, contacts, userId });

    if (bookingDetails) {
      res.json({
        message: "Flight booking confirmed",
        bookingDetails
      });
    } else {
      res.status(400).json({
        error: "Flight booking could not be confirmed",
        details: bookingDetails
      });
    }
  } catch (error) {
    console.error("Error in bookFlightController:", error);
    res.status(500).json({ error: error.message || "An error occurred while processing the flight booking." });
  }
};





const payFlightController = async (req, res) => {
  try {
    const { email, amountInMUR } = req.body;

    if (!email || !amountInMUR) {
      return res.status(400).json({ error: "Missing required fields: email and amountInMUR are required." });
    }

    const paymentUrl = await flightService.payFlight(email, amountInMUR);
    res.json({ url: paymentUrl });
  } catch (error) {
    console.error("Error in payFlightController:", error);
    res.status(500).json({ error: error.message || "An error occurred while processing the payment." });
  }
};

const getFlightBookingsByUserIdController = async (req, res) => {
  const userId = req.params.userId;

  try {
    const bookings = await flightService.getFlightBookingsByUserId(userId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getFlightBookingsByUserIdController:", error);
    res.status(500).json({ error: error.message || "An error occurred while fetching the bookings." });
  }
};


module.exports = {
  autocompleteController,
  getAirportsController,
  getFlightsController,
  getFlightOfferPricingController,
  bookFlightController,
  payFlightController,
  getFlightBookingsByUserIdController,
};
