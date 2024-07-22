import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const NoBookings: React.FC = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <h2 className="text-2xl font-bold mb-4">No Bookings Found</h2>
            <p className="text-lg mb-6">It looks like you haven't made any bookings yet.</p>
            <Button onClick={() => router.push('/')} className="bg-blue-500 hover:bg-blue-600 text-white">
                Search for a flight
            </Button>
        </div>
    );
};

export default NoBookings;
