import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MenuService } from '../../services/MenuService';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MenuScreen() {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const { items } = useCart();
    const router = useRouter();

    const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        MenuService.getCategories().then(data => {
            setCategories(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.categoryCard}
                        onPress={() => router.push({ pathname: '/menu/[category]', params: { category: item } })}
                    >
                        <View style={styles.catIconPlaceholder}>
                            <Text style={styles.catInitials}>{item.charAt(0)}</Text>
                        </View>
                        <Text style={styles.categoryName}>{item}</Text>
                        <Ionicons name="chevron-forward" size={24} color="#ccc" />
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ padding: 20 }}
            />
            {itemsCount > 0 && (
                <TouchableOpacity style={styles.fab} onPress={() => router.push('/cart')}>
                    <Ionicons name="cart" size={24} color="#fff" />
                    <View style={styles.badge}><Text style={styles.badgeText}>{itemsCount}</Text></View>
                    <Text style={styles.fabText}>View Cart</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    categoryCard: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 5
    },
    catIconPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20
    },
    catInitials: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    categoryName: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#333'
    },
    fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#007AFF', borderRadius: 30, paddingVertical: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', elevation: 5 },
    fabText: { color: '#fff', marginLeft: 10, fontWeight: 'bold', fontSize: 16 },
    badge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
