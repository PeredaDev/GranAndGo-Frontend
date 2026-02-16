import { MenuItemData } from '../services/MenuService';

export const MENU_DATA: { category: string; data: MenuItemData[] }[] = [
    {
        category: 'Hamburguesas',
        data: [
            {
                id: '1',
                name: 'Hamburguesa Clásica',
                price: 12.99,
                description: 'Carne de res, lechuga, tomate, queso',
                category: 'Hamburguesas',
                toGoFee: 1.00,
                options: [
                    {
                        title: "Proteína Extra",
                        choices: [
                            { id: 'p1', name: 'Carne Extra', price: 3.00 },
                            { id: 'p2', name: 'Agregar Pollo', price: 2.50 }
                        ]
                    }
                ]
            },
            { id: '2', name: 'Tocino BBQ', price: 14.99, description: 'Carne de res, tocino, salsa bbq, aros de cebolla', category: 'Hamburguesas', toGoFee: 1.50 },
        ]
    },
    {
        category: 'Bebidas',
        data: [
            {
                id: '3',
                name: 'Refresco de Cola',
                price: 2.99,
                description: 'Refresco frío',
                category: 'Bebidas',
                toGoFee: 0.50,
                options: [
                    {
                        title: "Opciones",
                        choices: [
                            { id: 'sugar_free', name: 'Sin Azúcar', price: 0 }
                        ]
                    }
                ]
            },
            {
                id: '4',
                name: 'Latte',
                price: 4.49,
                description: 'Espresso con leche vaporizada',
                category: 'Bebidas',
                toGoFee: 0.50,
                options: [
                    {
                        title: "Opciones",
                        choices: [
                            { id: 'sugar_free', name: 'Sin Azúcar', price: 0 }
                        ]
                    },
                    {
                        title: "Tipo de Leche",
                        choices: [
                            { id: 'm1', name: 'Leche de Almendras', price: 1.00 },
                            { id: 'm2', name: 'Leche de Avena', price: 1.00 },
                            { id: 'm3', name: 'Leche de Soya', price: 0.50 }
                        ]
                    }
                ]
            },
        ]
    },
    {
        category: 'Acompañamientos',
        data: [
            { id: '5', name: 'Papas Fritas', price: 4.99, description: 'Papas fritas crujientes con sal', category: 'Acompañamientos', toGoFee: 0.50 },
        ]
    }
];
