import axios, { AxiosResponse, AxiosError } from 'axios';

interface ApiResponse<T> {
    data: T;
    message: string[];
    error: string;
}

interface PayHotelResponse {
    message: string;
    checkoutUrl: string;
}


interface PayFlightResponse {
    url: string;
}
export const payHotel = async (email: string, amount: number): Promise<PayHotelResponse> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/booking/payhotel`;

    try {
        const response: AxiosResponse<PayHotelResponse> = await axios.post(url, { email, amount });
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


export const payFlight = async (email: string, amountInMUR: number): Promise<PayFlightResponse> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/flight/pay`;

    try {
        const response: AxiosResponse<PayFlightResponse> = await axios.post(url, { email, amountInMUR });
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