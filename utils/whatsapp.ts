import { Linking } from 'react-native';

export const sendOrderToWhatsApp = (orderId: string, items: any[], total: number, instructions?: string) => {
    const phoneNumber = '6672397909';

    const itemString = items.map(i => {
        let details = '';
        if (i.selectedOptions && i.selectedOptions.length > 0) {
            const opts = i.selectedOptions.map((o: any) => o.name).join(', ');
            details += ` (${opts})`;
        }
        return `- ${i.quantity}x ${i.name}${details}`;
    }).join('\n');

    const note = instructions ? `\n\nNote: ${instructions}` : '';

    const message = `Halo! Used MenuOrderApp.\n\nNew Order #${orderId}\nType: To Go\n\n${itemString}\n\nTotal: $${total.toFixed(2)}${note}\n\nPlease prepare for pickup!`;

    const url = `whatsapp://send?text=${encodeURIComponent(message)}&phone=${phoneNumber}`;

    Linking.openURL(url).catch(() => {
        Linking.openURL(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
    });
};
