import axios, { AxiosResponse, AxiosError } from 'axios';

// API Response Interface
interface ApiResponse<T> {
    data: T;
    message: string[];
    error: string;
}

// AI Chat Response Interface
interface AiChatResponse {
    response: string;
}

// Function to call the AI chat API
export const chatWithAi = async (message: string): Promise<string> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/flight/chat`;

    try {
        const response: AxiosResponse<{ response: string }> = await axios.post(url, { message });
        return response.data.response;
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
