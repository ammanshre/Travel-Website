import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface FlightSegment {
  departure: {
    iataCode: string;
    countryName: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    countryName: string;
    at: string;
  };
  carrierCode: string;
  airlineLogo: string;
  duration: string;
  numberOfStops: number;
}

interface Itinerary {
  segments: FlightSegment[];
}

interface FlightBooking {
  transactionId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  itineraries: Itinerary[];
  price: {
    currency: string;
    total: number;
    base: number;
  };
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BookingCardProps {
  booking: FlightBooking;
}

export default function FlightBookingCard({ booking }: BookingCardProps) {
  return (
    <Card className="w-full max-w-5xl mx-auto my-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-6">
        <div className="relative">
          <img
            alt="Airline Logo"
            className="rounded-lg shadow-md w-full h-auto md:h-52"
            src={booking.itineraries[0].segments[0].airlineLogo}
            style={{
              objectFit: "cover",
            }}
          />
          <Badge className={`absolute top-2 right-2 px-3 py-1 text-sm font-medium flex items-center gap-2 ${booking.isPaid ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {booking.isPaid && <CheckCircle className="w-4 h-4" />}
            {booking.isPaid ? "Paid" : "Unpaid"}
          </Badge>
        </div>
        <div className="grid gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 border-b pb-2">
            <div className="text-sm font-medium">Transaction ID:</div>
            <div>{booking.transactionId}</div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 border-b pb-2">
            <div className="text-sm font-medium">User:</div>
            <div>{booking.user.name}</div>
          </div>
          {booking.itineraries.map((itinerary, index) => (
            <div key={index} className="flex flex-col gap-4 border-b pb-2">
              <div className="text-sm font-medium">Itinerary {index + 1}:</div>
              {itinerary.segments.map((segment, segmentIndex) => (
                <div key={segmentIndex} className="flex flex-col md:flex-row md:items-center gap-2">
                  <div className="text-sm font-medium">Segment {segmentIndex + 1}:</div>
                  <div>
                    <div>
                      <strong>Departure:</strong> {segment.departure.iataCode} ({segment.departure.countryName}) at {new Date(segment.departure.at).toLocaleString()}
                    </div>
                    <div>
                      <strong>Arrival:</strong> {segment.arrival.iataCode} ({segment.arrival.countryName}) at {new Date(segment.arrival.at).toLocaleString()}
                    </div>
                    <div>
                      <strong>Carrier:</strong> {segment.carrierCode} <img src={segment.airlineLogo} alt="Airline Logo" className="inline-block w-6 h-6 ml-2" />
                    </div>
                    <div>
                      <strong>Duration:</strong> {segment.duration}
                    </div>
                    <div>
                      <strong>Number of Stops:</strong> {segment.numberOfStops}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="flex flex-col md:flex-row md:items-center gap-2 border-b pb-2">
            <div className="text-sm font-medium">Price:</div>
            <div>
              {booking.price.currency} {booking.price.total.toFixed(2)}
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 border-b pb-2">
            <div className="text-sm font-medium">Booked At:</div>
            <div>{new Date(booking.createdAt).toLocaleString()}</div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <div className="text-sm font-medium">Last Updated:</div>
            <div>{new Date(booking.updatedAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
