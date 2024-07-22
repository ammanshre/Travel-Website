"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import Navbar from '@/components/navbar';
import Loading from '@/components/Loading';
import FlightSuccess from '@/components/flight/FlightSuccess';
import { bookFlight } from '@/services/flight';
import { useAuth } from '@/hooks/useUserData';
import { Separator } from "@/components/ui/separator";

interface ContactInfoData {
    emailAddress: string;
}

export default function FlightCheckoutPage() {
    const [loading, setLoading] = useState(true);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const bookingInitiated = useRef(false);

    const { getUserData } = useAuth();

    const fetchLocalStorageData = useCallback(() => {
        if (typeof window !== 'undefined') {
            const travelerData = localStorage.getItem("travelerData");
            const contactInfoData = localStorage.getItem("contactInfoData");
            const flightOfferForBooking = localStorage.getItem("flightOfferForBooking");
            return {
                travelerData: travelerData ? JSON.parse(travelerData) : null,
                contactInfoData: contactInfoData ? JSON.parse(contactInfoData) : null,
                flightOfferForBooking: flightOfferForBooking ? JSON.parse(flightOfferForBooking) : null,
            };
        }
        return { travelerData: null, contactInfoData: null, flightOfferForBooking: null };
    }, []);

    useEffect(() => {
        const initiateBooking = async () => {
            if (bookingInitiated.current) return; 
            bookingInitiated.current = true;

            const { travelerData, contactInfoData, flightOfferForBooking } = fetchLocalStorageData();
            const user = getUserData();

            if (travelerData && contactInfoData && flightOfferForBooking && user) {
                try {
                    if (contactInfoData.address && typeof contactInfoData.address.lines === 'string') {
                        contactInfoData.address.lines = [contactInfoData.address.lines];
                    }

                    const travelers = Array.isArray(travelerData) ? travelerData : [travelerData];

                    const bookingDetails = await bookFlight(
                        flightOfferForBooking,
                        travelers,
                        [contactInfoData],
                        user._id
                    );

                    if (bookingDetails) {
                        setBookingConfirmed(true);
                    } else {
                        setError("Flight booking could not be confirmed");
                    }
                } catch (error) {
                    console.error("Error during booking confirmation:", error);
                    setError("An error occurred while processing the flight booking.");
                }
            } else {
                setError("Missing required data for booking.");
            }
            setLoading(false);
        };

        initiateBooking();
    }, []); // Empty dependency array to ensure it runs only once

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <Navbar />
            <div className="p-8">
                {error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    bookingConfirmed && (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-3xl font-bold">Booking Successful</h1>
                            </div>
                            <div className="flex justify-center flex-col items-center">
                                <FlightSuccess />
                            </div>
                      
                        </>
                    )
                )}
            </div>
        </div>
    );
}
