"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CardContent, Card } from "@/components/ui/card";
import { FileWarning } from "lucide-react";
interface ErrorCardProps {
    message: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({  message }) => {
    const router = useRouter();

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center gap-6 p-8">
                <div className="bg-red-100 dark:bg-red-900 rounded-full p-6">

                    <FileWarning color="#ff6161" className="h-12 w-12 text-red-500 dark:text-red-400" />

                </div>
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold">Error</h2>
                    <p className="text-gray-500 dark:text-gray-400">{message}</p>
                </div>
                <button
                    className="inline-flex h-10 items-center justify-center rounded-md bg-red-500 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-red-400 dark:text-gray-950 dark:hover:bg-red-300"
                    onClick={() => router.back()}
                >
                    Back to previous page
                </button>
            </CardContent>
        </Card>
    );
};



export default ErrorCard;
