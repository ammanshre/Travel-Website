"use client";

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/navbar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FlightListCard from '@/components/flight/FlightListCard';
import { Flight } from '@/helper/types';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import Loading from '@/components/Loading';

export default function FlightListingPage() {
    const [flightData, setFlightData] = useState<Flight[]>([]);
    const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        const storedFlights = localStorage.getItem("flight");
        if (storedFlights) {
            const flights = JSON.parse(storedFlights);
            setFlightData(flights);
            setFilteredFlights(flights);
        }
    }, []);

    useEffect(() => {
        handleFilterAndSort();
    }, [searchQuery, sortOption, currentPage, flightData]);

    const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);
    const currentFlights = filteredFlights.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSort = (option: string) => {
        setSortOption(option);
    };

    const handleFilterAndSort = () => {
        let filtered = flightData;

        if (searchQuery) {
            filtered = filtered.filter(flight =>
                flight.itineraries.some(itinerary =>
                    itinerary.segments.some(segment =>
                        segment.departure.iataCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        segment.arrival.iataCode.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                )
            );
        }

        if (sortOption) {
            filtered = filtered.sort((a, b) => {
                if (sortOption === 'price') {
                    return parseFloat(a.price.total) - parseFloat(b.price.total);
                } else if (sortOption === 'oldest') {
                    return new Date(a.itineraries[0].segments[0].departure.at).getTime() -
                        new Date(b.itineraries[0].segments[0].departure.at).getTime();
                }
                return 0;
            });
        }

        setFilteredFlights(filtered);
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let page = 1; page <= totalPages; page++) {
                items.push(
                    <PaginationItem key={page}>
                        <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                            }}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
            let endPage = startPage + maxVisiblePages - 1;

            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = endPage - maxVisiblePages + 1;
            }

            for (let page = startPage; page <= endPage; page++) {
                items.push(
                    <PaginationItem key={page}>
                        <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                            }}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (startPage > 1) {
                items.unshift(
                    <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            if (endPage < totalPages) {
                items.push(
                    <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
        }

        return items;
    };

    return (
        <div>
            <Navbar />
            <div className="flex p-5">
                <div className="flex-1 p-4">
                    <div className="mb-4">
                        <Input
                            className="w-full"
                            placeholder="Search Flights..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="mb-4 flex justify-end space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Sort By</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleSort('oldest')}>Oldest
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSort('price')}>Price</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className='flex items-center justify-center flex-col'>
                        {currentFlights.map((flight, index) => (
                            <FlightListCard key={index} flight={flight} />
                        ))}
                    </div>
                    <div className="mt-4 flex justify-center">
                        <Pagination>
                            <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)}>Previous</PaginationPrevious>
                            <PaginationContent>
                                {renderPaginationItems()}
                            </PaginationContent>
                            <PaginationNext onClick={() => handlePageChange(currentPage + 1)}>Next</PaginationNext>
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>
    );
}
