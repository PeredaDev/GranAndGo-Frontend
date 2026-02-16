import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from './CartContext';
import { OrderService, OrderModel } from '../services/OrderService';

type OrdersContextType = {
    orders: OrderModel[];
    addOrder: (items: CartItem[], total: number, instructions?: string) => Promise<string>;
    refreshOrders: () => Promise<void>;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
    const [orders, setOrders] = useState<OrderModel[]>([]);

    const refreshOrders = async () => {
        const data = await OrderService.getOrders();
        setOrders(data);
    };

    useEffect(() => {
        refreshOrders();
    }, []);

    const addOrder = async (items: CartItem[], total: number, instructions?: string) => {
        const id = await OrderService.createOrder(items, total, instructions);
        await refreshOrders();
        return id;
    };

    return (
        <OrdersContext.Provider value={{ orders, addOrder, refreshOrders }}>
            {children}
        </OrdersContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrdersContext);
    if (!context) throw new Error('useOrders must be used within a OrdersProvider');
    return context;
}
