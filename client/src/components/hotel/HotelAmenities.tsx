import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DrawerTrigger, DrawerTitle, DrawerDescription, DrawerHeader, DrawerContent, Drawer } from "@/components/ui/drawer";
import { Wifi, ParkingSquare, Sun, Waves, Dumbbell, Droplets, Coffee, Beer, Bus, ConciergeBell, HandPlatter, Ban, Dog, WashingMachine, Fan, Presentation, Hotel } from 'lucide-react';

const amenities = [
  { name: 'wifi', Icon: Wifi },
  { name: 'parking', Icon: ParkingSquare },
  { name: 'pool', Icon: Waves },
  { name: 'gym', Icon: Dumbbell },
  { name: 'spa', Icon: Droplets },
  { name: 'restaurant', Icon: Coffee },
  { name: 'bar', Icon: Beer },
  { name: 'airport shuttle', Icon: Bus },
  { name: 'concierge', Icon: ConciergeBell },
  { name: 'room service', Icon: HandPlatter },
  { name: 'non-smoking rooms', Icon: Ban },
  { name: 'pet-friendly', Icon: Dog },
  { name: 'laundry service', Icon: WashingMachine },
  { name: 'air conditioning', Icon: Fan },
  { name: 'meeting rooms', Icon: Presentation },
];

interface ComponentProps {
  onAmenitiesChange: (selectedAmenities: string[]) => void;
}

export default function Component({ onAmenitiesChange }: ComponentProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    onAmenitiesChange(selectedAmenities);
  }, [selectedAmenities, onAmenitiesChange]);

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((amenity) => amenity !== name) : [...prev, name]
    );
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button className="flex items-center gap-2 w-full" variant="outline" onClick={() => setDrawerOpen(!drawerOpen)}>
          <Hotel className="w-5 h-5" />
          <span>
            {selectedAmenities.length > 0 ? `View Amenities (${selectedAmenities.length})` : "Add Amenities"}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full">
        <DrawerHeader>
          <DrawerTitle>Hotel Amenities</DrawerTitle>
          <DrawerDescription>Check out the amenities available at this hotel.</DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
          {amenities.map(({ name, Icon }) => (
            <div
              key={name}
              onClick={() => toggleAmenity(name)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                selectedAmenities.includes(name)
                  ? "bg-gray-300 dark:bg-gray-700"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium capitalize">{name.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
