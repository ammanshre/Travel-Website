// src/services/room.ts
import axios, { AxiosResponse, AxiosError } from 'axios';

export interface Room {
    name: string;
    _id: string;
    hotel: string;
    type: string;
    price: number;
    quantity: number;
    amenities: string[];
    images: string[];
    inventory: object[];
    description: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateRoomData {
    hotelId: string;
    name: string;
    type: 'single' | 'double' | 'suite' | 'deluxe' | 'presidential';
    price: number;
    quantity: number;
    amenities: string[];
    images: string[];
    description: string;
  }

  


interface ApiResponse<T> {
    data: T;
    message: string[];
    error: string;
}

export const getRoomsByHotel = async (hotelId: string): Promise<Room[]> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/room/get/${hotelId}`;

    try {
        const response: AxiosResponse<Room[]> = await axios.get(url);
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


export const createRoom = async (roomData: CreateRoomData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/room/create`, roomData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || 'An unexpected error occurred');
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  };