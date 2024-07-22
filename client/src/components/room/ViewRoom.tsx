import React, { useState, useEffect } from 'react';
import { CarouselItem, CarouselContent, CarouselPrevious, CarouselNext, Carousel } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wifi, Tv, Beer, Lock, HandPlatter, Fan, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const amenitiesMapping: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  'wifi': Wifi,
  'mini-bar': Beer,
  'room safe': Lock,
  'room service': HandPlatter,
  'air conditioning': Fan,
  'television': Tv,
};

export interface Room {
  name: string;
  _id: string;
  hotel: string;
  type: string;
  price: number;
  quantity: number;
  amenities: string[];
  images: string[];
  inventory: object[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface RoomViewProps {
  room: Room;
  onCounterChange: (roomId: string, count: number) => void;
}

const RoomView: React.FC<RoomViewProps> = ({ room, onCounterChange }) => {
  const { name, type, price, description, amenities, images, _id } = room;
  const [counterVisible, setCounterVisible] = useState(false);
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (counterVisible) {
      onCounterChange(_id, count);
    } else {
      onCounterChange(_id, 0);
    }
  }, [counterVisible, _id]);

  const handleBookRoom = () => {
    setCounterVisible((prev) => {
      const newVisible = !prev;
      if (!newVisible) {
        onCounterChange(_id, 0);
      } else {
        onCounterChange(_id, count);
      }
      return newVisible;
    });
  };

  const handleIncrement = () => {
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      onCounterChange(_id, newCount);
      return newCount;
    });
  };

  const handleDecrement = () => {
    setCount((prevCount) => {
      if (prevCount > 1) {
        const newCount = prevCount - 1;
        onCounterChange(_id, newCount);
        return newCount;
      } else {
        setCounterVisible(false);
        onCounterChange(_id, 0);
        return 1;
      }
    });
  };

  return (
    <Card className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto my-2 p-4 lg:px-6 sm:py-8 md:py-10">
      <div className="grid gap-4">
        <Carousel className="rounded-lg overflow-hidden">
          <CarouselContent>
            {images.length > 0 ? images.map((image, index) => (
              <CarouselItem key={index}>
                <img
                  alt={`Room Image ${index + 1}`}
                  className="aspect-[4/3] object-cover"
                  height={600}
                  src={image}
                  width={800}
                />
              </CarouselItem>
            )) : (
              <CarouselItem>
                <img
                  alt="Placeholder Image"
                  className="aspect-[4/3] object-cover"
                  height={600}
                  src="https://placehold.co/600x400"
                  width={800}
                />
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/50 hover:bg-white/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:bg-gray-950/50 dark:hover:bg-gray-950/75 dark:focus-visible:ring-gray-300">
            <ChevronLeft className="w-6 h-6" />
          </CarouselPrevious>
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/50 hover:bg-white/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:bg-gray-950/50 dark:hover:bg-gray-950/75 dark:focus-visible:ring-gray-300">
            <ChevronRight className="w-6 h-6" />
          </CarouselNext>
        </Carousel>
      </div>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
          </div>
          <div className="text-xl font-bold">Rs {price}/night</div>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            {amenities.map((amenity, index) => {
              const Icon = amenitiesMapping[amenity];
              return (
                <div key={index} className="flex items-center gap-2">
                  {Icon ? <Icon className="w-6 h-6" /> : null}
                  <span>{amenity.replace(/-/g, ' ')}</span>
                </div>
              );
            })}
          </div>
          <div className="prose">
            <p>{description}</p>
          </div>
          <Badge className="px-4 py-2 rounded-full text-sm font-medium" variant="secondary">
            {type}
          </Badge>
          {!counterVisible && (
            <Button className="w-full" size="lg" onClick={handleBookRoom}>
              Select Room
            </Button>
          )}

          <AnimatePresence>
            {counterVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center justify-between mt-4"
              >
                <Button onClick={handleDecrement} size="lg">-</Button>
                <span className="text-xl font-bold">{count}</span>
                <Button onClick={handleIncrement} size="lg">+</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
};

export default RoomView;
