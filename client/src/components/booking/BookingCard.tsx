import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface BookingCardProps {
  transactionId: string;
  hotelName: string;
  hotelImage: string;
  roomsCount: number;
  checkInDate: string;
  checkOutDate: string;
  bookedDate: string;
  amount: number;
  isPaid: boolean;
}

export default function BookingCard({
  transactionId,
  hotelName,
  hotelImage,
  roomsCount,
  checkInDate,
  checkOutDate,
  bookedDate,
  amount,
  isPaid,
}: BookingCardProps) {
  return (
    <Card className="w-full max-w-5xl mx-auto my-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-6">
        <div className="relative">
          <img
            alt="Hotel Image"
            className="rounded-lg shadow-md w-full h-auto md:h-52"
            src={hotelImage}
            style={{
              objectFit: "cover",
            }}
          />
          <Badge className={`absolute top-2 right-2 px-3 py-1 text-sm font-medium flex items-center gap-2 ${isPaid ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {isPaid && <CheckCircle className="w-4 h-4" />}
            {isPaid ? "Paid" : "Unpaid"}
          </Badge>
        </div>
        <div className="grid gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 border-b pb-2">
            <div className="text-sm font-medium">Transaction ID:</div>
            <div>{transactionId}</div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 border-b pb-2">
            <div className="text-sm font-medium">Hotel:</div>
            <div>{hotelName}</div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 border-b pb-2">
            <div className="text-sm font-medium">Rooms:</div>
            <div>{roomsCount}</div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 border-b pb-2">
            <div className="text-sm font-medium">Check-in:</div>
            <div>{checkInDate}</div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 border-b pb-2">
            <div className="text-sm font-medium">Check-out:</div>
            <div>{checkOutDate}</div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 border-b pb-2">
            <div className="text-sm font-medium">Booked:</div>
            <div>{bookedDate}</div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <div className="text-sm font-medium">Amount:</div>
            <div>Rs {amount.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
