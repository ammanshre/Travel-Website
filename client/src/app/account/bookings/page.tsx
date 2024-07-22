"use client";

import React, { useEffect, useState } from 'react';
import { getBookingsByUserId, Booking } from '@/services/booking';
import { useAuth } from '@/hooks/useUserData';
import Loading from '@/components/Loading';
import BookingCard from '@/components/booking/BookingCard';
import Footer from "@/components/ui/footer";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import Navbar from '@/components/navbar';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'next/navigation';
import ErrorCard from '@/components/ErrorCard';


const BookingsList: React.FC = () => {
    const [userBookings, setUserBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getUserData } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage] = useState(5);
    const [sortType, setSortType] = useState<string>('newest');
    const pagesToShow = 5;
    const id = getUserData()?._id;

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                const { bookings } = await getBookingsByUserId(id as string);
                setUserBookings(bookings);
            } catch (err: any) {
                console.log(err.message)
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserBookings();
        } else {
            setLoading(false);
        }
    }, [id]);

    const sortedBookings = userBookings.sort((a, b) => {
        if (sortType === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortType === 'oldest') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortType === 'price') {
            return b.totalAmount - a.totalAmount;
        }
        return 0;
    });

    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) return <Loading />;

    if (error) return   <div className='my-4'> <ErrorCard message={error}/></div>;

    if (!userBookings.length) return <div>No bookings found</div>;

    const totalPages = Math.ceil(userBookings.length / bookingsPerPage);
    const startPage = Math.floor((currentPage - 1) / pagesToShow) * pagesToShow + 1;
    const endPage = Math.min(startPage + pagesToShow - 1, totalPages);
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <div>
            <Navbar />
            <div className="flex justify-between mx-6 flex-wrap">
                <h1 className="text-2xl font-bold">My Bookings</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Sort By</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => setSortType('newest')}>Newest</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSortType('oldest')}>Oldest</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSortType('price')}>Price</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className='my-3 mx-4'>
                <Separator />
            </div>
            {currentBookings.map(booking => (
                <BookingCard
                    key={booking._id}
                    transactionId={booking.transactionId}
                    hotelName={booking.hotel.name}
                    hotelImage={booking.hotel.images[0] || 'https://placehold.co/600x400'}
                    roomsCount={booking.rooms.length}
                    checkInDate={new Date(booking.checkInDate).toLocaleString()}
                    checkOutDate={new Date(booking.checkOutDate).toLocaleString()}
                    bookedDate={new Date(booking.createdAt).toLocaleString()}
                    amount={booking.totalAmount}
                    isPaid={booking.isPaid}
                />
            ))}
            <div className="my-10 flex justify-center">
                <Pagination className="flex flex-wrap justify-center">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>
                        {pages.map(page => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    onClick={() => paginate(page)}
                                    isActive={currentPage === page}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
            <Footer />
        </div>
    );
};

export default BookingsList;
