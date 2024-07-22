"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/DatePicker";  // Assuming DatePicker is in the same directory

interface TravelerFormProps {
  onFormSubmit: (formData: TravelerData) => void;
}

interface Phone {
  deviceType: string;
  countryCallingCode: string;
  number: string;
}

interface Document {
  documentType: string;
  birthPlace: string;
  issuanceLocation: string;
  issuanceDate: string;
  number: string;
  expiryDate: string;
  issuanceCountry: string;
  validityCountry: string;
  nationality: string;
  holder: boolean;
}

interface TravelerData {
  id: string;
  dateOfBirth: string;
  name: {
    firstName: string;
    lastName: string;
  };
  gender: string;
  contact: {
    emailAddress: string;
    phones: Phone[];
  };
  documents: Document[];
}

export default function TravelersForm({ onFormSubmit }: TravelerFormProps) {
  const [formData, setFormData] = React.useState<TravelerData>({
    id: "1",
    dateOfBirth: "1982-01-16",
    name: {
      firstName: "",
      lastName: ""
    },
    gender: "MALE",
    contact: {
      emailAddress: "testuser@gmail.com",
      phones: [
        {
          deviceType: "MOBILE",
          countryCallingCode: "34",
          number: "480080076"
        }
      ]
    },
    documents: [
      {
        documentType: "PASSPORT",
        birthPlace: "Madrid",
        issuanceLocation: "Madrid",
        issuanceDate: "2015-04-14",
        number: "214214124124",
        expiryDate: "2025-04-14",
        issuanceCountry: "ES",
        validityCountry: "ES",
        nationality: "ES",
        holder: true
      }
    ]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    onFormSubmit({ ...formData, [name]: value });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      name: {
        ...prevData.name,
        [name]: value
      }
    }));
    onFormSubmit({ ...formData, name: { ...formData.name, [name]: value } });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      contact: {
        ...prevData.contact,
        phones: prevData.contact.phones.map(phone => ({ ...phone, [name]: value }))
      }
    }));
    onFormSubmit({ ...formData, contact: { ...formData.contact, phones: formData.contact.phones.map(phone => ({ ...phone, [name]: value })) } });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const newDate = date.toISOString().split("T")[0];
      setFormData((prevData) => ({
        ...prevData,
        dateOfBirth: newDate
      }));
      onFormSubmit({ ...formData, dateOfBirth: newDate });
    }
  };

  return (
    <form>
      <div className="traveler-form mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.name.firstName}
              onChange={handleNameChange}
              placeholder="First Name"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.name.lastName}
              onChange={handleNameChange}
              placeholder="Last Name"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
           <div>
           <DatePicker selected={new Date(formData.dateOfBirth)} onSelect={handleDateChange} />
           </div>
          </div>
        </div>
      </div>
    </form>
  );
}
