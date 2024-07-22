"use client";

import TaxiCard from '@/components/taxi/TaxiCard';
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/navbar';
import { getTaxiList } from '@/services/taxi';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Taxi {
    _id: string;
    owner: {
        _id: string;
        username: string;
        email: string;
        role: string;
        name: string;
        createdAt: string;
        updatedAt: string;
    };
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    capacity: number;
    ratePerKm: number;
    available: boolean;
    location: {
        type: string;
        coordinates: number[];
    };
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

export default function TaxiListingPage() {
    const [taxis, setTaxis] = useState<Taxi[]>([]);
    const [filteredTaxis, setFilteredTaxis] = useState<Taxi[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortType, setSortType] = useState<string>('newest');
    const router = useRouter();

    useEffect(() => {
        const fetchTaxis = async () => {
            setIsLoading(true);
            try {
                const data = await getTaxiList();
                setTaxis(data);
                setFilteredTaxis(data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching taxis:', err);
                setError('Failed to fetch taxis');
                setTaxis([]);
                setFilteredTaxis([]);
                setIsLoading(false);
            }
        };
        fetchTaxis();
    }, []);

    useEffect(() => {
        let filtered = taxis.filter(taxi =>
            taxi.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
            taxi.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            taxi.city.city.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredTaxis(filtered);
    }, [searchTerm, taxis]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const sortTaxis = (by: string) => {
        const sortedTaxis = [...filteredTaxis].sort((a, b) => {
            if (by === 'price') {
                return a.ratePerKm - b.ratePerKm;
            } else if (by === 'newest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else if (by === 'oldest') {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            return 0;
        });
        setFilteredTaxis(sortedTaxis);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <Navbar />
            <div className="flex p-5">
                <div className="flex-1 p-4">
                    <div className="mb-4">
                        <Input
                            className="w-full"
                            placeholder="Search taxis..."
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
                                <DropdownMenuItem onSelect={() => sortTaxis('newest')}>Newest</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => sortTaxis('oldest')}>Oldest</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => sortTaxis('price')}>Price</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredTaxis.map(taxi => (
                                <TaxiCard key={taxi._id} taxi={taxi} />
                            ))}
                    </div>
                    {error && <div className="text-red-500">{error}</div>}
                </div>
            </div>
        </div>
    );
}
