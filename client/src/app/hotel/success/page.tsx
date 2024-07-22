"use client";

import { useEffect, useState } from "react";
import SuccessBooking from "@/components/hotel/SuccessBooking";
import Loading from "@/components/Loading";
import { createBooking, Booking } from "@/services/booking";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/helper/darkmode";
import NoDataCard from "@/components/NoDataCard";

export default function SuccessPage() {
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (isClient && !bookingData) {
      const data = localStorage.getItem("bookingData");
      if (data) {
        const parsed = JSON.parse(data);
        setParsedData(parsed);
        console.log('Parsed bookingData:', parsed);

        setLoading(true);
        createBooking(parsed)
          .then(response => {
            setBookingData(response);
          })
          .catch(error => {
            console.error('Failed to create booking:', error.message);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [isClient]);

  if (loading) {
    return <Loading />;
  }

  if (!bookingData) {
    return <NoDataCard />;
  }

  return (
    <div>
      <div className="flex items-center justify-center flex-col">
        <div className="self-start mt-3 flex justify-between w-full">
          <Link href="/">
            <Button className="mx-3">
              <ChevronLeft className="mr-2 h-4 w-4" /> View My Bookings
            </Button>
          </Link>
          <div className="mx-3">
            <ModeToggle />
          </div>
        </div>
      </div>
      {parsedData && (
        <SuccessBooking
          bookingData={{
            hotelName: parsedData.hotelName,
            hotelImage: parsedData.hotelImage,
            roomsCount: parsedData.roomsCount,
            checkInDate: parsedData.checkInDate,
            checkOutDate: parsedData.checkOutDate,
          }}
        />
      )}
    </div>
  );
}
