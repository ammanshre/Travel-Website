import React from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingButton } from "@/components/ui/loading-button";

interface CheckoutHotelProps {
  hotelId: string;
  hotelName: string;
  hotelPicture: string;
  selectedRooms: {
    roomId: string;
    roomName: string;
    roomType: string;
    roomPrice: number;
    roomCount: number;
  }[];
  onCheckout: (total: number) => void;
  loading: boolean; // Add loading prop
}

const CheckoutHotel: React.FC<CheckoutHotelProps> = ({ hotelName, hotelPicture, hotelId, selectedRooms, onCheckout, loading }) => {
  const total = selectedRooms.reduce((sum, room) => sum + room.roomPrice * room.roomCount, 0).toFixed(2);

  return (
    <div className="grid max-w-2xl mx-auto space-y-6 p-2">
      <h1 className="text-3xl font-bold text-center mt-10">Checkout and book {hotelName}</h1>
      <Card className="grid">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{hotelName}</CardTitle>
              <CardDescription>Room Checkout</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <img
            alt="Hotel"
            className="rounded-md mx-auto"
            height={200}
            src={hotelPicture || "https://placehold.co/600x400"}
            style={{
              objectFit: "cover",
            }}
            width={300}
          />
          <Separator />
          {selectedRooms.map((room, index) => (
            <div key={index} className="grid gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{room.roomName}</h2>
                  <h3 className="font-medium">{room.roomType}</h3>
                  <p className="text-sm text-gray-500 my-1 dark:text-gray-400">
                    Rs {room.roomPrice.toFixed(2)} per night
                  </p>
                  <p className="font-medium">x {room.roomCount}</p>
                </div>
              </div>
              <Separator />
            </div>
          ))}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Total</h3>
            </div>
            <div className="font-medium">Rs {total}</div>
          </div>
        </CardContent>
        <CardFooter>
          <LoadingButton className="w-full" loading={loading} onClick={() => onCheckout(parseFloat(total))}>
            Checkout
          </LoadingButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckoutHotel;
