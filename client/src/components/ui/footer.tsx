
import Link from "next/link"

export default function Footer() {
    return (
        <div className="dark bg-background text-white py-8">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-center">
                <p className="mt-4 md:mt-0 text-sm text-gray-300">&copy; 2024 TravelPro Inc. All rights reserved.</p>
            </div>
        </div>
    )
}
