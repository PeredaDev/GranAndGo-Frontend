import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrders } from '../context/OrdersContext';
import { Ionicons } from '@expo/vector-icons';

export default function ConfirmationScreen() {
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const router = useRouter();
    const { orders } = useOrders();

    const order = orders.find(o => o.id === orderId);

    // Prevent going back to payment
    useEffect(() => {
        const backAction = () => {
            router.replace('/(tabs)');
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    if (!order) {
        return (
            <View style={styles.container}>
                <Text style={styles.subtitle}>Cargando tu orden...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Ionicons name="checkmark-circle" size={100} color="#28a745" />
            <Text style={styles.title}>Order Confirmada!</Text>
            <Text style={styles.subtitle}>Codigo para recoger: {order.id}</Text>

            <View style={styles.card}>
                <Text style={styles.info}>Total Pagado: ${order.total.toFixed(2)}</Text>
                <Text style={styles.info}>Items: {order.items.length}</Text>
                {order.instructions ? <Text style={styles.note}>Nota: {order.instructions}</Text> : null}
            </View>

            <TouchableOpacity
                style={styles.homeBtn}
                onPress={() => router.replace('/(tabs)')}
            >
                <Text style={styles.homeText}>Regresar al Inicio</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginTop: 20 },
    subtitle: { fontSize: 18, color: '#666', marginTop: 10, marginBottom: 30 },
    card: { padding: 20, backgroundColor: '#f9f9f9', width: '100%', borderRadius: 10, marginBottom: 30, alignItems: 'center' },
    info: { fontSize: 16, marginBottom: 5 },
    whatsappBtn: { flexDirection: 'row', backgroundColor: '#25D366', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
    btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    homeBtn: { padding: 15 },
    homeText: { color: '#007AFF', fontSize: 16 },
    note: { marginTop: 10, fontStyle: 'italic', color: '#555', textAlign: 'center' },
});
