"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getHotelById, Hotel } from '@/services/hotel';
import ViewHotel from '@/components/hotel/ViewHotel';
import Loading from '@/components/Loading';
import Navbar from '@/components/navbar';
import { getRoomsByHotel, Room } from '@/services/room';
import ViewRoom from '@/components/room/ViewRoom';
import { DatePickerWithRange } from '@/components/ui/DatePickerWithRange';
import CheckoutHotel from '@/components/hotel/CheckoutHotel';
import { payHotel } from '@/services/payment';
import { useAuth } from '@/hooks/useUserData';

interface SelectedRoom {
  roomId: string;
  roomName: string;
  roomType: string;
  roomPrice: number;
  roomCount: number;
}

const generateTransactionId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TXN-';
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const HotelViewPage: React.FC = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const { getUserData } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);


  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      try {
        const hotelData = await getHotelById(id as string);
        const roomData = await getRoomsByHotel(id as string);
        setHotel(hotelData);
        setRooms(roomData);
      } catch (err) {
        setError("Failed to fetch hotel data");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelAndRooms();
  }, [id]);

  const handleCounterChange = (roomId: string, count: number) => {
    setSelectedRooms(prevSelectedRooms => {
      const existingRoom = prevSelectedRooms.find(room => room.roomId === roomId);
      if (count > 0) {
        if (existingRoom) {
          return prevSelectedRooms.map(room =>
            room.roomId === roomId ? { ...room, roomCount: count } : room
          );
        } else {
          const roomDetails = rooms.find(room => room._id === roomId);
          if (roomDetails) {
            return [
              ...prevSelectedRooms,
              {
                roomId,
                roomName: roomDetails.name,
                roomType: roomDetails.type,
                roomPrice: roomDetails.price,
                roomCount: count
              }
            ];
          }
        }
      } else {
        return prevSelectedRooms.filter(room => room.roomId !== roomId);
      }
      return prevSelectedRooms;
    });
  };

  const handleCheckout = async (totalAmount: number) => {
    setCheckoutLoading(true);
    const userData = getUserData();
    const email = userData?.email;
    const userId = userData?._id;

    if (!email || !userId) {
      console.error('User email or ID is not available');
      setCheckoutLoading(false);
      return;
    }

    const transactionId = generateTransactionId();
    const bookingData = {
      userId: userId,
      transactionId,
      hotelId: hotel?._id,
      rooms: selectedRooms.map(room => ({
        roomId: room.roomId,
        quantity: room.roomCount
      })),
      totalAmount,
      isPaid: false,
      checkInDate,
      hotelName: hotel?.name,
      checkOutDate,
      roomsCount: selectedRooms.length,
      hotelImage: hotel?.images[0] || 'https://placehold.co/600x400'
    };

    if (isClient) {
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
    }
    try {
      const { checkoutUrl } = await payHotel(email, totalAmount);
      window.location.href = checkoutUrl;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to create checkout session:', error.message);
      } else {
        console.error('An unexpected error occurred');
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Navbar />
      {hotel && (
        <div className="text-center mt-8">
          <h1 className="text-3xl font-bold"> {hotel.name}</h1>
        </div>
      )}
      {error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      ) : hotel ? (
        <div className="space-y-8">
          <ViewHotel hotel={hotel} />
          <div className="flex justify-center">
            <DatePickerWithRange
              className="w-full max-w-md"
              onChange={({ startDate, endDate }) => {
                setCheckInDate(startDate.toISOString());
                setCheckOutDate(endDate.toISOString());
              }}
            />
          </div>
          <div className='flex justify-center flex-col items-center my-3'>
            <h1 className="text-3xl font-bold mb-5">Choose Your Rooms</h1>
            {rooms.map((room) => (
              <ViewRoom key={room._id} room={room} onCounterChange={handleCounterChange} />
            ))}
          </div>
          {selectedRooms.length > 0 && (
            <CheckoutHotel
              hotelId={hotel._id}
              hotelName={hotel.name}
              hotelPicture={hotel.images[0] || 'https://placehold.co/600x400'}
              selectedRooms={selectedRooms}
              onCheckout={handleCheckout}
              loading={checkoutLoading}
            />
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Hotel Not Found</h2>
            <p className="text-gray-500">The hotel you are looking for does not exist.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelViewPage;
