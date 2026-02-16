import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useOrders } from '../../context/OrdersContext';

export default function OrdersScreen() {
    const { orders } = useOrders();

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.orderCard}>
                        <View style={styles.header}>
                            <Text style={styles.orderId}>Orden #{item.id}</Text>
                        </View>
                        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
                        <Text style={styles.info}>{item.items.length} pedidos</Text>
                        <Text style={styles.total}>Total: ${item.total.toFixed(2)}</Text>
                    </View>
                )}
                ListEmptyComponent={<View style={styles.center}><Text style={styles.empty}>No hay ordenes anteriores</Text></View>}
                contentContainerStyle={{ padding: 15 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
    empty: { fontSize: 16, color: '#888' },
    orderCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    orderId: { fontWeight: 'bold', fontSize: 16 },
    date: { color: '#666', fontSize: 12, marginBottom: 10 },
    info: { fontSize: 14, marginBottom: 5 },
    total: { fontSize: 16, fontWeight: 'bold', color: '#28a745', textAlign: 'right' },
});
