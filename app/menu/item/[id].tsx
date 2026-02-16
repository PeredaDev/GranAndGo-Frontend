import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MenuService, MenuItemData, MenuOption } from '../../../services/MenuService';
import { useCart } from '../../../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

export default function ItemDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [item, setItem] = useState<MenuItemData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState<MenuOption[]>([]);

    const { addToCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        if (id) {
            MenuService.getItemById(id).then(data => {
                setItem(data || null);
                setLoading(false);
            });
        }
    }, [id]);

    const toggleOption = (option: MenuOption) => {
        // Simple logic: if exists, remove it. If not, add it.
        // NOTE: This assumes multi-select for now. If single select is needed per group, logic should change.
        // Based on "Proteína Extra" or "Tipo de Leche", single select might be more appropriate for "Tipo de Leche" but multi for "Proteína".
        // Let's assume single select per group for simplicity of UI if titles suggest it, but the data structure is generic.
        // Let's implement robust handling: check if we need to replace an existing option from the same group?
        // The current data structure `options` -> `choices[]`.
        // Let's look at the groups.

        // Actually, let's keep it simple: generic array of selected options.
        // But we should probably prevent selecting two milks if it's "Type of Milk".
        // For now, let's just toggle. User described "extras" implying additive.

        setSelectedOptions(prev => {
            const exists = prev.find(o => o.id === option.id);
            if (exists) {
                return prev.filter(o => o.id !== option.id);
            }
            return [...prev, option];
        });
    };

    const handleAddToCart = () => {
        if (!item) return;

        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            category: item.category,
            toGoFee: item.toGoFee || 0,
            selectedOptions: selectedOptions,
        });
        router.back();
    };

    if (loading) return (
        <View style={styles.center}>
            <Stack.Screen options={{ title: '' }} />
            <ActivityIndicator size="large" />
        </View>
    );
    if (!item) return <View style={styles.center}><Text>Item not found</Text></View>;

    const currentPrice = item.price + selectedOptions.reduce((acc, opt) => acc + opt.price, 0);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            <Stack.Screen options={{ title: item.name }} />

            <View style={styles.header}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>



            {item.options?.map((group, idx) => (
                <View key={idx} style={styles.group}>
                    <Text style={styles.groupTitle}>{group.title}</Text>
                    {group.choices.map(choice => {
                        const isSelected = selectedOptions.some(o => o.id === choice.id);
                        return (
                            <TouchableOpacity
                                key={choice.id}
                                style={[styles.choiceItem, isSelected && styles.choiceSelected]}
                                onPress={() => toggleOption(choice)}
                            >
                                <Text style={[styles.choiceName, isSelected && styles.choiceTextSelected]}>
                                    {choice.name} (+${choice.price.toFixed(2)})
                                </Text>
                                {isSelected && <Ionicons name="checkmark" size={20} color="#fff" />}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ))}

            <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
                <Text style={styles.addBtnText}>Agregar al carrito ${currentPrice.toFixed(2)}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    title: { fontSize: 24, fontWeight: 'bold', flex: 1 },
    price: { fontSize: 20, color: '#28a745', fontWeight: 'bold' },
    description: { fontSize: 16, color: '#666', marginBottom: 20 },
    optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 },
    optionLabel: { fontSize: 18, fontWeight: '500' },
    group: { marginBottom: 20 },
    groupTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    choiceItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderRadius: 10, backgroundColor: '#f0f0f0', marginBottom: 8, borderWidth: 1, borderColor: 'transparent' },
    choiceSelected: { backgroundColor: '#007AFF', borderColor: '#005bb5' },
    choiceName: { fontSize: 16 },
    choiceTextSelected: { color: '#fff', fontWeight: 'bold' },
    addBtn: { backgroundColor: '#28a745', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 40 },
    addBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
