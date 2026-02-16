// Simulate network delay (Deprecated)
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = {
    get: async (endpoint: string) => {
        try {
            // Check if URL is absolute
            const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
            console.log(`[API] Requesting: ${url}`);

            const response = await fetch(url);
            console.log(`[API] Response Status: ${response.status}`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    },
    post: async (endpoint: string, body: any) => {
        try {
            const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

            // Add 15s timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }
                return await response.json();
            } catch (fetchError: any) {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                    throw new Error('Request timed out. Please check your internet connection or try again.');
                }
                throw fetchError;
            }
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }
};

export type ApiResponse<T> = {
    data: T;
    status: number;
};
