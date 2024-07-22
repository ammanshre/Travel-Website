"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { convertEuroToMUR } from '@/lib/utils';
import { PlaneTakeoff, PlaneLanding } from 'lucide-react';
import { FlightPricingProps } from '@/helper/types';

interface FlightSuccessProps {
  flightOffer: FlightPricingProps;
}

export default function FlightSuccess() {
  const router = useRouter();
  const [flightOffer, setFlightOffer] = useState<FlightPricingProps | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFlightOffer = localStorage.getItem("flightOfferForBooking");
      if (storedFlightOffer) {
        setFlightOffer(JSON.parse(storedFlightOffer));
      }
    }
  }, []);

  if (!flightOffer) {
    return <div>No flight offer available</div>;
  }

  const { itineraries, price, offerType } = flightOffer;

  if (!price || !itineraries || itineraries.length === 0) {
    return <div>Price or itineraries information is missing</div>;
  }

  const { total } = price;
  const firstSegment = itineraries[0]?.segments[0];
  const lastSegment = itineraries[itineraries.length - 1]?.segments[itineraries[itineraries.length - 1].segments.length - 1];

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
            <Badge variant="default" className="mt-2 text-green-800 bg-green-100">
              Paid
            </Badge>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
