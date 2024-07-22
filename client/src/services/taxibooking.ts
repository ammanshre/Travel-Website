import axios, { AxiosResponse, AxiosError } from 'axios';

export interface Location {
    type: string;
    coordinates: number[];
    address: string;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Taxi {
    _id: string;
    owner: string; // Update this to string to match the expected data type
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    capacity: number;
    ratePerKm: number;
    available: boolean;
    location: Location;
    city: {
        _id: string;
        city: string;
        country: string;
        admin_name: string;
        lat: string;
        lng: string;
        population: number;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface TaxiBooking {
    _id: string;
    user: User;
    taxi: Taxi;
    pickupLocation: Location;
    dropoffLocation: Location;
    fare: number;
    distance: number;
    bookingStatus: string;
    bookingTime: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse<T> {
    data: T;
    message: string[];
    error: string;
}

export const getTaxiBookingsByUserId = async (userId: string): Promise<TaxiBooking[]> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/taxi/bookings/user/${userId}`;

    try {
        const response: AxiosResponse<TaxiBooking[]> = await axios.get(url);
        if (response.data) {
            return response.data;
        }
        throw new Error('No data received');
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<any>>;
        if (axiosError.response) {
            throw new Error(JSON.stringify({
                statusCode: axiosError.response.status,
                message: axiosError.response.data.message || ['An unexpected error occurred'],
                error: axiosError.response.data.error || 'Bad Request'
            }));
        } else {
            throw new Error(JSON.stringify({
                statusCode: 500,
                message: ['Network Error or Internal Server Error'],
                error: 'Server Error'
            }));
        }
    }
};



export const getTaxiBookingsByTaxiId = async (taxiId: string): Promise<TaxiBooking[]> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/taxi/bookings/taxi/${taxiId}`;

    try {
        const response: AxiosResponse<TaxiBooking[]> = await axios.get(url);
        if (response.data) {
            return response.data;
        }
        throw new Error('No data received');
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<any>>;
        if (axiosError.response) {
            throw new Error(JSON.stringify({
                statusCode: axiosError.response.status,
                message: axiosError.response.data.message || ['An unexpected error occurred'],
                error: axiosError.response.data.error || 'Bad Request'
            }));
        } else {
            throw new Error(JSON.stringify({
                statusCode: 500,
                message: ['Network Error or Internal Server Error'],
                error: 'Server Error'
            }));
        }
    }
};
