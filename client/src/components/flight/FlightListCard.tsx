"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Flight, FlightPricingProps } from '@/helper/types';
import { fetchFlightPricing } from '@/services/flight';
import { Luggage, ChefHat } from 'lucide-react';
import { convertEuroToMUR } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Loading from '@/components/Loading';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FlightListCardProps {
  flight: Flight;
}

export default function FlightListCard({ flight }: FlightListCardProps) {
  const { itineraries, price, numberOfBookableSeats, travelerPricings, offerType } = flight;
  const { total } = price;
  const totalMUR = convertEuroToMUR(parseFloat(total));
  const firstSegment = itineraries[0].segments[0];
  const lastSegment = itineraries[0].segments[itineraries[0].segments.length - 1];
  const [loading, setLoading] = useState(false);
  const [dialogContent, setDialogContent] = useState({ status: '', message: '' });
  const router = useRouter();

  const handleBookNow = async () => {
    setLoading(true);
    try {
      const flightOffers: FlightPricingProps[] = [flight as FlightPricingProps];
      const response = await fetchFlightPricing(flightOffers);
      localStorage.setItem('flightPricingData', JSON.stringify(response.data));
      setDialogContent({ status: 'success', message: 'Flight pricing retrieved successfully!..' });
      router.push('/flight/preview');
    } catch (error) {
      setDialogContent({ status: 'error', message: 'Failed to retrieve flight pricing. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl border rounded-lg shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
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
            <div className="flex flex-col">
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                {firstSegment.carrierName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {firstSegment.departure.iataCode} - {lastSegment.arrival.iataCode}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Price</div>
            <div className="font-semibold text-lg text-gray-900 dark:text-white">
              Rs {totalMUR.toFixed(2)}
            </div>
            {offerType && (
              <span className={`px-2 py-1 mt-1 text-sm font-medium rounded-full ${offerType === 'Cheapest' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {offerType}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">Flight Duration</span>
              <span className="font-semibold">{itineraries[0].duration.replace('PT', '').toLowerCase()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">Bookable Seats</span>
              <span className="font-semibold">{numberOfBookableSeats}</span>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="default" onClick={handleBookNow} disabled={loading}>
                Check Flight
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Flight Pricing</DialogTitle>
                <DialogDescription>
                  {loading ? 'Fetching flight pricing, please wait...' : dialogContent.message}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>View More</AccordionTrigger>
            <AccordionContent>
              {itineraries.map((itinerary, index) => (
                <div key={index} className="mb-6">
                  <div className="font-semibold mb-2">
                    {index === 0 ? "Departure" : "Return"}
                  </div>
                  {itinerary.segments.map((segment, segIndex) => (
                    <div key={segIndex} className="flex items-center justify-between mb-4 p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
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
                        <div>
                          <div className="font-semibold">{segment.carrierName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{segment.carrierCode}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-right">
                        <div className="font-semibold">
                          <span>{new Date(segment.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> - <span>{new Date(segment.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {segment.departure.iataCode} - {segment.arrival.iataCode}
                        </div>
                        <div className="font-semibold">
                          {segment.numberOfStops === 0 ? "Nonstop" : `${segment.numberOfStops} stop(s)`}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {segment.aircraft.name}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-4">
                      {travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags && (
                        <div className="flex items-center gap-2">
                          <Luggage className="w-5 h-5 text-gray-500" />
                          <span>Checked Bag</span>
                        </div>
                      )}
                      {travelerPricings[0].fareDetailsBySegment[0].amenities?.some(amenity => amenity.amenityType === 'MEAL') && (
                        <div className="flex items-center gap-2">
                          <ChefHat className="w-5 h-5 text-gray-500" />
                          <span>Meal</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <div className="font-semibold text-2xl">Rs {totalMUR.toFixed(2)}</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
