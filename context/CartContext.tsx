import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

import { MenuOption } from '../services/MenuService';

export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
    toGoFee: number;
    selectedOptions: MenuOption[];
};

type CartContextType = {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    total: number;
    specialInstructions: string;
    setSpecialInstructions: (text: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [specialInstructions, setSpecialInstructions] = useState('');

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        setItems((prev) => {
            // Find item with exact same options
            const uniqueId = product.id + JSON.stringify(product.selectedOptions);

            const existingIndex = prev.findIndex((i) => (i.id + JSON.stringify(i.selectedOptions) === uniqueId));

            if (existingIndex >= 0) {
                const newItems = [...prev];
                newItems[existingIndex].quantity += 1;
                return newItems;
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (index: number) => {
        setItems((prev) => {
            const newArr = [...prev];
            newArr.splice(index, 1);
            return newArr;
        });
    };

    const clearCart = () => {
        setItems([]);
        setSpecialInstructions('');
    };

    const total = useMemo(() => {
        return items.reduce((sum, item) => {
            const base = item.price;
            const optionsCost = item.selectedOptions ? item.selectedOptions.reduce((acc, opt) => acc + opt.price, 0) : 0;
            const fee = item.toGoFee || 0;
            return sum + ((base + optionsCost + fee) * item.quantity);
        }, 0);
    }, [items]);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, specialInstructions, setSpecialInstructions }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}
