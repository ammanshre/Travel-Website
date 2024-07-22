import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RoomCardProps {
  name: string;
  type: string;
  price: number;
  description: string;
  imageUrl: string;
  loading?: boolean;
}

function SkeletonRoomCard() {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800 my-2">
      <Skeleton className="aspect-video rounded-lg object-cover h-[120px] w-[160px]" />
      <div className="flex-1 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export default function RoomCard({ name, type, price, description, imageUrl, loading }: RoomCardProps) {
  const [showDialog, setShowDialog] = useState(false);

  if (loading) {
    return <SkeletonRoomCard />;
  }

  return (
    <div className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800 my-2">
      <img
        alt="Room Image"
        className="aspect-video rounded-lg object-cover"
        height={120}
        src={imageUrl}
        width={160}
      />
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{name}</h3>
            <h5 className="font-medium text-gray-300">{type}</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">${price} / night</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                size="icon"
                variant="ghost"
                onClick={() => setShowDialog(true)}
              >
                <Trash className="h-5 w-5" />
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the {type} room.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowDialog(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  // Handle the delete action here
                  setShowDialog(false);
                }}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}
