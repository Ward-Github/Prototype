import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, SafeAreaView,  } from 'react-native';
import { AdminModeProvider } from '@/context/AdminModeContext';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from 'react-query';
import AuthProvider from "@/context/AuthProvider";
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/context/ThemeProvider';
import { StyleSheet } from 'react-native';

const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Azonix: require('../assets/fonts/Azonix.otf'),
    Poppins_Regular: require('../assets/fonts/Poppins-Regular.ttf'),
    Poppins_Bold: require('../assets/fonts/Poppins-Bold.ttf'),

  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AdminModeProvider>
      <ThemeProvider>
          <SafeAreaView style={{ height: '100%', width: '100%', maxHeight: '100%', maxWidth: '100%', flex: 1, flexBasis: '100%', flexGrow: 0, flexWrap: 'nowrap' }}>
            <Stack>
              {Platform.OS === 'web' ? (
                <Stack.Screen name="(auth)/(tabs web)" options={{ headerShown: false }} />
              ) : (
                <Stack.Screen name="(auth)/(tabs)" options={{ headerShown: false }} />
              )}
              <Stack.Screen
                name="(public)/login"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(public)/callback" options={{ headerShown: false }} />
            </Stack>
          </SafeAreaView>
          <Toast />
      </ThemeProvider>
        </AdminModeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

