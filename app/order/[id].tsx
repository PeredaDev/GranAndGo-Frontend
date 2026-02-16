import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useOrders } from '../../context/OrdersContext';
import { OrderModel } from '../../services/OrderService';
import QRCodeDisplay from '../../components/QRCodeDisplay';

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { orders } = useOrders();
    const [order, setOrder] = useState<OrderModel | undefined>(undefined);

    useEffect(() => {
        if (id) {
            setOrder(orders.find(o => o.id === id));
        }
    }, [id, orders]);

    if (!order) {
        return (
            <View style={styles.container}>
                <Text>Orden no encontrada</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>QR para recoger</Text>
            <View style={styles.qrContainer}>
                <QRCodeDisplay value={JSON.stringify({ id: order.id, total: order.total })} />
            </View>
            <Text style={styles.helperText}>Muestra este QR al contador</Text>

            <View style={styles.details}>
                <Text style={styles.label}>ID de la Orden:</Text>
                <Text style={styles.value}>#{order.id}</Text>

                <Text style={styles.label}>Fecha:</Text>
                <Text style={styles.value}>{new Date(order.date).toLocaleString()}</Text>

                <Text style={styles.sectionHeader}>Items:</Text>
                {order.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
                            {item.toGoFee > 0 && <Text style={styles.optionText}>• Cargo por Servicio: ${item.toGoFee.toFixed(2)}</Text>}
                            {item.selectedOptions?.map((opt: any, idx: number) => (
                                <Text key={idx} style={styles.optionText}>• {opt.name}</Text>
                            ))}
                        </View>
                        <Text style={styles.itemPrice}>
                            ${((item.price + (item.selectedOptions?.reduce((a: any, b: any) => a + b.price, 0) || 0) + (item.toGoFee || 0)) * item.quantity).toFixed(2)}
                        </Text>
                    </View>
                ))}

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Pagado:</Text>
                    <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff', alignItems: 'center' },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    qrContainer: { marginBottom: 10 },
    helperText: { color: '#666', marginBottom: 30 },
    details: { width: '100%' },
    label: { fontSize: 14, color: '#666', marginTop: 10 },
    value: { fontSize: 16, fontWeight: 'bold' },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    itemName: { fontSize: 16 },
    optionText: { fontSize: 13, color: '#666', fontStyle: 'italic', marginLeft: 10 },
    itemPrice: { fontSize: 16, fontWeight: '500' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 },
    totalLabel: { fontSize: 18, fontWeight: 'bold' },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
});
