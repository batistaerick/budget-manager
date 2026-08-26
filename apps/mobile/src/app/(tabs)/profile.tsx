import {
  Button,
  Card,
  ErrorMessage,
  Field,
  LoadingScreen,
  Screen,
} from '@/components/ui';
import { useAuth } from '@/features/auth/auth-context';
import { api } from '@/lib/api';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
  const { user, loading, refresh, signOut } = useAuth();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  useEffect(() => setName(user?.name ?? ''), [user]);
  if (loading || !user) return <LoadingScreen label="Loading profile…" />;
  const currentUser = user;
  async function save() {
    setBusy(true);
    setError(undefined);
    try {
      await api.updateUser({
        id: currentUser.id,
        email: currentUser.email,
        name: name.trim(),
      });
      await refresh();
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : 'Unable to update profile.'
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen title="Profile" description="Your account and mobile session.">
      <Card>
        <Field label="Name" onChangeText={setName} value={name} />
        <Field editable={false} label="Email" value={user.email} />
        {error ? <ErrorMessage message={error} /> : null}
        <Button busy={busy} label="Save profile" onPress={() => void save()} />
      </Card>
      <Button
        label="Sign out"
        onPress={() => void signOut().then(() => router.replace('/auth'))}
        variant="danger"
      />
    </Screen>
  );
}
