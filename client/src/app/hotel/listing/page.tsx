"use client";

import SidebarFilter from '@/components/hotel/SidebarFilter';
import HotelCard from '@/components/hotel/HotelCard';
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/navbar';
import { getHotelList } from '@/services/hotel'; 
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Hotel {
    _id: string;
    name: string;
    address: string;
    city: string;
    longitude: string;
    latitude: string;
    cheapestPrice: number;
    description: string;
    rating: number;
    amenities: string[];
    images: string[];
    rooms: any[];  
    cityId: string;
    user: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export default function HotelListingPage() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortType, setSortType] = useState<string>('newest');
    const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number] | null>(null);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchHotels = async () => {
            setIsLoading(true);
            try {
                const data = await getHotelList();
                setHotels(data);
                setFilteredHotels(data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching hotels:', err);
                setError('Failed to fetch hotels');
                setHotels([]);
                setFilteredHotels([]);
                setIsLoading(false);
            }
        };
        fetchHotels();
    }, []);
    
    useEffect(() => {
        let filtered = hotels.filter(hotel =>
            hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (selectedPriceRange) {
            filtered = filtered.filter(hotel =>
                hotel.cheapestPrice >= selectedPriceRange[0] &&
                hotel.cheapestPrice <= selectedPriceRange[1]
            );
        }

        if (selectedRatings.length > 0) {
            filtered = filtered.filter(hotel =>
                selectedRatings.includes(Math.round(hotel.rating))
            );
        }

        if (selectedAmenities.length > 0) {
            filtered = filtered.filter(hotel =>
                selectedAmenities.every(amenity => hotel.amenities.includes(amenity))
            );
        }

        setFilteredHotels(filtered);
    }, [searchTerm, hotels, selectedPriceRange, selectedRatings, selectedAmenities]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const sortHotels = (by: string) => {
        const sortedHotels = [...filteredHotels].sort((a, b) => {
            if (by === 'price') {
                return a.cheapestPrice - b.cheapestPrice;
            } else if (by === 'rating') {
                return b.rating - a.rating;
            } else if (by === 'newest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else if (by === 'oldest') {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            return 0;
        });
        setFilteredHotels(sortedHotels);
    };

    return (
        <div>
            <Navbar />
            <div className="flex p-5">
                <div className="w-64 p-2 hidden md:block">
                    <SidebarFilter
                        onPriceRangeChange={setSelectedPriceRange}
                        onRatingsChange={setSelectedRatings}
                        onAmenitiesChange={setSelectedAmenities}
                    />
                </div>
                <div className="flex-1 p-4">
                    <div className="mb-4">
                        <Input
                            className="w-full"
                            placeholder="Search hotels..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="mb-4 flex justify-end space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Sort By</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => sortHotels('newest')}>Newest</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => sortHotels('oldest')}>Oldest</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => sortHotels('price')}>Price</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => sortHotels('rating')}>Rating</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredHotels.map(hotel => (
                            <HotelCard key={hotel._id} hotel={hotel} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
