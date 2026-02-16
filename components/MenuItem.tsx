import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuItemData, MenuOption } from '../services/MenuService';

type MenuItemProps = MenuItemData & {
    onAdd: (selectedOptions: MenuOption[]) => void;
};

export default function MenuItem(props: MenuItemProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<MenuOption[]>([]);

    const handleAddPress = () => {
        // If no options, just add
        if (!props.options || props.options.length === 0) {
            props.onAdd([]);
        } else {
            // Open modal
            setModalVisible(true);
            setSelectedOptions([]);
        }
    };

    const confirmAdd = () => {
        props.onAdd(selectedOptions);
        setModalVisible(false);
    };

    const toggleOption = (option: MenuOption) => {
        const exists = selectedOptions.find(o => o.id === option.id);
        if (exists) {
            setSelectedOptions(prev => prev.filter(o => o.id !== option.id));
        } else {
            setSelectedOptions(prev => [...prev, option]);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.info}>
                    <Text style={styles.name}>{props.name}</Text>
                    <Text style={styles.description}>{props.description}</Text>
                    <Text style={styles.price}>${props.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity onPress={handleAddPress} style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Personalizar {props.name}</Text>
                        <ScrollView>

                            {props.options?.map((grp, idx) => (
                                <View key={idx} style={styles.group}>
                                    <Text style={styles.groupTitle}>{grp.title}</Text>
                                    {grp.choices.map(opt => {
                                        const selected = selectedOptions.some(o => o.id === opt.id);
                                        return (
                                            <TouchableOpacity
                                                key={opt.id}
                                                style={[styles.choiceBtn, selected && styles.choiceBtnSelected]}
                                                onPress={() => toggleOption(opt)}
                                            >
                                                <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>
                                                    {opt.name} (+${opt.price.toFixed(2)})
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            ))}
                        </ScrollView>

                        <TouchableOpacity style={styles.confirmBtn} onPress={confirmAdd}>
                            <Text style={styles.confirmText}>Agregar al Carrito</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: 'bold' },
    description: { color: '#666' },
    price: { color: '#007AFF', fontWeight: 'bold' },
    addButton: { backgroundColor: '#007AFF', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    optionLabel: { fontSize: 16 },
    group: { marginBottom: 20 },
    groupTitle: { fontWeight: 'bold', marginBottom: 10 },
    choiceBtn: { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 5 },
    choiceBtnSelected: { backgroundColor: '#e3f2fd', borderColor: '#007AFF' },
    choiceText: { color: '#333' },
    choiceTextSelected: { color: '#007AFF', fontWeight: 'bold' },
    confirmBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    confirmText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    cancelBtn: { padding: 15, alignItems: 'center' },
    cancelText: { color: 'red' }
});
