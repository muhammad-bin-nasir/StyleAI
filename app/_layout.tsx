import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext'; // Adjust path if needed
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="wardrobe" />
        <Stack.Screen name="context-input" />
        <Stack.Screen name="results" />
      </Stack>
    </AppProvider>
  );
}