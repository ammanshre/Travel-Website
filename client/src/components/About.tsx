import * as React from "react"

export default function AboutSection() {
    return (
        <div className="container py-10">
            <div className="my-10 px-6">
                <h2 className="text-3xl font-bold text-center mb-8">About TravelPro</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <img src="/assets/engine.jpg" alt="About TravelPro" className="w-full h-auto rounded-lg shadow-lg" />
                    </div>
                    <div>
                        <p className="mt-6 leading-7 text-lg">
                            TravelPro is your one-stop shop for flights and hotels. Whether you're planning a vacation, business trip, or a quick getaway, we make booking easy and affordable. Our platform is designed to be user-friendly, especially for Mauritians, and includes features like carbon emissions tracking to help you travel responsibly. Join us today and start exploring the world with TravelPro!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
