import axios, { AxiosResponse, AxiosError } from 'axios';
import { Flight, FlightPricingProps, FlightBooking  } from '@/helper/types';

export interface Airport {
    id: string;
    name: string;
    detailedName: string;
    iataCode: string;
    geoCode: {
        latitude: number;
        longitude: number;
    };
    address: {
        cityName: string;
        cityCode: string;
        countryName: string;
        countryCode: string;
        regionCode: string;
    };
    analytics: {
        travelers: {
            score: number;
        };
    };
}

// API Response Interface
interface ApiResponse<T> {
    data: T;
    message: string[];
    error: string;
}

export const fetchAirports = async (keyword: string): Promise<Airport[]> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/flight/airports?keyword=${encodeURIComponent(keyword)}`;

    try {
        const response = await axios.get<Airport[]>(url);
        return response.data || []; // Ensure an array is always returned
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


export const fetchFlights = async (
    originLocationCode: string,
    destinationLocationCode: string,
    departureDate: string,
    adults: number,
    returnDate?: string
): Promise<Flight[]> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/flight/flights`;

    try {
        const response: AxiosResponse<ApiResponse<Flight[]>> = await axios.get(url, {
            params: {
                originLocationCode,
                destinationLocationCode,
                departureDate,
                adults,
                returnDate,
            },
        });

        return response.data.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<any>>;
        if (axiosError.response) {
            throw new Error(JSON.stringify({
                statusCode: axiosError.response.status,
                message: axiosError.response.data.message || ['An unexpected error occurred'],
                error: axiosError.response.data.error || 'Bad Request',
            }));
        } else {
            throw new Error(JSON.stringify({
                statusCode: 500,
                message: ['Network Error or Internal Server Error'],
                error: 'Server Error',
            }));
        }
    }
};

export const fetchFlightPricing = async (
    flightOffers: FlightPricingProps[]
): Promise<ApiResponse<FlightPricingProps[]>> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/flight/pricing`;

    try {
        const response: AxiosResponse<ApiResponse<FlightPricingProps[]>> = await axios.post(url, { flightOffers });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<any>>;
        if (axiosError.response) {
            throw new Error(JSON.stringify({
                statusCode: axiosError.response.status,
                message: axiosError.response.data.message || ['An unexpected error occurred'],
                error: axiosError.response.data.error || 'Bad Request',
            }));
        } else {
            throw new Error(JSON.stringify({
                statusCode: 500,
                message: ['Network Error or Internal Server Error'],
                error: 'Server Error',
            }));
        }
    }
};


export const bookFlight = async (
    flightOffer: any,
    travelerInfo: any[],
    contacts: any[],
    userId: string
): Promise<ApiResponse<any>> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/flight/book`;

    try {
        const response: AxiosResponse<ApiResponse<any>> = await axios.post(url, {
            flightOffer,
            travelerInfo,
            contacts,
            userId
        });

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<any>>;
        if (axiosError.response) {
            throw new Error(JSON.stringify({
                statusCode: axiosError.response.status,
                message: axiosError.response.data.message || ['An unexpected error occurred'],
                error: axiosError.response.data.error || 'Bad Request',
            }));
        } else {
            throw new Error(JSON.stringify({
                statusCode: 500,
                message: ['Network Error or Internal Server Error'],
                error: 'Server Error',
            }));
        }
    }
};

export const fetchFlightBookingsByUserId = async (userId: string): Promise<FlightBooking[]> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/flight/bookings/user/${userId}`;

    try {
        const response: AxiosResponse<FlightBooking[]> = await axios.get(url);
        return response.data || [];
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