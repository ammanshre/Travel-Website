"use client";

import { useState, useEffect } from 'react';
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/DatePicker";
import { LoadingButton } from '@/components/ui/loading-button';
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import AirportSearch from '@/components/flight/AirportCombobox';
import { Airport, fetchFlights } from "@/services/flight";
import { Flight } from '@/helper/types';
import { useRouter } from 'next/navigation';

export default function FlightSearchCard() {
    const router = useRouter();
    const [isOneWay, setIsOneWay] = useState(false);
    const [departureDate, setDepartureDate] = useState<Date | null>(null);
    const [returnDate, setReturnDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [fromAirport, setFromAirport] = useState<Airport | null>(null);
    const [toAirport, setToAirport] = useState<Airport | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsClient(true);
        }
    }, []);




    const handleOneWayChange = (checked: boolean) => {
        setIsOneWay(checked);
        if (!checked) {
            setReturnDate(null);
        }
    };

    const handleAirportSelect = (airport: Airport | null) => {
        setFromAirport(airport);
    };

    const handleAirportSelectTo = (airport: Airport | null) => {
        setToAirport(airport);
    };

    const handleSearchFlights = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!fromAirport || !toAirport || !departureDate || (!isOneWay && !returnDate)) {
            alert("Please fill all the fields");
            return;
        }
        setLoading(true);
        try {
            const flights: Flight[] = await fetchFlights(
                fromAirport.iataCode,
                toAirport.iataCode,
                departureDate.toISOString().split('T')[0],
                1,
                isOneWay ? undefined : returnDate?.toISOString().split('T')[0]
            );
            if (isClient) {
                localStorage.setItem("flight", JSON.stringify(flights));
            }
            router.push('/flight/listing')
        } catch (error) {
            console.error('Error fetching flights:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container px-8 py-16 lg:py-32 flex justify-center">
            <Card className="w-full max-w-lg lg:max-w-xl shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Find Your Next Flight</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4 p-4" onSubmit={handleSearchFlights}>
                        <div>
                            <Label htmlFor="from-airport">From</Label>
                            <AirportSearch onSelect={handleAirportSelect} />
                        </div>
                        <div>
                            <Label htmlFor="to-airport">To</Label>
                            <AirportSearch onSelect={handleAirportSelectTo} />
                        </div>
                        <div>
                            <Label htmlFor="departure-date" className='my-2'>{isOneWay ? "Departure Date" : "Travel Dates"}</Label>
                            <div>
                                {isOneWay ? (
                                    <DatePicker
                                        selected={departureDate}
                                        onSelect={setDepartureDate}
                                    />
                                ) : (
                                    <DateRangePicker
                                        onUpdate={(values) => {
                                            if (values.range.from && values.range.to) {
                                                setDepartureDate(new Date(values.range.from));
                                                setReturnDate(new Date(values.range.to));
                                            }
                                        }}
                                        initialDateFrom="2023-01-01"
                                        initialDateTo="2023-12-31"
                                        align="start"
                                        locale="en-GB"
                                        showCompare={false}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="one-way" checked={isOneWay} onCheckedChange={handleOneWayChange} />
                            <label htmlFor="one-way" className="text-sm font-medium leading-none">
                                One-Way
                            </label>
                        </div>
                        <LoadingButton type="submit" className="w-full" loading={loading}>
                            Search Flights
                        </LoadingButton>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
