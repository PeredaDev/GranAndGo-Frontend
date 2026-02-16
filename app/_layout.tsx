import { Stack } from 'expo-router';
import { CartProvider } from '../context/CartContext';
import { OrdersProvider } from '../context/OrdersContext';

export default function RootLayout() {
    return (
        <OrdersProvider>
            <CartProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="cart" options={{ presentation: 'modal', title: 'Mi pedido' }} />
                    <Stack.Screen name="payment" options={{ title: 'Pagar' }} />
                    <Stack.Screen name="confirmation" options={{ title: 'Confirmación', headerShown: false }} />
                </Stack>
            </CartProvider>
        </OrdersProvider>
    );
}
