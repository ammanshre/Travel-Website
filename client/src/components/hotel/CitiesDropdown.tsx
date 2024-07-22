"use client";

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCities, City } from "@/services/cities";

export function CityCombobox({ onSelectCity }: { onSelectCity: (city: City) => void }) {
    const [cities, setCities] = useState<City[]>([]);
    const [value, setValue] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const fetchedCities = await getCities();
                setCities(fetchedCities || []);
            } catch (error) {
                console.error('Failed to fetch cities:', error);
            }
        };

        fetchCities();
    }, []);

    const handleSelectCity = (cityId: string) => {
        const selectedCity = cities.find(city => city._id === cityId);
        if (selectedCity) {
            setValue(cityId);
            onSelectCity(selectedCity);
        }
    };

    return (
        <Select value={value} onValueChange={handleSelectCity}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select city..." />
            </SelectTrigger>
            <SelectContent className="w-full">
                <SelectGroup>
                    <SelectLabel>Cities</SelectLabel>
                    {cities && cities.map((city) => (
                        <SelectItem key={city._id} value={city._id}>
                            {city.city}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
