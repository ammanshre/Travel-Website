// types.ts
export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
    countryName: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
    countryName: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
    name: string;
  };
  operating?: {
    carrierCode: string;
    carrierName: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
  co2Emissions: {
    weight: number;
    weightUnit: string;
  }[];
  blacklistedInEU: boolean;
  airlineLogo: string;
  carrierName: string;
}

export interface Itinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  fees: { amount: string; type: string }[];
  grandTotal: string;
  additionalServices?: { amount: string; type: string }[];
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: {
    currency: string;
    total: string;
    base: string;
  };
  fareDetailsBySegment: {
    segmentId: string;
    cabin: string;
    fareBasis: string;
    brandedFare: string;
    brandedFareLabel: string;
    class: string;
    includedCheckedBags: {
      quantity: number;
    };
    amenities: {
      description: string;
      isChargeable: boolean;
      amenityType: string;
      amenityProvider: {
        name: string;
      };
    }[];
  }[];
}

export interface Flight {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  lastTicketingDateTime: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
  offerType: string;
}

export interface FlightPricingProps {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  lastTicketingDateTime: string;
  numberOfBookableSeats: number;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
        countryName: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
        countryName: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
        name: string;
      };
      operating?: {
        carrierCode: string;
        carrierName: string;
      };
      duration: string;
      id: string;
      numberOfStops: number;
      co2Emissions: {
        weight: number;
        weightUnit: string;
      }[];
      blacklistedInEU: boolean;
      airlineLogo: string;
      carrierName: string;
    }>;
  }>;
  price: {
    currency: string;
    total: string;
    base: string;
    fees: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
    additionalServices?: Array<{
      amount: string;
      type: string;
    }>;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      brandedFare: string;
      brandedFareLabel: string;
      class: string;
      includedCheckedBags: {
        quantity: number;
      };
      amenities?: Array<{
        description: string;
        isChargeable: boolean;
        amenityType: string;
        amenityProvider: {
          name: string;
        };
      }>;
    }>;
  }>;
  offerType: string;
}

export interface PriceBooking {
  currency: string;
  total: number; // Change from string to number
  base: number;
}

export interface FlightBooking {
  transactionId: string;
  user: {
      id: string;
      name: string;
      email: string;
  };
  itineraries: Itinerary[];
  price: PriceBooking;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}


