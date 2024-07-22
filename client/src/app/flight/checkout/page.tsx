"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import TravelersForm from '@/components/flight/CheckoutForm';
import ContactInformationForm from '@/components/flight/ContactInformationForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Loading from '@/components/Loading';
import {payFlight} from '@/services/payment';

export default function FlightCheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [travelerData, setTravelerData] = useState(null);
  const [contactInfoData, setContactInfoData] = useState<ContactInfoData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  interface ContactInfoData {
    emailAddress: string;
  }

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  const handleTravelerData = (formData: any) => {
    setTravelerData(formData);
    if (isClient) {
      localStorage.setItem("travelerData", JSON.stringify(travelerData));
    }
  };

  const handleContactInfoData = (formData: any) => {
    setContactInfoData(formData);
    if (isClient) {
      localStorage.setItem("contactInfoData", JSON.stringify(contactInfoData));
    }
  };

  const callBookingEndpoint = async () => {
    if (isClient) {
      const price = localStorage.getItem("bookingPrice");
      console.log("Retrieved price from localStorage:", price); // Debug log

      if (price && contactInfoData && contactInfoData.emailAddress) {
        try {
          setLoading(true);
          // Trim and parse the price string
          const trimmedPrice = price.trim();
          console.log("Trimmed price:", trimmedPrice); // Debug log

          const amountInMUR = parseFloat(JSON.parse(trimmedPrice));
          console.log("Converted amountInMUR:", amountInMUR); // Debug log

          if (isNaN(amountInMUR)) {
            throw new Error("Invalid price value, cannot convert to number.");
          }

          const response = await payFlight(contactInfoData.emailAddress, amountInMUR);
          setLoading(false);
          setCheckoutUrl(response.url);
        } catch (error) {
          setLoading(false);
          console.error("Error during payment processing:", error);
        }
      } else {
        console.error("Missing required data: price or contact information.");
      }
    }
  };

  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Flight Checkout</h1>
        </div>
        <div className="flex justify-center gap-8 flex-col">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Traveler Information</CardTitle>
            </CardHeader>
            <CardContent>
              <TravelersForm onFormSubmit={handleTravelerData} />
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactInformationForm onFormSubmit={handleContactInfoData} />
            </CardContent>
          </Card>
        </div>
        <Separator />
        <div className="flex justify-end mt-4">
          <Button variant="default" onClick={callBookingEndpoint}>Submit</Button>
        </div>
      </div>
    </div>
  );
}
