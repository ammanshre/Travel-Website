"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getRoomsByHotel, Room } from '@/services/room';
import RoomCard from '@/components/account/RoomCard';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/navbar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';
export default function HotelListingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortType, setSortType] = useState<string>('newest');
  const params = useParams();
  const { id } = params;



  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRoomsByHotel(id as string);
        setRooms(data);
        setFilteredRooms(data);
      } catch (error) {
        setError('Failed to fetch rooms data');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRooms();
  }, [id]);

  useEffect(() => {
    let updatedRooms = [...rooms];

    // Filter by search term
    if (searchTerm) {
      updatedRooms = updatedRooms.filter(room =>
        room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortType === 'oldest') {
      updatedRooms.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortType === 'newest') {
      updatedRooms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortType === 'price') {
      updatedRooms.sort((a, b) => a.price - b.price);
    }

    setFilteredRooms(updatedRooms);
  }, [searchTerm, sortType, rooms]);


  return (

    <div>
      <Navbar />
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">My Rooms</h1>
          
        </div>
        <div className="flex items-center justify-between mb-4">

          <Input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2"
          />
          <div>
          <Link href={`/account/rooms/add/${id}`}>
              <Button variant="default" size={'sm'} className='mx-5'>Add Room</Button>

            </Link>
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

        </div>
        <Separator orientation="horizontal" className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map(room => (
            <RoomCard
              name={room.name}
              key={room._id}
              type={room.type}
              price={room.price}
              description={room.description}
              imageUrl={room.images[0]}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </div>

  );
}
