import { Star, Wifi, Wallet, Dumbbell, MapPin, Waves, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { CardContent, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

interface Hotel {
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
interface HotelCardProps {
  hotel: Hotel;
}
interface AmenitiesIcons {
  [key: string]: React.ElementType;
}


export default function HotelCard({ hotel }: HotelCardProps) {

  const amenitiesIcons: AmenitiesIcons = {
    wifi: Wifi,
    wallet: Wallet,
    gym: Dumbbell,
    parking: MapPin,
    Waves: Waves,
    UtensilsCrossed: UtensilsCrossed
  };
  const router = useRouter();
  const randomImage = hotel.images.length > 0 ?
    hotel.images[Math.floor(Math.random() * hotel.images.length)] :
    "https://placehold.co/600x400";
  return (
    <Card className="group">

      <img
        alt="Hotel image"
        className="rounded-t-lg object-cover w-full aspect-[4/3] group-hover:opacity-80 transition-opacity"
        src={randomImage}
        height={300}
        width={400}
      />
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{hotel.name}</h3>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < hotel.rating ? 'text-primary' : 'text-muted'}`} />
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{hotel.city}</p>
        <p className="text-sm line-clamp-2">{hotel.description}</p>
        <div className="flex items-center gap-2">
          {hotel.amenities.map(amenity => {
            const Icon = amenitiesIcons[amenity];
            return Icon ? <Icon key={amenity} className="w-4 h-4" /> : null;
          })}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">Rs {hotel.cheapestPrice}/night</div>
          <Link href={`/hotel/${hotel._id}`}>
          <Button size="sm">Book Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
