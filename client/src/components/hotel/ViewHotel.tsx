import { CarouselItem, CarouselContent, CarouselPrevious, CarouselNext, Carousel } from "@/components/ui/carousel";
import {
  Wifi,
  ParkingSquare,
  Waves,
  Dumbbell,
  Droplets,
  Coffee,
  Beer,
  Bus,
  ConciergeBell,
  HandPlatter,
  Ban,
  Dog,
  WashingMachine,
  Fan,
  Presentation,
  Star,
  Sun,
  Wallet,
} from 'lucide-react';
import { Hotel } from '@/services/hotel';

const amenitiesMapping: Record<string, typeof Wifi> = {
  'wifi': Wifi,
  'parking': ParkingSquare,
  'pool': Waves,
  'gym': Dumbbell,
  'spa': Droplets,
  'restaurant': Coffee,
  'bar': Beer,
  'airport shuttle': Bus,
  'concierge': ConciergeBell,
  'room service': HandPlatter,
  'non-smoking rooms': Ban,
  'pet-friendly': Dog,
  'laundry service': WashingMachine,
  'air conditioning': Fan,
  'meeting rooms': Presentation,
};

interface HotelProps {
  hotel: Hotel;
}

const Component: React.FC<HotelProps> = ({ hotel }) => {
  const { name, address, rating, description, amenities, images } = hotel;

  return (
    <div className="grid gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 xl:max-w-6xl xl:mx-auto">
      <div className="grid gap-6">
        <Carousel className="rounded-xl overflow-hidden">
          <CarouselContent>
            {images.length > 0 ? images.map((image, index) => (
              <CarouselItem key={index}>
                <img
                  alt={`Hotel Image ${index + 1}`}
                  className="aspect-video object-cover"
                  height={600}
                  src={image}
                  width={800}
                />
              </CarouselItem>
            )) : (
              <CarouselItem>
                <img
                  alt="Placeholder Image"
                  className="aspect-video object-cover"
                  height={600}
                  src="https://placehold.co/600x400"
                  width={800}
                />
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{name}</h2>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-primary" />
              <span className="text-lg font-medium">{rating}</span>
            </div>
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            {description}
          </div>
        </div>
      </div>
      <div className="grid gap-8">
        <div>
          <h3 className="text-lg font-bold">Amenities</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {amenities.map((amenity, index) => {
              const Icon = amenitiesMapping[amenity];
              return (
                <div key={index} className="flex items-center gap-2">
                  {Icon ? <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : null}
                  <span>{amenity.replace(/-/g, ' ')}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <h3 className="text-lg font-bold">Location</h3>
          <div className="text-gray-500 dark:text-gray-400 mt-4">{address}</div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <h3 className="text-lg font-bold">Policies</h3>
          <div className="text-gray-500 dark:text-gray-400 mt-4">
            <ul className="space-y-2">
              <li>Check-in: 3:00 PM</li>
              <li>Check-out: 12:00 PM</li>
              <li>Cancellation: 24 hours prior to arrival</li>
              <li>Pets allowed with additional fee</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Component;
