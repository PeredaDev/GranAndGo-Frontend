import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Menu',
                    tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: 'Mis Ordenes',
                    tabBarIcon: ({ color, size }) => <Ionicons name="receipt" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
