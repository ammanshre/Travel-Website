"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInformationFormProps {
  onFormSubmit: (formData: any) => void;
}

interface Phone {
  deviceType: string;
  countryCallingCode: string;
  number: string;
}

interface Address {
  lines: string[];
  postalCode: string;
  cityName: string;
  countryCode: string;
}

interface ContactInformationData {
  addresseeName: {
    firstName: string;
    lastName: string;
  };
  companyName: string;
  purpose: string;
  phones: Phone[];
  emailAddress: string;
  address: Address;
}

export default function ContactInformationForm({ onFormSubmit }: ContactInformationFormProps) {
  const [formData, setFormData] = React.useState<ContactInformationData>({
    addresseeName: {
      firstName: "",
      lastName: ""
    },
    companyName: "",
    purpose: "STANDARD",
    phones: [
      {
        deviceType: "LANDLINE",
        countryCallingCode: "34",
        number: "480080076"
      },
      {
        deviceType: "MOBILE",
        countryCallingCode: "34",
        number: "480080072"
      }
    ],
    emailAddress: "",
    address: {
      lines: [""],
      postalCode: "",
      cityName: "Paris",
      countryCode: "FR"
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    onFormSubmit({ ...formData, [name]: value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value
      }
    }));
    onFormSubmit({ ...formData, address: { ...formData.address, [name]: value } });
  };

  const handlePhoneChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      phones: prevData.phones.map((phone, i) =>
        i === index ? { ...phone, [name]: value } : phone
      )
    }));
    onFormSubmit({ ...formData, phones: formData.phones.map((phone, i) =>
      i === index ? { ...phone, [name]: value } : phone) });
  };

  return (
    <form>
      <div className="contact-information-form mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.addresseeName.firstName}
              onChange={(e) => setFormData((prevData) => ({
                ...prevData,
                addresseeName: {
                  ...prevData.addresseeName,
                  firstName: e.target.value
                }
              }))}
              placeholder="First Name"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.addresseeName.lastName}
              onChange={(e) => setFormData((prevData) => ({
                ...prevData,
                addresseeName: {
                  ...prevData.addresseeName,
                  lastName: e.target.value
                }
              }))}
              placeholder="Last Name"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Company Name"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              name="purpose"
              type="text"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Purpose"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1">
            <Label htmlFor="emailAddress">Email Address</Label>
            <Input
              id="emailAddress"
              name="emailAddress"
              type="email"
              value={formData.emailAddress}
              onChange={handleInputChange}
              placeholder="Email Address"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1">
            <Label htmlFor="addressLine">Address Line</Label>
            <Input
              id="addressLine"
              name="lines"
              type="text"
              value={formData.address.lines}
              onChange={handleAddressChange}
              placeholder="Address Line"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              type="text"
              value={formData.address.postalCode}
              onChange={handleAddressChange}
              placeholder="Postal Code"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
