"use client";

import { useEffect, useState } from 'react';
import FlightPricingCard from "@/components/flight/FlightPricingCard";
import { FlightPricingProps } from '@/helper/types';
import Navbar from '@/components/navbar';

export default function FlightPreviewPage() {
  const [flightOffer, setFlightOffer] = useState<FlightPricingProps | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('flightPricingData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData && parsedData.flightOffers && parsedData.flightOffers.length > 0) {
        setFlightOffer(parsedData.flightOffers[0]);
      }
    }
  }, []);

  if (!flightOffer) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Flight Pricing</h1>
        </div>
        <div className='flex items-center justify-center flex-col'>
          <FlightPricingCard flightOffer={flightOffer} />
        </div>
      </div>
    </div>

  );
}
