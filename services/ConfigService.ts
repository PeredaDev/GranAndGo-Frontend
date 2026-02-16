import { delay } from './api';

export type AppConfig = {
    restaurantName: string;
    whatsappNumber: string;
    toGoFee: number;
    isOpen: boolean;
};

const MOCK_CONFIG: AppConfig = {
    restaurantName: "Burger Joint",
    whatsappNumber: "6672397909",
    toGoFee: 5.00,
    isOpen: true,
};

export const ConfigService = {
    getConfig: async (): Promise<AppConfig> => {
        await delay(500);
        return MOCK_CONFIG;
    }
};
