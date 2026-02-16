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
        await delay(1000); // Simulate server
        const newOrder: OrderModel = {
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            date: new Date().toISOString(),
            items,
            total,
            instructions,
        };

        // Persist
        const existing = await OrderService.getOrders();
        const updated = [newOrder, ...existing];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        return newOrder.id;
    },

    getOrders: async (): Promise<OrderModel[]> => {
        await delay(500);
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            return json ? JSON.parse(json) : [];
        } catch (e) {
            console.error("Failed to load orders", e);
            return [];
        }
    }
};
