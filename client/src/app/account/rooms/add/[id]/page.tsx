"use client";
import React, { ChangeEvent, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarouselItem, CarouselContent, CarouselPrevious, CarouselNext, Carousel } from "@/components/ui/carousel";
import { UploadCloud as UploadIcon, Eraser as RemoveIcon } from 'lucide-react';
import Navbar from '@/components/navbar';
import RoomAmenities from '@/components/room/RoomAmenities';
import { createRoom, CreateRoomData } from '@/services/room';
import { uploadImage } from '@/services/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoomSchema, CreateRoomFormValues } from '@/schemas/createRoomSchema';
import { useAuth } from '@/hooks/useUserData';
import Loading from '@/components/Loading';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wifi, Tv, Beer, Lock, HandPlatter, Fan } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const amenities = [
  { name: 'wifi', Icon: Wifi },
  { name: 'mini-bar', Icon: Beer },
  { name: 'room safe', Icon: Lock },
  { name: 'room service', Icon: HandPlatter },
  { name: 'television', Icon: Tv },
  { name: 'air conditioning', Icon: Fan },
];

interface Image {
  file: File;
  id: number;
  name: string;
}

export default function CreateRoom() {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { getUserData } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImages = files.map((file, index) => ({
        file: file,
        id: new Date().getTime() + index,
        name: file.name
      }));
      setImages(prevImages => [...prevImages, ...newImages]);
    }
  };

  const removeImage = (id: number) => {
    setImages(images => images.filter(image => image.id !== id));
  };

  const handleAmenitiesChange = (selectedAmenities: string[]) => {
    setSelectedAmenities(selectedAmenities);
  };

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      type: 'single',
    }
  });

  const onSubmit: SubmitHandler<CreateRoomFormValues> = async (data) => {
    setLoading(true);

    try {
      // Upload images first
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          const uploadResponse = await uploadImage(image.file);
          return uploadResponse.imageUrl;
        })
      );

      const roomData: CreateRoomData = {
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        amenities: selectedAmenities,
        images: uploadedImages,
        hotelId: id as string,
        type: data.type,
      };

      const newRoom = await createRoom(roomData);
      console.log('Room created successfully:', newRoom);
      toast({
        title: "Success",
        description: "Room created successfully.",
        variant: "default",
      });
      setTimeout(() => {
        router.back();
      }, 2000);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Navbar />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto p-4 md:p-6">
            <div className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Room Name</Label>
                  <Input id="name" placeholder="Enter room name" {...register("name")} />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the room" {...register("description")} />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                  )}
                </div>
                <div className="space-y-2 ">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" placeholder="Enter room price" {...register("price", { valueAsNumber: true })} />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="Enter room quantity" {...register("quantity", { valueAsNumber: true })} />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm">{errors.quantity.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Room Type</Label>
                  <Select onValueChange={(value: string) => setValue("type", value as "single" | "double" | "suite" | "deluxe" | "presidential")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Types</SelectLabel>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                        <SelectItem value="deluxe">Deluxe</SelectItem>
                        <SelectItem value="presidential">Presidential</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-red-500 text-sm">{errors.type.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities</Label>
                  <RoomAmenities onAmenitiesChange={handleAmenitiesChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photos">Photos</Label>
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <UploadIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Drag and drop your photos here or click to upload.
                      </p>
                      <Input id="photos" multiple type="file" onChange={handleImageChange} />
                      {images.length > 0 ? images.map(image => (
                        <div key={image.id} className="flex justify-between items-center p-2 m-3 bg-gray-500 rounded-md hover:bg-gray-100 text-gray-600">
                          <span className="text-sm text-gray-800">{image.name}</span>
                          <button
                            onClick={() => removeImage(image.id)}
                            className="p-1 mx-2 rounded-full bg-red-500 hover:bg-red-700 text-white"
                            aria-label="Remove image"
                          >
                            <RemoveIcon size={16} />
                          </button>
                        </div>
                      )) : (
                        <div className="text-center p-2 text-sm text-gray-500">No images uploaded</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                <Button className="w-full" type="submit">
                  Create Room
                </Button>
              </form>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 md:p-6 space-y-4">
              <Carousel className="w-full max-w-[400px] mx-auto">
                <CarouselContent>
                  {images.length > 0 ? (
                    images.map(image => (
                      <CarouselItem key={image.id}>
                        {typeof window !== 'undefined' && (
                          <img
                            alt="Uploaded image"
                            className="rounded-lg w-full aspect-[4/3] object-cover"
                            src={URL.createObjectURL(image.file)}
                            width={400}
                            height={300}
                          />
                        )}
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem>
                      <img
                        alt="Placeholder image"
                        className="rounded-lg w-full aspect-[4/3] object-cover"
                        src="https://placehold.co/600x400"
                        width={400}
                        height={300}
                      />
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">{watch("name") || "Room Name"}</h2>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-300">{`Price: Rs ${watch("price") || "0"}`}</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-300">{`Quantity: ${watch("quantity") || "0"}`}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-300">{`Room Type: ${watch("type") || "Single"}`}</p>
                </div>
                <hr className="border-gray-300 dark:border-gray-700" />
                <p className="text-gray-500 dark:text-gray-400">
                  {watch("description") || 'Discover the perfect blend of comfort and style at Room Name. Our hotel offers a range of amenities to ensure your stay is unforgettable.'}
                </p>
                <hr className="border-gray-300 dark:border-gray-700" />
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedAmenities.map((amenity) => {
                    const Icon = amenities.find((a) => a.name === amenity)?.Icon;
                    return Icon ? (
                      <div key={amenity} className="flex items-center space-x-1">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{amenity}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
