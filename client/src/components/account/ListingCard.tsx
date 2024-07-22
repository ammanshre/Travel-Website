import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
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
import { deleteHotel } from '@/services/hotel';  // Import the delete service
import { LoadingButton } from '@/components/ui/loading-button';  // Import LoadingButton
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface ListingCardProps {
  id: string;
  title: string;
  pricePerNight: number;
  description: string;
  imageUrl: string;
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

export default function ListingCard({ id, title, pricePerNight, description, imageUrl, loading }: ListingCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteHotel(id);
      setShowDialog(false);

      toast({
        title: "Success",
        description: `${title} has been deleted successfully.`,
        variant: "default",
      });

      // Refresh or update the list of hotels here as needed
    } catch (error) {
      console.error('Error deleting hotel:', error);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <div className="flex flex-col md:flex-row items-start gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800 my-2">
      <img
        alt="Hotel Image"
        className="aspect-video rounded-lg object-cover w-full md:w-40 md:h-40"
        src={imageUrl}
      />
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">${pricePerNight} / night</p>
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
                  This action cannot be undone. This will permanently delete {title}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowDialog(false)}>Cancel</AlertDialogCancel>
                <LoadingButton
                  onClick={handleDelete}
                  loading={deleting}
                  disabled={deleting}
                >
                  Continue
                </LoadingButton>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 break-words">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-8">
          <Link href={`/account/rooms/${id}`}>
            <Button variant="secondary">View Room</Button>
          </Link>
          <Link href={`/account/bookings/${id}`}>
            <Button variant="outline">View Bookings</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
