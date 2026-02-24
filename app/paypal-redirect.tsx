import React from 'react';
import { View } from 'react-native';

// This is a dummy screen. We need a valid physical route so Expo Router doesn't 
// throw an "Unmatched Route" error when PayPal deep-links back into the app. 
// WebBrowser.openAuthSessionAsync will intercept it immediately and close the browser.
export default function PayPalRedirectScreen() {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
}
