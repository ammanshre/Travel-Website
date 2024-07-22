import axios, { AxiosResponse, AxiosError } from 'axios';

export interface RoomBooking {
    roomId: string;
    quantity: number;
}

export interface CreateBookingData {
    userId: string;
    transactionId: string;
    hotelId: string;
    rooms: RoomBooking[];
    totalAmount: number;
    isPaid: boolean;
    checkInDate: string;
    checkOutDate: string;
}

interface ApiResponse<T> {
    data: T;
    message: string[];
    error: string;
}

export interface User {
    id: {
        _id: string;
        username: string;
        email: string;
        name: string;
        // Add other fields if necessary
    };
    name: string;
    email: string;
}

export interface Room {
    room: {
        _id: string;
        hotel: string;
        type: string;
        price: number;
        quantity: number;
        amenities: string[];
        images: string[];
        description: string;
        // Add other fields if necessary
    };
    quantity: number;
    _id: string;
}

export interface Booking {
    _id: string;
    transactionId: string;
    user: User;
    hotel: {
        _id: string;
        name: string;
        address: string;
        city: string;
        images: string[];
        // Add other fields if necessary
    };
    rooms: Room[];
    totalAmount: number;
    isPaid: boolean;
    checkInDate: string;
    checkOutDate: string;
    createdAt: string;
    updatedAt: string;
}

interface BookingResponse {
    message: string;
    bookings: Booking[];
}

export const getBookingsByHotelId = async (hotelId: string): Promise<BookingResponse> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/booking/hotel/${hotelId}`;

    try {
        const response: AxiosResponse<BookingResponse> = await axios.get(url);
        return response.data;
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

export const getBookingsByUserId = async (userId: string): Promise<BookingResponse> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/booking/user/${userId}`;

    try {
        const response: AxiosResponse<BookingResponse> = await axios.get(url);
        return response.data;
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

export const createBooking = async (bookingData: CreateBookingData): Promise<Booking> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/booking/create`;

    try {
        const response: AxiosResponse<Booking> = await axios.post(url, bookingData);
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