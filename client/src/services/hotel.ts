
import axios, { AxiosResponse, AxiosError } from 'axios';


export interface Hotel {
    _id: string;
    name: string;
    address: string;
    city: string;
    longitude: string;
    latitude: string;
    cheapestPrice: number;
    description: string;
    rating: number;
    amenities: string[];
    images: string[];
    rooms: any[];  
    cityId: string;
    user: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface CreateHotelData {
    name: string;
    address: string;
    city: string;
    longitude: string;
    latitude: string;
    cheapestPrice: number;
    description: string;
    rating: number;
    amenities: string[];
    images: string[];
    rooms?: string[];
    cityId: string;
    user: string;
}



interface ApiResponse<T> {
    data: T;
    message: string[];
    error: string;
}


export const getHotelList = async (): Promise<Hotel[]> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/hotel/get`;  

    try {
        const response = await axios.get<Hotel[]>(url);
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


export const createHotel = async (hotelData: CreateHotelData): Promise<Hotel> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/hotel/create`;

    try {
        const response: AxiosResponse<Hotel> = await axios.post(url, hotelData);
        if (response.data && response.data) {
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



export const getHotelsByUserId = async (userId: string): Promise<Hotel[]> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/hotel/user/${userId}`;

    try {
        const response: AxiosResponse<Hotel[]> = await axios.get(url);
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

export const getHotelById = async (id: string): Promise<Hotel> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/hotel/${id}`;
  
    try {
      const response: AxiosResponse<Hotel> = await axios.get(url);
      if (response.data) {
        return response.data;
      }
      throw new Error('No data received');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<any>>;
      if (axiosError.response) {
        throw new Error(
          JSON.stringify({
            statusCode: axiosError.response.status,
            message: axiosError.response.data.message || ['An unexpected error occurred'],
            error: axiosError.response.data.error || 'Bad Request',
          })
        );
      } else {
        throw new Error(
          JSON.stringify({
            statusCode: 500,
            message: ['Network Error or Internal Server Error'],
            error: 'Server Error',
          })
        );
      }
    }
  };

  export const deleteHotel = async (id: string): Promise<void> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/hotel/delete/${id}`;

    try {
        await axios.delete(url);
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