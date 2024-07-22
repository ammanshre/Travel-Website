
import { getCookie } from 'cookies-next';
import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';

interface TokenData {
    exp: number;
    iat: number;
    [key: string]: any;
}

export const useAuthToken = (): TokenData | null => {
    const [tokenData, setTokenData] = useState<TokenData | null>(null);


    function parseJwt(token: string) {
        if (!token) { return; }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }
    useEffect(() => {
        const token = getCookie('token') as string | undefined;

        if (token) {
            try {
                const decoded = parseJwt(token);
                setTokenData(decoded);
            } catch (error) {
                console.error("Failed to decode token:", error);
                setTokenData(null);
            }
        }
    }, []);

    return tokenData;
};
