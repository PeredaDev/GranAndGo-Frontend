import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { apiClient } from './api';

export const PaymentService = {
    /**
     * Creates a PayPal order and returns the approval link.
     */
    createOrder: async (amount: number, currency: string = 'MXN', returnUrl: string, cancelUrl: string) => {
        try {
            const response = await apiClient.post('/paypal/create-order', {
                amount,
                currency,
                returnUrl,
                cancelUrl
            });

            console.log("PayPal Response:", JSON.stringify(response, null, 2));

            if (!response || !response.approveLink) {
                throw new Error("No approval link returned from backend.");
            }

            return response.approveLink;
        } catch (error) {
            console.error("Create Order Error:", error);
            throw error;
        }
    },

    /**
     * Captures a PayPal order after user approval.
     */
    captureOrder: async (orderId: string) => {
        try {
            const response = await apiClient.post('/paypal/capture-order', {
                orderId
            });

            console.log("Capture Response:", JSON.stringify(response, null, 2));
            return response && response.status === 'COMPLETED';
        } catch (error) {
            console.error("Capture Order Error:", error);
            throw error;
        }
    },

    /**
     * Orchestrates the PayPal flow: Create -> Open Browser -> Capture
     */
    startPayPalFlow: async (amount: number) => {
        try {
            // 1. Create Order
            // Use a specific, non-application route for the redirect.
            // When returning, Expo Router will quickly render the blank dummy component 
            // instead of triggering a full navigation override on an active screen like `/payment`.
            const returnUrl = Linking.createURL('paypal-redirect');
            const cancelUrl = Linking.createURL('paypal-redirect');
            const approveLink = await PaymentService.createOrder(amount, 'MXN', returnUrl, cancelUrl);

            // 2. Open Browser
            const result = await WebBrowser.openAuthSessionAsync(
                approveLink,
                returnUrl
            );

            if (result.type === 'success' && result.url) {
                // Parse order ID (token) from URL if needed, or if the backend session handles it.
                // PayPal usually returns ?token=...&PayerID=...
                const { queryParams } = Linking.parse(result.url);
                const token = queryParams?.token;

                if (typeof token === 'string') {
                    // 3. Capture Order
                    const success = await PaymentService.captureOrder(token);
                    return { status: success ? 'approved' : 'failed', orderId: token };
                }
            }

            return { status: 'cancelled' };

        } catch (error) {
            console.error("PayPal Flow Error:", error);
            return { status: 'error', error };
        }
    }
};
