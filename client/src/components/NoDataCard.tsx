
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { FileWarning } from "lucide-react"
export default function Component() {
    return (
        <Card className="flex flex-col items-center justify-center gap-4 p-8">
            <FileWarning color="#ffd500" />
            <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold">No Data Available</h3>
                <p className="text-gray-500 dark:text-gray-400">
                    There is currently no data to display. Please check back later or contact support for more information.
                </p>
            </div>
            <div className="flex justify-center">
                <Link
                    className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    href="/"
                >
                    Back to Home
                </Link>
            </div>
        </Card>
    )
}

