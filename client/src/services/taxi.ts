import axios, { AxiosResponse, AxiosError } from 'axios';

export interface Taxi {
    _id: string;
    owner: {
        _id: string;
        username: string;
        email: string;
        role: string;
        name: string;
        createdAt: string;
        updatedAt: string;
    };
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    capacity: number;
    ratePerKm: number;
    available: boolean;
    location: {
        type: string;
        coordinates: number[];
        address: string;
    };
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

export interface CreateTaxi {
   
    owner: string,
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    capacity: number;
    ratePerKm: number;
    available: boolean;
    location: {
        type: string;
        coordinates: number[];
    };
    city: string,
   
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

export interface TaxiBooking {
    _id: string;
    user: User;
    taxi: TaxiBook;
    pickupLocation: Location;
    dropoffLocation: Location;
    fare: number;
    distance: number;
    bookingStatus: string;
    bookingTime: string;
    createdAt: string;
    updatedAt: string;
}


interface TaxiBook {
    _id: string;
    owner: {
        _id: string;
        username: string;
        email: string;
        role: string;
        name: string;
        createdAt: string;
        updatedAt: string;
    };
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
interface ApiResponse<T> {
    data: T;
    message: string[];
    error: string;
}

export const getTaxiList = async (): Promise<Taxi[]> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/taxi/get`;  

    try {
        const response = await axios.get<Taxi[]>(url);
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

export const createTaxi = async (taxiData: CreateTaxi): Promise<Taxi> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/taxi/create`;

    try {
        const response: AxiosResponse<Taxi> = await axios.post(url, taxiData);
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

export const getTaxisByUserId = async (userId: string): Promise<Taxi[]> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/taxi/listings/taxi/${userId}`;

    try {
        const response: AxiosResponse<Taxi[]> = await axios.get(url);
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

export const getTaxiById = async (id: string): Promise<Taxi> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/taxi/${id}`;
  
    try {
      const response: AxiosResponse<Taxi> = await axios.get(url);
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

export const createTaxiBooking = async (bookingData: {
    user: string;
    taxi: string;
    pickupLocation: {
        type: string;
        coordinates: number[];
        address: string;
    };
    dropoffLocation: {
        type: string;
        coordinates: number[];
        address: string;
    };
    fare: number;
    distance: number;
    bookingStatus: string;
}): Promise<void> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/taxi/booking/create`;

    try {
        await axios.post(url, bookingData);
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

