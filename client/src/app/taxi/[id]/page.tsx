"use client";

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { useRouter, useParams } from 'next/navigation';
import { getTaxiById, createTaxiBooking, Taxi } from '@/services/taxi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/navbar';
import Loading from '@/components/Loading';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '@/hooks/useUserData';
import L from 'leaflet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LoadingButton } from '@/components/ui/loading-button';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Car } from 'lucide-react';

interface LatLng {
    lat: number;
    lng: number;
}

export default function TaxiBookingPage() {
    const [taxi, setTaxi] = useState<Taxi | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [pickupLocation, setPickupLocation] = useState<LatLng | null>(null);
    const [dropoffLocation, setDropoffLocation] = useState<LatLng | null>(null);
    const [pickupAddress, setPickupAddress] = useState<string | null>(null);
    const [dropoffAddress, setDropoffAddress] = useState<string | null>(null);
    const [fare, setFare] = useState(0);
    const [distance, setDistance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { getUserData } = useAuth();
    const user = typeof window !== 'undefined' ? getUserData() : null;
    const { toast } = useToast();

    useEffect(() => {
        const fetchTaxi = async () => {
            setIsLoading(true);
            try {
                const data = await getTaxiById(id);
                setTaxi(data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching taxi:', err);
                setError('Failed to fetch taxi');
                setTaxi(null);
                setIsLoading(false);
            }
        };
        fetchTaxi();
    }, [id]);

    const handleMapClick = async (e: L.LeafletMouseEvent) => {
        const latlng = e.latlng;

        if (!pickupLocation) {
            setPickupLocation(latlng);
            const address = await getAddressFromLatLng(latlng);
            setPickupAddress(address);
        } else if (!dropoffLocation) {
            setDropoffLocation(latlng);
            const address = await getAddressFromLatLng(latlng);
            setDropoffAddress(address);
            calculateFare(latlng);
        }
    };

    const calculateFare = (dropoff: LatLng) => {
        if (pickupLocation) {
            const distance = calculateDistance(pickupLocation, dropoff);
            setDistance(distance);
            if (taxi) {
                setFare(parseFloat((distance * taxi.ratePerKm).toFixed(2)));
            }
        }
    };

    const calculateDistance = (start: LatLng, end: LatLng) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (end.lat - start.lat) * (Math.PI / 180);
        const dLng = (end.lng - start.lng) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(start.lat * (Math.PI / 180)) * Math.cos(end.lat * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const handleBooking = async () => {
        if (pickupLocation && dropoffLocation && taxi) {
            if (!user) {
                setError('User not logged in. Please log in to book a taxi.');
                return;
            }
            setLoading(true);
            try {
                await createTaxiBooking({
                    user: user._id,
                    taxi: taxi._id,
                    pickupLocation: {
                        type: "Point",
                        coordinates: [pickupLocation.lng, pickupLocation.lat],
                        address: pickupAddress ?? "Pickup address" // Replace with actual address
                    },
                    dropoffLocation: {
                        type: "Point",
                        coordinates: [dropoffLocation.lng, dropoffLocation.lat],
                        address: dropoffAddress ?? "Dropoff address" // Replace with actual address
                    },
                    fare,
                    distance,
                    bookingStatus: "pending"
                });
                toast({
                    title: "Success",
                    description: "Taxi booked successfully.",
                    variant: "default",
                });
            } catch (err) {
                console.error('Error creating booking:', err);
                setError('Failed to create booking');
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const removeMarkers = () => {
        setPickupLocation(null);
        setDropoffLocation(null);
        setPickupAddress(null);
        setDropoffAddress(null);
        setFare(0);
        setDistance(0);
    };

    const getAddressFromLatLng = async (latlng: LatLng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
            const data = await response.json();
            return data.display_name;
        } catch (error) {
            console.error('Error fetching address:', error);
            return 'Unknown address';
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!taxi) {
        return <div>No taxi found</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg relative z-10">
                <div className="grid gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Card className='p-1'>
                                <Car size={40} color='#3B82F6' />
                            </Card>
                            <div>
                                <h2 className="text-xl font-semibold">{taxi.make} {taxi.model}</h2>
                                <p className="text-gray-500 dark:text-gray-400">Owned by {taxi.owner.name}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="text-lg font-semibold">Rs {taxi.ratePerKm}/km</div>
                            <div className="text-gray-500 dark:text-gray-400">{taxi.capacity} seats</div>
                        </div>
                    </div>
                    <div className="h-96 rounded-lg">
                        <MapContainer center={[parseFloat(taxi.city.lat), parseFloat(taxi.city.lng)]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {pickupLocation && (
                                <Marker position={pickupLocation}>
                                    <Popup>Pickup Location: {pickupAddress}</Popup>
                                </Marker>
                            )}
                            {dropoffLocation && (
                                <Marker position={dropoffLocation} >
                                    <Popup>Dropoff Location: {dropoffAddress}</Popup>
                                </Marker>
                            )}
                            <MapClickHandler onMapClick={handleMapClick} />
                        </MapContainer>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="location">Pick up location</Label>
                            {pickupAddress && <p>{pickupAddress}</p>}
                        </div>
                        <div>
                            <Label htmlFor="location">Drop off location</Label>
                            {dropoffAddress && <p>{dropoffAddress}</p>}
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="text-lg font-semibold">Distance: {distance.toFixed(2)} km</div>
                        <div className="text-lg font-semibold">Fare: Rs {fare.toFixed(2)}</div>
                    </div>
                    <div className="flex items-end gap-2">
                        <Button variant="outline" onClick={removeMarkers}>Remove Markers</Button>
                        <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
                            <AlertDialogTrigger asChild>
                                <Button disabled={!pickupLocation || !dropoffLocation} onClick={() => setConfirmationOpen(true)}>Book Now</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="z-50">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you confirming this booking for taxi {taxi.make} {taxi.model} in {taxi.city.city} at Rs {fare.toFixed(2)}?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <LoadingButton loading={loading} onClick={handleBooking}>Confirm</LoadingButton>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MapClickHandler({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
    useMapEvents({
        click: onMapClick,
    });
    return null;
}
