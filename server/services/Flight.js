require('dotenv').config();
const Amadeus = require("amadeus");
const countriesList = require('countries-list');
const fetch = require('node-fetch');
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const FlightBooking = require("../models/FlightBooking");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const amadeus = new Amadeus({
  clientId: 'IRzZGIP6Cpofb1JALx9idthdO6UZJmH7',
  clientSecret: '6ajvPXZG4uOrgg24'
});

const getCountryName = (code) => {
  const country = countriesList.countries[code];
  return country ? country.name : code;
};

const parseDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?/);
  let minutes = 0;
  if (match[1]) minutes += parseInt(match[1], 10) * 60;
  if (match[2]) minutes += parseInt(match[2], 10);
  return minutes;
};

const autocompleteLocations = async (keyword) => {
  try {
    if (!keyword) {
      throw new Error("Keyword is required for the autocomplete service.");
    }



    const response = await amadeus.referenceData.locations.get({
      keyword: keyword,
      subType: "ANY",
    });

    return response.data;
  } catch (error) {
    console.error("Error in autocompleteLocations:", error.message || error.response);
    throw error; // Or return an appropriate error response
  }
};



const getAirports = async (params) => {
  try {
    const keyword = params;
    if (!keyword) {
      throw new Error("Keyword is required to search for airports.");
    }
    const queryParams = {
      keyword: params,
      subType: "AIRPORT",
    };

    const response = await amadeus.referenceData.locations.get(queryParams);
    return response.data;
  } catch (error) {
    console.error("Error in getAirports:", error.message || error.response);
    throw error;
  }
};

const getFlights = async (params) => {
  try {
    const { originLocationCode, destinationLocationCode, departureDate, adults, returnDate } = params;

    if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
      throw new Error("Missing required parameters for flight search.");
    }

    const queryParams = {
      originLocationCode: originLocationCode,
      destinationLocationCode: destinationLocationCode,
      departureDate: departureDate,
      adults: adults,
      max: 250,
      ...(returnDate && { returnDate: returnDate })
    };

    const response = await amadeus.shopping.flightOffersSearch.get(queryParams); 4


    const data = JSON.parse(response.body);
    if (!data.data || data.data.length === 0) {
      res.status(404).json({ message: "No flights available for the current search" });
      return;
    }
    if (!data.data || data.data.length === 0) {
      return { message: "No flights available for the current search" };
    }

    let cheapestFlight = data.data[0];
    let fastestFlight = data.data[0];

    data.data.forEach((flight) => {
      if (parseFloat(flight.price.total) < parseFloat(cheapestFlight.price.total)) {
        cheapestFlight = flight;
      }

      const flightDuration = parseDuration(flight.itineraries[0].duration);
      const fastestFlightDuration = parseDuration(fastestFlight.itineraries[0].duration);


      if (flightDuration < fastestFlightDuration) {
        fastestFlight = flight;
      }
    });

    data.data.forEach((flight) => {
      if (flight === cheapestFlight) {
        flight["offer-type"] = "Cheapest";
      } else if (flight === fastestFlight) {
        flight["offer-type"] = "Fastest";
      } else {
        flight["offer-type"] = "normal";
      }
    });
    const airlineCodes = Array.from(
      new Set(
        data.data.flatMap((offer) =>
          offer.itineraries.flatMap((itinerary) =>
            itinerary.segments.map((segment) => segment.carrierCode)
          )
        )
      )
    );

    const airlineLogoUrls = await Promise.all(
      airlineCodes.map(async (code) => {
        const logoResponse = await fetch(
          `https://content.airhex.com/content/logos/airlines_${code}_50_50_s.png?apikey=${process.env.YOUR_API_KEY}`
        );
        return { code, logoUrl: logoResponse.url };
      })
    );

    data.data.forEach((flight) => {
      flight.itineraries.forEach((itinerary) => {
        itinerary.segments.forEach((segment) => {
          const logoObj = airlineLogoUrls.find(
            (logo) => logo.code === segment.carrierCode
          );
          segment.airlineLogo = logoObj ? logoObj.logoUrl : "";
        });
      });
    });


    Object.entries(data.dictionaries.locations).forEach(([code, location]) => {
      location.cityName = location.cityCode;
      location.countryName = getCountryName(location.countryCode);
    });

    data.data.forEach((flight) => {
      flight.itineraries.forEach((itinerary) => {
        itinerary.segments.forEach((segment) => {
          if (segment.aircraft && segment.aircraft.code) {
            const aircraftCode = segment.aircraft.code;
            segment.aircraft.name = data.dictionaries.aircraft[aircraftCode] || aircraftCode;
          }

          if (segment.carrierCode) {
            const carrierCode = segment.carrierCode;
            segment.carrierName = data.dictionaries.carriers[carrierCode] || carrierCode;
          }

          if (segment.operating && segment.operating.carrierCode) {
            const operatingCarrierCode = segment.operating.carrierCode;
            segment.operating.carrierName = data.dictionaries.carriers[operatingCarrierCode] || operatingCarrierCode;
          }


          const departureIata = segment.departure.iataCode;
          const arrivalIata = segment.arrival.iataCode;
          segment.departure.countryName = data.dictionaries.locations[departureIata].countryName;
          segment.arrival.countryName = data.dictionaries.locations[arrivalIata].countryName;
        });
      });
    });

    return data;
  } catch (error) {
    console.error("Error in getFlights:", error.message || error.response);
    throw error;
  }
};

const getFlightOffersPricing = async (flightOffers) => {
  if (!flightOffers || flightOffers.length === 0) {
    throw new Error("Invalid input: No flight offers provided.");
  }

  try {
    const requestData = {
      data: {
        type: "flight-offers-pricing",
        flightOffers,
      },
    };


    const response = await amadeus.shopping.flightOffers.pricing.post(JSON.stringify(requestData));
    const data = JSON.parse(response.body);

    const airlineCodes = new Set(data.data.flightOffers.flatMap(offer =>
      offer.itineraries.flatMap(itinerary =>
        itinerary.segments.map(segment => segment.carrierCode)
      )
    ));

    const airlineLogoUrls = await Promise.all(Array.from(airlineCodes).map(async (code) => {
      const logoResponse = await fetch(`https://content.airhex.com/content/logos/airlines_${code}_50_50_s.png?apikey=${process.env.YOUR_API_KEY}`);
      if (!logoResponse.ok) throw new Error(`Failed to fetch logo for airline code: ${code}`);
      return { code, logoUrl: logoResponse.url };
    }));

    data.data.flightOffers.forEach(flight => {
      flight.itineraries.forEach(itinerary => {
        itinerary.segments.forEach(segment => {
          const logoObj = airlineLogoUrls.find(logo => logo.code === segment.carrierCode);
          segment.airlineLogo = logoObj ? logoObj.logoUrl : "";

          const departureLocation = data.dictionaries.locations[segment.departure.iataCode];
          const arrivalLocation = data.dictionaries.locations[segment.arrival.iataCode];
          segment.departure.countryName = getCountryName(departureLocation.countryCode);
          segment.arrival.countryName = getCountryName(arrivalLocation.countryCode);
        });
      });
    });

    return data;
  } catch (error) {
    console.error("Error in getFlightOffersPricing:", error.message);
    throw error;
  }
};


const transporter = nodemailer.createTransport(smtpTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.EMAIL,
  },
}));

const sendBookingEmail = async (contact, bookingDetails) => {
  try {
    const templatePath = path.join(__dirname, '../email/flight_confirm.html');
    const templateFile = fs.readFileSync(templatePath, 'utf-8');
    const emailContent = ejs.render(templateFile, { bookingDetails });

    if (!contact.emailAddress) {
      console.error("Contact email is undefined or empty");
      throw new Error("Contact email is undefined or empty");
    }

    console.log("Sending email to:", contact.emailAddress);

    const mailOptions = {
      from: "erkadoovince@gmail.com",
      to: contact.emailAddress,
      subject: "Booking Confirmation - MoTravel Flight Booking",
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", contact.emailAddress);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const generateTransactionId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TXN-';
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const confirmBooking = async ({ flightOffer, travelerInfo, contacts, userId }) => {
  if (!flightOffer || !travelerInfo || !contacts || contacts.length === 0) {
    return { message: "Invalid input" };
  }

  try {
    contacts.forEach(contact => {
      if (typeof contact.address.lines === 'string') {
        contact.address.lines = [contact.address.lines];
      }
    });

    const travelers = Array.isArray(travelerInfo) ? travelerInfo : [travelerInfo];
    const requestData = {
      data: {
        type: "flight-order",
        flightOffers: [flightOffer],
        travelers: travelers,
        contacts: contacts,
        remarks: {
          general: [
            {
              subType: "GENERAL_MISCELLANEOUS",
              text: "ONLINE BOOKING FROM INCREIBLE VIAJES"
            }
          ]
        },
        ticketingAgreement: {
          option: "DELAY_TO_CANCEL",
          delay: "6D"
        },
      },
    };

    const response = await amadeus.booking.flightOrders.post(JSON.stringify(requestData));
    const bookingData = JSON.parse(response.body);

    const contactInfo = contacts[0];
    const userName = `${contactInfo.addresseeName.firstName} ${contactInfo.addresseeName.lastName}`;
    const userEmail = contactInfo.emailAddress;

    const newBooking = new FlightBooking({
      transactionId: generateTransactionId(),
      user: {
        id: userId,
        name: userName,
        email: userEmail,
      },
      itineraries: flightOffer.itineraries,
      price: {
        currency: flightOffer.price.currency,
        total: parseFloat(flightOffer.price.total),
        base: parseFloat(flightOffer.price.base),
      },
      isPaid: true,
    });

    await newBooking.save();
    console.log("Booking saved successfully:", newBooking);

    await sendBookingEmail(contacts[0], bookingData);
    console.log("Booking email sent successfully");

    return bookingData;
  } catch (error) {
    console.error("Error in confirmBooking:", error);
    return { message: "Error booking flight", error: error.message };
  }
};


const payFlight = async (email, amountInMUR) => {

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Flight Booking Payment',
            },
            unit_amount: Math.round(amountInMUR * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      mode: 'payment',
      success_url: process.env.FLIGHT_SUCCESS_URL,
      cancel_url: process.env.FLIGHT_CANCEL_URL,
    });

    return session.url;
  } catch (error) {
    throw new Error('Failed to create checkout session: ' + error.message);
  }
};

const getFlightBookingsByUserId = async (userId) => {
  try {

    console.log("Fetching bookings for user:", userId);
    const bookings = await FlightBooking.find({ 'user.id': userId });
    const testBookings = await FlightBooking.find({});
    console.log("Test Bookings found:", testBookings);
    console.log("Bookings found:", bookings.length);
    
    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};



module.exports = {
  autocompleteLocations,
  getAirports,
  getFlights,
  getFlightOffersPricing,
  confirmBooking,
  payFlight,
  getFlightBookingsByUserId,
};
