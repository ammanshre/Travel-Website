import { User, MapPin, Car, Gauge, DollarSign } from "lucide-react";
import Link from "next/link";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Taxi {
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

interface TaxiCardProps {
  taxi: Taxi;
}

export default function TaxiCard({ taxi }: TaxiCardProps) {
  const router = useRouter();
  return (
    <Card className="group">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{taxi.make} {taxi.model}</h3>
          <div className="flex items-center gap-1">
            <Car className="w-4 h-4 text-muted" />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{taxi.city.city}</p>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <p className="text-sm">{taxi.owner.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <p className="text-sm">{taxi.city.admin_name}, {taxi.city.country}</p>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4" />
          <p className="text-sm">Year: {taxi.year}</p>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <p className="text-sm">Rate: Rs {taxi.ratePerKm}/km</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">Capacity: {taxi.capacity}</div>
          <Link href={`/taxi/${taxi._id}`}>
            <Button size="sm">Book Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
