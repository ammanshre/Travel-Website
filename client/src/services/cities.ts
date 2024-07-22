
import axios, { AxiosResponse, AxiosError } from 'axios';


export interface City {
    _id: string;
    city: string;
    lat: string;
    lng: string;
    country: string;
    iso2: string;
    admin_name: string;
    capital: string;
    population: number;
    population_proper: number;
    __v: number;
    createdAt: string;
    updatedAt: string;
}


interface ApiResponse<T> {
    data: T;
    message: string[];
    error: string;
}

export const getCities = async (): Promise<City[]> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/city/get`;  

    try {
        const response = await axios.get<City[]>(url);
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
