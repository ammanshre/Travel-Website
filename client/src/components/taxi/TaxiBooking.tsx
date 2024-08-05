"use client";

import React from 'react';
import { Card } from '@/components/ui/card';

interface Location {
  type: string;
  coordinates: number[];
  address: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Taxi {
  _id: string;
  owner: string; // Update this to match the new interface
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  capacity: number;
  ratePerKm: number;
  available: boolean;
  location: Location;
  city: {
    _id: string;
    city: string;
    country: string;
    admin_name: string;
    lat: string;
    lng: string;
    population: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TaxiBooking {
  _id: string;
  user: User;
  taxi: Taxi;
  pickupLocation: Location;
  dropoffLocation: Location;
  fare: number;
  distance: number;
  bookingStatus: string;
  bookingTime: string;
  createdAt: string;
  updatedAt: string;
}

interface TaxiBookingDetailsProps {
  booking: TaxiBooking;
}

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const TaxiBookingDetails: React.FC<TaxiBookingDetailsProps> = ({ booking }) => {
  return (

    <div className="max-w-4xl mx-auto p-6 md:p-8 lg:p-10">
      <Card className='p-3'>
        <div className="grid gap-8">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Taxi Booking Details</h1>
            
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Pickup</div>
                <div className="font-medium">{booking.pickupLocation.address}</div>
              </div>
              <div className="grid gap-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Dropoff</div>
                <div className="font-medium">{booking.dropoffLocation.address}</div>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="text-lg font-bold">Taxi Details</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="grid gap-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Make</div>
                <div className="font-medium">{booking.taxi.make}</div>
              </div>
              <div className="grid gap-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Model</div>
                <div className="font-medium">{booking.taxi.model}</div>
              </div>
              <div className="grid gap-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Year</div>
                <div className="font-medium">{booking.taxi.year}</div>
              </div>
              <div className="grid gap-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">License Plate</div>
                <div className="font-medium">{booking.taxi.licensePlate}</div>
              </div>
              <div className="grid gap-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Color</div>
                <div className="font-medium">{booking.taxi.color}</div>
              </div>
              <div className="grid gap-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Capacity</div>
                <div className="font-medium">{booking.taxi.capacity} passengers</div>
              </div>
              <div className="grid gap-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Rate per km</div>
                <div className="font-medium">Rs {booking.taxi.ratePerKm.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="text-lg font-bold">Booking Details</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="grid gap-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Distance</div>
                <div className="font-medium">{booking.distance} km</div>
              </div>
              <div className="grid gap-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Fare</div>
                <div className="font-medium">Rs {booking.fare.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>


  );
};

export default TaxiBookingDetails;
