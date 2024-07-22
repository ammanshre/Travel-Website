"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/navbar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/hooks/useUserData';
import Loading from '@/components/Loading';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import dynamic from 'next/dynamic';
import Footer from "@/components/ui/footer";
import { createTaxi } from '@/services/taxi';
import { CityCombobox } from '@/components/hotel/CitiesDropdown';
import { City } from "@/services/cities";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaxiSchema, CreateTaxiFormValues } from '@/schemas/createTaxiSchema';
import { LoadingButton } from '@/components/ui/loading-button';
import { CarIcon, CalendarIcon, FlagIcon, PaintBucketIcon, UsersIcon, DollarSignIcon, MapPinIcon, MapIcon } from 'lucide-react';

const MyMap = dynamic(() => import('@/components/Map'), { ssr: false });

export default function CreateTaxi() {
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const initialPosition: [number, number] = [-20.348404, 57.552152];
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(false);
    const { getUserData } = useAuth();
    const { toast } = useToast();

    const handleLocationSelect = (position: [number, number]) => {
        setSelectedPosition(position);
    };

    const handleSelectCity = (city: City) => {
        setSelectedCity(city);
    };

    const form = useForm<CreateTaxiFormValues>({
        resolver: zodResolver(createTaxiSchema),
        defaultValues: {
            make: "",
            model: "",
            year: 0,
            licensePlate: "",
            color: "",
            capacity: 0,
            ratePerKm: 0
        }
    });

    const onSubmit: SubmitHandler<CreateTaxiFormValues> = async (data) => {
        if (!selectedPosition) {
            alert("Please select a location on the map.");
            return;
        }

        setLoading(true);

        const userId = getUserData()?._id;

        try {
            const taxiData = {
                make: data.make,
                model: data.model,
                year: data.year,
                licensePlate: data.licensePlate,
                color: data.color,
                capacity: data.capacity,
                ratePerKm: data.ratePerKm,
                location: {
                    type: "Point",
                    coordinates: [selectedPosition[1], selectedPosition[0]]
                },
                city: selectedCity?._id || "",
                owner: userId || "",
                available: true
            };

            const newTaxi = await createTaxi(taxiData);
            console.log('Taxi created successfully:', newTaxi);

            toast({
                title: "Success",
                description: "Taxi created successfully.",
                variant: "default",
            });
        } catch (error) {
            console.error('Error creating taxi:', error);

            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            {loading ? (
                <Loading />
            ) : (
                <div className="flex items-center justify-center w-full min-h-screen ">
                    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold">Add New Taxi</h1>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Fill out the details below to add a new taxi to your fleet.
                                </p>
                            </div>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="make">
                                        <CarIcon className="w-5 h-5 mr-2" />
                                        Make
                                    </Label>
                                    <Input id="make" placeholder="Enter make" {...form.register("make")} />
                                    {form.formState.errors.make && (
                                        <p className="text-red-500 text-sm">{form.formState.errors.make.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="model">
                                        <CarIcon className="w-5 h-5 mr-2" />
                                        Model
                                    </Label>
                                    <Input id="model" placeholder="Enter model" {...form.register("model")} />
                                    {form.formState.errors.model && (
                                        <p className="text-red-500 text-sm">{form.formState.errors.model.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="year">
                                        <CalendarIcon className="w-5 h-5 mr-2" />
                                        Year
                                    </Label>
                                    <Input id="year" type="number" placeholder="Enter year" {...form.register("year", { valueAsNumber: true })} />
                                    {form.formState.errors.year && (
                                        <p className="text-red-500 text-sm">{form.formState.errors.year.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="licensePlate">
                                        <FlagIcon className="w-5 h-5 mr-2" />
                                        License Plate
                                    </Label>
                                    <Input id="licensePlate" placeholder="Enter license plate" {...form.register("licensePlate")} />
                                    {form.formState.errors.licensePlate && (
                                        <p className="text-red-500 text-sm">{form.formState.errors.licensePlate.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="color">
                                        <PaintBucketIcon className="w-5 h-5 mr-2" />
                                        Color
                                    </Label>
                                    <Input id="color" placeholder="Enter color" {...form.register("color")} />
                                    {form.formState.errors.color && (
                                        <p className="text-red-500 text-sm">{form.formState.errors.color.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="capacity">
                                        <UsersIcon className="w-5 h-5 mr-2" />
                                        Capacity
                                    </Label>
                                    <Input id="capacity" type="number" placeholder="Enter capacity" {...form.register("capacity", { valueAsNumber: true })} />
                                    {form.formState.errors.capacity && (
                                        <p className="text-red-500 text-sm">{form.formState.errors.capacity.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ratePerKm">
                                        <DollarSignIcon className="w-5 h-5 mr-2" />
                                        Rate per KM
                                    </Label>
                                    <Input id="ratePerKm" type="number" placeholder="Enter rate per KM" {...form.register("ratePerKm", { valueAsNumber: true })} />
                                    {form.formState.errors.ratePerKm && (
                                        <p className="text-red-500 text-sm">{form.formState.errors.ratePerKm.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <Label htmlFor="city">
                                        <MapIcon className="w-5 h-5 mr-2" />
                                        City
                                    </Label>
                                    <CityCombobox onSelectCity={handleSelectCity} />
                                 
                                </div>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <Label htmlFor="location">
                                        <MapPinIcon className="w-5 h-5 mr-2" />
                                        Location
                                    </Label>
                                    <div className="relative">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant={'outline'}>View Map</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Map Location</DialogTitle>
                                                    <DialogDescription>Select the location of the taxi on the map.</DialogDescription>
                                                </DialogHeader>
                                                <MyMap initialPosition={initialPosition} zoom={10} onLocationSelect={handleLocationSelect} />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                                <LoadingButton loading={loading} size="lg" className="w-full sm:w-auto" type="submit">
                                    Add Taxi
                                </LoadingButton>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
