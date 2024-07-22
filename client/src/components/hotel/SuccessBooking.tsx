// src/components/hotel/SuccessBooking.tsx
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BookingData {
    hotelName: string;
    roomsCount: number;
    checkInDate: string;
    checkOutDate: string;
    hotelImage: string;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
};

export default function SuccessBooking({ bookingData }: { bookingData: BookingData }) {
    console.log('Booking data in SuccessBooking:', bookingData); // Debugging log

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-8 p-4">
            <div className="bg-white dark:bg-gray-950 shadow-lg rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold">{bookingData.hotelName}</div>
                    <Badge className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-300" variant="default">
                        Booked
                    </Badge>
                </div>
                <img
                    alt={bookingData.hotelName}
                    className="rounded-lg mb-4 w-full h-48 object-cover"
                    height={300}
                    src={bookingData.hotelImage}
                    style={{
                        aspectRatio: "500/300",
                        objectFit: "cover",
                    }}
                    width={500}
                />
                <div className="grid gap-4">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-sm mb-1">Rooms Booked</div>
                        <div className="text-lg font-semibold">{bookingData.roomsCount}</div>
                    </div>
                    <Separator className="w-full" />
                    <div className="flex flex-col items-center text-center">
                        <div className="text-sm mb-1">Check-in</div>
                        <div className="text-lg font-semibold">{formatDate(bookingData.checkInDate)}</div>
                    </div>
                    <Separator className="w-full" />
                    <div className="flex flex-col items-center text-center">
                        <div className="text-sm mb-1">Check-out</div>
                        <div className="text-lg font-semibold">{formatDate(bookingData.checkOutDate)}</div>
                    </div>
                </div>
            </div>
            <div className="text-center">
                Thank you for your booking! We're excited to host you at our cozy mountain retreat. Enjoy your stay!
            </div>
        </div>
    );
}
