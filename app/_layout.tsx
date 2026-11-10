import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { VodunPalette } from '@/constants/Colors';
import { AppProvider } from '@/context/AppContext';
import { VodunAlertProvider } from '@/components/VodunAlert';
import '@/lib/vodunNotifications';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  anchor: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppProvider>
      <VodunAlertProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#FAF7F2',
          },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="fadu"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="consultation"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="assistant"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="temple"
        />
        <Stack.Screen
          name="enseignements"
        />
        <Stack.Screen
          name="auth"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
          }}
        />
      </Stack>
      </VodunAlertProvider>
    </AppProvider>
  );
}
