import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MenuService, MenuItemData } from '../../services/MenuService';
import { useCart } from '../../context/CartContext';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CategoryScreen() {
    const { category } = useLocalSearchParams<{ category: string }>();
    const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const { items, addToCart } = useCart();
    const router = useRouter();

    const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        if (category) {
            MenuService.getItemsByCategory(category).then(data => {
                setMenuItems(data);
                setLoading(false);
            });
        }
    }, [category]);

    const navigateToDetails = (itemId: string) => {
        router.push({ pathname: '/menu/item/[id]', params: { id: itemId } });
    };

    const handleAddPress = (item: MenuItemData) => {
        if (!item.options || item.options.length === 0) {
            addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                category: item.category,
                toGoFee: item.toGoFee || 0,
                selectedOptions: [],
            });
            Alert.alert("Added", `${item.name} added to cart`);
        } else {
            navigateToDetails(item.id);
        }
    };

    if (loading) return (
        <View style={styles.center}>
            <Stack.Screen options={{ title: '' }} />
            <ActivityIndicator size="large" />
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: category }} />
            <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <TouchableOpacity style={styles.itemInfo} onPress={() => navigateToDetails(item.id)}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemDesc}>{item.description}</Text>
                            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addBtn} onPress={() => handleAddPress(item)}>
                            <Ionicons name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={<Text style={styles.empty}>No items found.</Text>}
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
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    itemContainer: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 18, fontWeight: 'bold' },
    itemDesc: { color: '#666', marginTop: 4 },
    itemPrice: { fontSize: 16, color: '#28a745', marginTop: 4, fontWeight: 'bold' },
    addBtn: { backgroundColor: '#007AFF', padding: 10, borderRadius: 20 },
    fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#007AFF', borderRadius: 30, paddingVertical: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', elevation: 5 },
    fabText: { color: '#fff', marginLeft: 10, fontWeight: 'bold', fontSize: 16 },
    badge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' }
});
