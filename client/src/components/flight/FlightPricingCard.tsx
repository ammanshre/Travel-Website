"use client";

import React, { useEffect, useState } from 'react';

import { PlaneTakeoff, PlaneLanding, Luggage, ChefHat } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FlightPricingProps } from '@/helper/types';
import { convertEuroToMUR } from '@/lib/utils';
import { useRouter } from 'next/navigation';


interface FlightPricingCardProps {
  flightOffer: FlightPricingProps;
}

export default function FlightPricingCard({ flightOffer }: FlightPricingCardProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);
  if (!flightOffer) {
    return <div>No flight offer available</div>;
  }


  const { itineraries, price, numberOfBookableSeats, travelerPricings, offerType } = flightOffer;

  if (!price || !itineraries || itineraries.length === 0) {
    return <div>Price or itineraries information is missing</div>;
  }

  const { total, base, fees } = price;
  const firstSegment = itineraries[0]?.segments[0];
  const lastSegment = itineraries[itineraries.length - 1]?.segments[itineraries[itineraries.length - 1].segments.length - 1];

  const co2Color = (weight: number) => weight < 100 ? 'text-green-500' : 'text-red-500';


  const handleBookNow = async () => {

    if (isClient) {
      localStorage.setItem("flightOfferForBooking", JSON.stringify(flightOffer));
      localStorage.setItem("bookingPrice", JSON.stringify(total));
    }
    router.push('/flight/checkout');
  }


  return (
    <Card className="w-screen max-w-2xl border rounded-lg shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {firstSegment?.airlineLogo && (
              <img
                alt="Airline Logo"
                className="rounded-full"
                height={40}
                src={firstSegment.airlineLogo}
                style={{
                  aspectRatio: "40/40",
                  objectFit: "cover",
                }}
                width={40}
              />
            )}
            <div className="flex flex-col">
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                {firstSegment?.carrierName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {firstSegment?.departure.iataCode} ({firstSegment?.departure.countryName}) - {lastSegment?.arrival.iataCode} ({lastSegment?.arrival.countryName})
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Price</div>
            <div className="font-semibold text-lg text-gray-900 dark:text-white">
              Rs {convertEuroToMUR(parseFloat(total)).toFixed(2)}
            </div>
            {offerType && (
              <span className={`px-2 py-1 mt-1 text-sm font-medium rounded-full ${offerType === 'Cheapest' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {offerType}
              </span>
            )}
            <Button variant="default" className="mt-4 w-full" onClick={handleBookNow}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {itineraries.map((itinerary, index) => (
          <div key={index} className="mb-6">
            <div className="font-semibold mb-2">
              {index === 0 ? "Departure" : "Return"}
            </div>
            {itinerary.segments.map((segment, segIndex) => (
              <div key={segIndex} className="flex flex-col mb-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {segment.airlineLogo && (
                      <img
                        alt="Airline Logo"
                        className="rounded-full"
                        height={40}
                        src={segment.airlineLogo}
                        style={{
                          aspectRatio: "40/40",
                          objectFit: "cover",
                        }}
                        width={40}
                      />
                    )}
                    <div>
                      <div className="font-semibold">{segment.carrierName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Carrier Code: {segment.carrierCode}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <div className="font-semibold">
                      <span><PlaneTakeoff className="inline-block mr-1" />{new Date(segment.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> - <span><PlaneLanding className="inline-block mr-1" />{new Date(segment.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {segment.departure.iataCode} ({segment.departure.countryName}) - {segment.arrival.iataCode} ({segment.arrival.countryName})
                    </div>
                    <div className="font-semibold">
                      {segment.numberOfStops === 0 ? "Nonstop" : `${segment.numberOfStops} stop(s)`}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span>{segment.aircraft.name} ({segment.aircraft.code})</span>
                    </div>
                    <Badge variant="secondary" className={`text-sm ${co2Color(segment.co2Emissions[0].weight)}`} >
                      CO2 Emissions: {segment.co2Emissions[0].weight} {segment.co2Emissions[0].weightUnit}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Fare Details:</div>
                  <ul className="list-disc list-inside text-sm">
                    <li>Cabin: {travelerPricings[0].fareDetailsBySegment[segIndex]?.cabin}</li>
                    <li>Fare Basis: {travelerPricings[0].fareDetailsBySegment[segIndex]?.fareBasis}</li>
                    <li>Branded Fare: {travelerPricings[0].fareDetailsBySegment[segIndex]?.brandedFare}</li>
                    <li>Class: {travelerPricings[0].fareDetailsBySegment[segIndex]?.class}</li>
                    <li>Included Checked Bags: <Luggage className="inline-block w-5 h-5 text-gray-500" /> {travelerPricings[0].fareDetailsBySegment[segIndex]?.includedCheckedBags.quantity}</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ))}
        <Separator className="my-4" />
        <div className="mt-4">
          <div className="font-semibold mb-2">Price Breakdown:</div>
          <ul className="list-disc list-inside text-sm">
            <li>Base Price: Rs {convertEuroToMUR(parseFloat(base)).toFixed(2)}</li>
            {fees.map((fee, index) => (
              <li key={index}>{fee.type}: Rs {convertEuroToMUR(parseFloat(fee.amount)).toFixed(2)}</li>
            ))}
            <li>Total Price: Rs {convertEuroToMUR(parseFloat(total)).toFixed(2)}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
