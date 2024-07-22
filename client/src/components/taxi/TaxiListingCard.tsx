// components/account/TaxiListingCard.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash, Car } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
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

interface TaxiListingCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  capacity: number;
  ratePerKm: number;
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col md:flex-row items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800 my-2">
      <Skeleton className="aspect-video rounded-lg object-cover h-[120px] w-full md:w-[160px]" />
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

export default function TaxiListingCard({ id, make, model, year, licensePlate, color, capacity, ratePerKm,  loading }: TaxiListingCardProps) {
  const [showDialog, setShowDialog] = useState(false);

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <div className="flex flex-col md:flex-row items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800 my-2">
      <div className="aspect-video rounded-lg object-cover w-full md:w-40 md:h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <Car size={40} color='#3B82F6' />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{make} {model}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Year: {year}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">License Plate: {licensePlate}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Color: {color}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Capacity: {capacity}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Rate: Rs {ratePerKm} / km</p>
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
                  This action cannot be undone. This will permanently delete {make} {model}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowDialog(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  setShowDialog(false);
                }}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex flex-wrap gap-2 mt-8">
          <Link href={`/account/taxi/booking/${id}`}>
            <Button variant="secondary">View Bookings</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
