import { LoadingScreen } from '@/components/ui';
import { useAuth } from '@/features/auth/auth-context';
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  const { loading, user } = useAuth();
  if (loading) {
    return <LoadingScreen label="Opening your budget…" />;
  }
  return <Redirect href={user ? '/(tabs)' : '/auth'} />;
}
