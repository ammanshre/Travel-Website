import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ServicesSection() {
    return (
        <div className="container">
            <div className="my-10 px-6">
                <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Flight Bookings</CardTitle>
                            <CardDescription>Book flights to your favorite destinations with ease.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <img src="/assets/plane.jpg" alt="Flight Booking" className="w-full h-40 object-cover rounded-lg" />
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Hotel Reservations</CardTitle>
                            <CardDescription>Find and book the best hotels at great prices.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <img src="/assets/hotel.jpg" alt="Hotel Booking" className="w-full h-40 object-cover rounded-lg" />
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Carbon Emissions Tracking</CardTitle>
                            <CardDescription>Track the carbon emissions of your travels.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <img src="/assets/carbon.jpg" alt="Carbon Emissions" className="w-full h-40 object-cover rounded-lg" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    )
}
