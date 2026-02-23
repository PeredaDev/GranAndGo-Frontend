import AsyncStorage from '@react-native-async-storage/async-storage';
import { delay } from './api';
import { CartItem } from '../context/CartContext';

export type OrderModel = {
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    instructions?: string;
};

const STORAGE_KEY = '@menu_app_orders';

export const OrderService = {
    createOrder: async (items: CartItem[], total: number, instructions?: string): Promise<string> => {
        try {
            // The backend expects `OrderOption.Id` to be an integer (Primary Key). 
            // The frontend CartItem contains string IDs (like "sugar_free"). 
            // Strip the string IDs from the payload so ASP.NET model binding doesn't throw a 400 Bad Request.
            const payloadItems = items.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                category: item.category,
                toGoFee: item.toGoFee,
                selectedOptions: item.selectedOptions ? item.selectedOptions.map(opt => ({
                    name: opt.name,
                    price: opt.price
                })) : []
            }));

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: payloadItems,
                    total,
                    instructions
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error("Server error response:", errText);
                throw new Error('Failed to create order on the server: ' + errText);
            }

            const data = await response.json();
            return data.id.toString(); // API returns an integer ID, convert to string for frontend routing
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    getOrders: async (): Promise<OrderModel[]> => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders`);

            if (!response.ok) {
                console.error("Failed to load orders from API", await response.text());
                return [];
            }

            const data = await response.json();

            // Map the integer IDs back to strings so the frontend components don't break
            return data.map((o: any) => ({
                ...o,
                id: o.id.toString()
            }));

        } catch (e) {
            console.error("Failed to fetch orders array", e);
            return [];
        }
    }
};
