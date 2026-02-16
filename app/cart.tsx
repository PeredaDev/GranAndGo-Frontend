import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CartScreen() {
    const { items, removeFromCart, total, clearCart } = useCart();
    const router = useRouter();

    const handleClearCart = () => {
        Alert.alert(
            "Vaciar carrito",
            "¿Estás seguro de que quieres eliminar todos los productos?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Vaciar", style: "destructive", onPress: clearCart }
            ]
        );
    };

    if (items.length === 0) {
        return (
            <View style={styles.center}>
                <Ionicons name="cart-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Tu carrito está vacío</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                keyExtractor={(item, index) => item.id + index}
                renderItem={({ item, index }) => (
                    <View style={styles.itemRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemDetails}>Cantidad: {item.quantity}</Text>
                            {item.toGoFee > 0 && <Text style={styles.options}>Service Fee: ${item.toGoFee.toFixed(2)}</Text>}
                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                                <Text style={styles.options}>
                                    {item.selectedOptions.map(o => o.name).join(', ')}
                                </Text>
                            )}
                        </View>
                        <Text style={styles.itemPrice}>
                            ${((item.price + (item.selectedOptions?.reduce((a, b) => a + b.price, 0) || 0) + (item.toGoFee || 0)) * item.quantity).toFixed(2)}
                        </Text>
                        <TouchableOpacity onPress={() => removeFromCart(index)} style={styles.deleteBtn}>
                            <Ionicons name="trash-outline" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />
            <View style={styles.footer}>
                <TouchableOpacity style={styles.clearBtn} onPress={handleClearCart}>
                    <Text style={styles.clearText}>Vaciar carrito</Text>
                </TouchableOpacity>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/payment')}>
                    <Text style={styles.checkoutText}>Proceder al pago</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 18, color: '#666', marginTop: 10 },
    itemRow: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
    itemName: { fontSize: 16, fontWeight: 'bold' },
    itemDetails: { color: '#666' },
    options: { fontSize: 12, color: '#888' },
    itemPrice: { fontSize: 16, marginHorizontal: 10 },
    deleteBtn: { padding: 5 },
    footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#f9f9f9' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    totalLabel: { fontSize: 18, fontWeight: 'bold' },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: '#28a745' },
    checkoutBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
    checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    clearBtn: { padding: 10, alignItems: 'center', marginBottom: 10 },
    clearText: { color: 'red', fontSize: 16 },
});
