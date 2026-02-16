import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useRouter } from 'expo-router';
import { PaymentService } from '../services/PaymentService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PaymentScreen() {
    const { items, total, clearCart, specialInstructions, setSpecialInstructions } = useCart();
    const { addOrder } = useOrders();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const handlePayment = async () => {
        setSubmitting(true);
        try {
            // 1. Start PayPal Flow
            const result = await PaymentService.startPayPalFlow(total);

            if (result.status === 'approved') {
                // 2. Create Local Order on Success
                // In a real app, the backend might handle this during capture, 
                // but we'll keep the local context sync for now.
                const orderId = await addOrder(items, total, specialInstructions);
                clearCart();
                router.replace({ pathname: '/confirmation', params: { orderId } });
            } else if (result.status === 'cancelled') {
                Alert.alert("Pago cancelado", "Has cancelado el proceso de pago.");
            } else {
                Alert.alert("Error", "No se pudo completar el pago. Intenta de nuevo.");
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Ocurrió un error al iniciar el pago.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            <View style={styles.header}>
                <Text style={styles.title}>Resumen del Pedido</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Instrucciones Especiales</Text>
                <TextInput
                    style={styles.input}
                    value={specialInstructions}
                    onChangeText={setSpecialInstructions}
                    placeholder="Ej. Sin cebolla, Salsa extra..."
                    multiline
                />
            </View>

            <View style={styles.summary}>
                <Text style={styles.totalLabel}>Total a Pagar</Text>
                <Text style={styles.totalText}>${total.toFixed(2)} MXN</Text>
            </View>

            <TouchableOpacity
                style={[styles.payBtn, submitting && styles.disabled]}
                onPress={handlePayment}
                disabled={submitting}
            >
                <MaterialCommunityIcons name="credit-card-outline" size={24} color="#003087" style={{ marginRight: 10 }} />
                <Text style={styles.payText}>{submitting ? 'Procesando...' : 'Pagar con PayPal'}</Text>
            </TouchableOpacity>

            <View style={styles.secureBadge}>
                <MaterialCommunityIcons name="lock" size={16} color="#666" />
                <Text style={styles.secureText}>Pago seguro con PayPal</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { marginBottom: 20, alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    section: { marginBottom: 20, backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#555' },
    input: { borderColor: '#ddd', borderWidth: 1, padding: 15, borderRadius: 8, height: 100, textAlignVertical: 'top', backgroundColor: '#fafafa' },
    summary: { marginVertical: 20, alignItems: 'center' },
    totalLabel: { fontSize: 16, color: '#666' },
    totalText: { fontSize: 32, fontWeight: 'bold', color: '#333' },
    payBtn: {
        backgroundColor: '#FFC439', // PayPal Gold
        padding: 16,
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },
    payText: { color: '#003087', fontSize: 18, fontWeight: 'bold' }, // PayPal Blue
    disabled: { opacity: 0.7 },
    secureBadge: { flexDirection: 'row', justifyContent: 'center', marginTop: 15, alignItems: 'center' },
    secureText: { marginLeft: 5, color: '#666', fontSize: 12 }
});
