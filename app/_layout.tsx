import { Stack } from 'expo-router/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../lib/auth-context';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="agency/[id]"
            options={{
              headerShown: true,
              headerBackButtonDisplayMode: 'minimal',
              headerTitle: '',
            }}
          />
          <Stack.Screen
            name="auth"
            options={{ presentation: 'modal', headerShown: false }}
          />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
