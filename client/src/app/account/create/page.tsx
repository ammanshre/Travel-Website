"use client";
import React, { ChangeEvent, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarouselItem, CarouselContent, CarouselPrevious, CarouselNext, Carousel } from "@/components/ui/carousel";
import {
    UploadCloud as UploadIcon,
    Wifi as WifiIcon,
    ParkingSquare as SquareParkingIcon,
    Waves as PoolIcon,
    Dumbbell as DumbbellIcon,
    Droplets as SpaIcon,
    Coffee as RestaurantIcon,
    Beer as BarIcon,
    Bus as AirportShuttleIcon,
    ConciergeBell as ConciergeIcon,
    HandPlatter as RoomServiceIcon,
    Ban as NonSmokingIcon,
    Dog as PetFriendlyIcon,
    WashingMachine as LaundryServiceIcon,
    Fan as AirConditioningIcon,
    Presentation as MeetingRoomsIcon,
    Hotel,
    Eraser as RemoveIcon,
    Check as CheckIcon
} from 'lucide-react';
import Navbar from '@/components/navbar';
import HotelAmenities from '@/components/hotel/HotelAmenities';
import { CityCombobox } from '@/components/hotel/CitiesDropdown';
import { City } from "@/services/cities";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createHotel, CreateHotelData } from '@/services/hotel';
import { uploadImage } from '@/services/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createHotelSchema, CreateHotelFormValues } from '@/schemas/createHotelSchema'; 
import { useAuth } from '@/hooks/useUserData';
import Loading from '@/components/Loading';
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import dynamic from 'next/dynamic';
import Rating from '@/components/Rating';
import Footer from "@/components/ui/footer";
const MyMap = dynamic(() => import('@/components/Map'), { ssr: false });

const amenities = [
  { name: 'wifi', Icon: WifiIcon },
  { name: 'parking', Icon: SquareParkingIcon },
  { name: 'pool', Icon: PoolIcon },
  { name: 'gym', Icon: DumbbellIcon },
  { name: 'spa', Icon: SpaIcon },
  { name: 'restaurant', Icon: RestaurantIcon },
  { name: 'bar', Icon: BarIcon },
  { name: 'airport shuttle', Icon: AirportShuttleIcon },
  { name: 'concierge', Icon: ConciergeIcon },
  { name: 'room service', Icon: RoomServiceIcon },
  { name: 'non-smoking rooms', Icon: NonSmokingIcon },
  { name: 'pet-friendly', Icon: PetFriendlyIcon },
  { name: 'laundry service', Icon: LaundryServiceIcon },
  { name: 'air conditioning', Icon: AirConditioningIcon },
  { name: 'meeting rooms', Icon: MeetingRoomsIcon },
];

interface Image {
    file: File;
    id: number;
    name: string;
}

export default function CreateHotel() {
    const [images, setImages] = useState<Image[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const initialPosition: [number, number] = [-20.348404, 57.552152]; 
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(false);
    const { setUserData, getUserData, clearUserData } = useAuth();
    const { toast } = useToast();
    const [rating, setRating] = useState(0);

    const handleLocationSelect = (position: [number, number]) => {
      setSelectedPosition(position);
    };

    const handleRatingSelect = (rating: number) => {
        setRating(rating);
    };
  
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const newImages = files.map((file, index) => ({
                file: file,
                id: new Date().getTime() + index,
                name: file.name 
            }));
            setImages(prevImages => [...prevImages, ...newImages]);
        }
    };

    const removeImage = (id: number) => {
        setImages(images => images.filter(image => image.id !== id));
    };

    const handleSelectCity = (city: City) => {
        setSelectedCity(city);
    };

    const handleAmenitiesChange = (selectedAmenities: string[]) => {
        setSelectedAmenities(selectedAmenities);
    };

    const form = useForm<CreateHotelFormValues>({
        resolver: zodResolver(createHotelSchema),
        defaultValues: {
            hotelName: "",
            description: "",
            address: "",
            city: null
        }
    });

    const onSubmit: SubmitHandler<CreateHotelFormValues> = async (data) => {
        if (!selectedPosition) {
            alert("Please select a location on the map.");
            return;
        }

        setLoading(true);

        const userId = getUserData()?._id;

        try {
            // Upload images first
            const uploadedImages = await Promise.all(
                images.map(async (image) => {
                    const uploadResponse = await uploadImage(image.file);
                    return uploadResponse.imageUrl;
                })
            );

            const hotelData: CreateHotelData = {
                name: data.hotelName,
                address: data.address,
                city: selectedCity?.city || "City Name", 
                longitude: selectedPosition[1].toString(),
                latitude: selectedPosition[0].toString(),
                cheapestPrice: 0, 
                description: data.description,
                rating: rating,
                amenities: selectedAmenities,
                images: uploadedImages,
                rooms: [],
                cityId: selectedCity?._id || "",
                user: userId || "" 
            };

            const newHotel = await createHotel(hotelData);
            console.log('Hotel created successfully:', newHotel);

            toast({
                title: "Success",
                description: "Hotel created successfully.",
                variant: "default",
            });
        } catch (error) {
            console.error('Error creating hotel:', error);

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto p-4 md:p-6">
                    <div className="space-y-6">
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hotelName">Hotel Name</Label>
                                <Input id="hotelName" placeholder="Enter hotel name" {...form.register("hotelName")} />
                                {form.formState.errors.hotelName && (
                                    <p className="text-red-500 text-sm">{form.formState.errors.hotelName.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Describe your hotel" {...form.register("description")} />
                                {form.formState.errors.description && (
                                    <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" placeholder="Enter hotel address" {...form.register("address")} />
                                {form.formState.errors.address && (
                                    <p className="text-red-500 text-sm">{form.formState.errors.address.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <CityCombobox onSelectCity={handleSelectCity} />
                                {form.formState.errors.city && (
                                    <p className="text-red-500 text-sm">{form.formState.errors.city.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating</Label>
                                <Rating onRatingSelect={handleRatingSelect} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amenities">Amenities</Label>
                                <HotelAmenities onAmenitiesChange={handleAmenitiesChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="photos">Photos</Label>
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                        <UploadIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Drag and drop your photos here or click to upload.
                                        </p>
                                        <Input id="photos" multiple type="file" onChange={handleImageChange} />
                                        {images.length > 0 ? images.map(image => (
                                            <div key={image.id} className="flex justify-between items-center p-2 m-3 bg-gray-500 rounded-md hover:bg-gray-100 text-gray-600">
                                                <span className="text-sm text-gray-800">{image.name}</span>
                                                <button
                                                    onClick={() => removeImage(image.id)}
                                                    className="p-1 mx-2 rounded-full bg-red-500 hover:bg-red-700 text-white"
                                                    aria-label="Remove image"
                                                >
                                                    <RemoveIcon size={16} />
                                                </button>
                                            </div>
                                        )) : (
                                            <div className="text-center p-2 text-sm text-gray-500">No images uploaded</div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="space-y-2">
                              <div className='flex flex-col'>
                              <Label htmlFor="location" className='my-2'>Location</Label>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant={'outline'}>View Map</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Map Location</DialogTitle>
                                            <DialogDescription>Select the location of the hotel on the map.</DialogDescription>
                                        </DialogHeader>
                                        <MyMap initialPosition={initialPosition} zoom={10} onLocationSelect={handleLocationSelect} />
                                    </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                            <Button className="w-full" type="submit">
                                Create Hotel
                            </Button>
                        </form>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 md:p-6 space-y-4">
                        <Carousel className="w-full max-w-[400px] mx-auto">
                            <CarouselContent>
                                {images.length > 0 ? (
                                    images.map(image => (
                                        <CarouselItem key={image.id}>
                                            {typeof window !== 'undefined' && (
                                                <img
                                                    alt="Uploaded image"
                                                    className="rounded-lg w-full aspect-[4/3] object-cover"
                                                    src={URL.createObjectURL(image.file)}
                                                    width={400}
                                                    height={300}
                                                />
                                            )}
                                        </CarouselItem>
                                    ))
                                ) : (
                                    <CarouselItem>
                                        <img
                                            alt="Placeholder image"
                                            className="rounded-lg w-full aspect-[4/3] object-cover"
                                            src="https://placehold.co/600x400"
                                            width={400}
                                            height={300}
                                        />
                                    </CarouselItem>
                                )}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">{form.watch("hotelName") || "Hotel Acme"}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{form.watch("address") || "123 Main St, New York, NY 10001"}</p>
                            <p  className="text-slate-900 dark:text-slate-300 font-medium">
                            {selectedCity ? `Discover ${selectedCity.city}` : "Discover a new city."}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                                {form.watch("description") || 'Discover the perfect blend of comfort and style at Hotel Acme. Our hotel offers a range of amenities to ensure your stay is unforgettable.'}
                            </p>
                           
                            <div className="flex items-center gap-2 flex-wrap">
                                {selectedAmenities.map((amenity) => {
                                    const Icon = amenities.find((a) => a.name === amenity)?.Icon;
                                    return Icon ? <Icon key={amenity} className="w-5 h-5" /> : null;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
