import axios, { AxiosResponse, AxiosError } from 'axios';

export interface Analytics {
    totalListings: number;
    totalTransactions: number;
    totalRevenue: number;
    totalRevenueForCurrentMonth: number;
    percentageChangeInBookings: number;
}

interface ApiResponse<T> {
    data: T;
    message: string[];
    error: string;
}

export const getAnalytics = async (): Promise<Analytics> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/booking/analytics`;

    try {
        const response: AxiosResponse<{ analytics: Analytics }> = await axios.get(url);
        if (response.data) {
            return response.data.analytics;
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
