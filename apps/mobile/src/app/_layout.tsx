import { AuthProvider } from '@/features/auth/auth-context';
import { useTheme } from '@/theme/theme';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function Navigator() {
  const colors = useTheme();
  return (
    <>
      <StatusBar style={useColorScheme() === 'light' ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.foreground,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth"
          options={{ title: 'Budget Manager', presentation: 'modal' }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="transaction"
          options={{ title: 'New transaction', presentation: 'modal' }}
        />
        <Stack.Screen
          name="saving"
          options={{ title: 'New saving', presentation: 'modal' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
