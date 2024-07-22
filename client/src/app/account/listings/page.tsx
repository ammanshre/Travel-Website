"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users2, CreditCard, ShoppingCart, LineChart } from "lucide-react";
import ListingCard from "@/components/account/ListingCard";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import { getHotelsByUserId, Hotel } from '@/services/hotel';
import { getTaxisByUserId, Taxi } from '@/services/taxi';
import { getAnalytics, Analytics } from '@/services/analytics';
import { useAuth } from '@/hooks/useUserData';
import { truncateText } from '@/lib/utils';
import TaxiListingCard from "@/components/taxi/TaxiListingCard";
import Footer from "@/components/ui/footer";

export default function ListingsPage() {
    const [listings, setListings] = useState<Hotel[]>([]);
    const [loadingHotels, setLoadingHotels] = useState(true);
    const [loadingTaxis, setLoadingTaxis] = useState(true);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);
    const { getUserData } = useAuth();
    const [taxis, setTaxis] = useState<Taxi[]>([]);
    const [hotelError, setHotelError] = useState<string | null>(null);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
            const userId = getUserData()?._id ?? '';
            
            try {
                const hotelData = await getHotelsByUserId(userId);
                setListings(hotelData);
            } catch (error) {
                setHotelError("You don't have any listings yet, care to add some?");
            } finally {
                setLoadingHotels(false);
            }

            try {
                const taxiData = await getTaxisByUserId(userId);
                setTaxis(taxiData);
            } catch (error) {
                console.error("Failed to fetch taxi listings:", error);
            } finally {
                setLoadingTaxis(false);
            }

            try {
                const analyticsData = await getAnalytics();
                setAnalytics(analyticsData);
            } catch (error) {
                console.error("Failed to fetch analytics data:", error);
            } finally {
                setLoadingAnalytics(false);
            }
        };

        fetchListings();
    }, []);

    if (loadingHotels || loadingTaxis || loadingAnalytics) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="p-8">
                <div className="flex items-center justify-between my-4">
                    <h1 className="text-3xl font-bold">My Listings</h1>
                </div>
                <Separator orientation="vertical" />

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Number of Listings */}
                    <Card className="bg-background shadow-sm rounded-lg">
                        <CardHeader className="flex justify-between items-center p-4">
                            <CardTitle className="text-lg font-bold">Listings</CardTitle>
                            <Users2 className="h-6 w-6 text-blue-500" />
                        </CardHeader>
                        <CardContent className="p-4">
                            <p className="text-2xl font-semibold">{analytics?.totalListings}</p>
                            <p className="text-sm text-gray-500">Total Listings</p>
                        </CardContent>
                    
                    </Card>

                    {/* Number of Transactions */}
                    <Card className="bg-background shadow-sm rounded-lg">
                        <CardHeader className="flex justify-between items-center p-4">
                            <CardTitle className="text-lg font-bold">Transactions</CardTitle>
                            <CreditCard className="h-6 w-6 text-green-500" />
                        </CardHeader>
                        <CardContent className="p-4">
                            <p className="text-2xl font-semibold">{analytics?.totalTransactions}</p>
                            <p className="text-sm text-gray-500">Completed this month</p>
                        </CardContent>
                     
                    </Card>

                    {/* Revenue */}
                    <Card className="bg-background shadow-sm rounded-lg">
                        <CardHeader className="flex justify-between items-center p-4">
                            <CardTitle className="text-lg font-bold">Revenue</CardTitle>
                            <ShoppingCart className="h-6 w-6 text-purple-500" />
                        </CardHeader>
                        <CardContent className="p-4">
                            <p className="text-2xl font-semibold">Rs {analytics?.totalRevenue.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                        </CardContent>
                        <CardFooter className="p-4">
                            <Progress value={60} max={100} />
                        </CardFooter>
                    </Card>

                    {/* Occupancy Rate */}
                    <Card className="bg-background shadow-sm rounded-lg">
                        <CardHeader className="flex justify-between items-center p-4">
                            <CardTitle className="text-lg font-bold">Occupancy Rate</CardTitle>
                            <LineChart className="h-6 w-6 text-orange-500" />
                        </CardHeader>
                        <CardContent className="p-4">
                            <p className="text-2xl font-semibold">{analytics?.totalRevenueForCurrentMonth}</p>
                            <p className="text-sm text-gray-500">Current month</p>
                        </CardContent>
                        <CardFooter className="p-4">
                            <Badge>Healthy</Badge>
                        </CardFooter>
                    </Card>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">My Hotels</h2>
                <div className="flex items-center justify-end my-4">
                    <div className="mt-4">
                        <Link href="/account/create">
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white">Add Hotel</Button>
                        </Link>
                    </div>
                </div>
                {hotelError ? (
                    <div className="text-center my-8">
                        <p className="text-xl">{hotelError}</p>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center my-8">
                        <p className="text-xl">You don't have any hotels listed.</p>
                    </div>
                ) : (
                    listings.map((listing, index) => (
                        <ListingCard
                            id={listing._id}
                            loading={loadingHotels}
                            key={index}
                            title={listing.name}
                            pricePerNight={listing.cheapestPrice}
                            description={truncateText(listing.description, 100)} // Truncate description to 100 characters
                            imageUrl={listing.images[0]}
                        />
                    ))
                )}

                {/* Taxi Listings */}
                <h2 className="text-2xl font-bold mt-8 mb-4">My Taxis</h2>
                <div className="flex items-center justify-end my-4">
                    <div className="mt-4">
                        <Link href="/account/taxi/create">
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white">Add Taxi</Button>
                        </Link>
                    </div>
                </div>
                {taxis.length === 0 ? (
                    <div className="text-center my-8">
                        <p className="text-xl">Are you a taxi owner and willing to make some bucks?</p>
                    </div>
                ) : (
                    taxis.map((taxi, index) => (
                        <TaxiListingCard
                            key={index}
                            id={taxi._id}
                            make={taxi.make}
                            model={taxi.model}
                            year={taxi.year}
                            licensePlate={taxi.licensePlate}
                            color={taxi.color}
                            capacity={taxi.capacity}
                            ratePerKm={taxi.ratePerKm}
                            loading={loadingTaxis}
                        />
                    ))
                )}
            </div>
            <Footer />
        </div>
    );
}
