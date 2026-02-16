try {
    console.log('Resolving react-native-web/dist/exports/NativeEventEmitter...');
    const path = require.resolve('react-native-web/dist/exports/NativeEventEmitter');
    console.log('Success:', path);
} catch (e) {
    console.error('Failed:', e.message);
}
