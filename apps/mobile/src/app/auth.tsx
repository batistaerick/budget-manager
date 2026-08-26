import { Button, ErrorMessage, Field } from '@/components/ui';
import { useAuth } from '@/features/auth/auth-context';
import { useTheme } from '@/theme/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const colors = useTheme();
  const { login, register } = useAuth();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  async function submit() {
    setBusy(true);
    setError(undefined);
    try {
      if (creating) {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      router.replace('/(tabs)');
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : 'Unable to authenticate.'
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.safeArea}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.mark, { color: colors.accent }]}>BM</Text>
            <Text
              accessibilityRole="header"
              style={[styles.title, { color: colors.foreground }]}
            >
              {creating ? 'Create your account' : 'Welcome back'}
            </Text>
            <Text style={[styles.copy, { color: colors.muted }]}>
              A calm place for every transaction, saving goal, and monthly
              decision.
            </Text>
            <View style={styles.form}>
              {creating ? (
                <Field label="Name" onChangeText={setName} value={name} />
              ) : null}
              <Field
                autoCapitalize="none"
                keyboardType="email-address"
                label="Email"
                onChangeText={setEmail}
                value={email}
              />
              <Field
                label="Password"
                onChangeText={setPassword}
                secureTextEntry
                value={password}
              />
              {error ? <ErrorMessage message={error} /> : null}
              <Button
                busy={busy}
                disabled={
                  !email.includes('@') ||
                  password.length < 8 ||
                  (creating && !name.trim())
                }
                label={creating ? 'Create account' : 'Sign in'}
                onPress={() => void submit()}
              />
              <Button
                label={
                  creating ? 'I already have an account' : 'Create an account'
                }
                onPress={() => setCreating(!creating)}
                variant="quiet"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: { borderRadius: 28, borderWidth: 1, padding: 24 },
  mark: { fontSize: 22, fontWeight: '900', letterSpacing: -1 },
  title: {
    fontSize: 31,
    fontWeight: '800',
    letterSpacing: -1.2,
    marginTop: 24,
  },
  copy: { fontSize: 15, lineHeight: 22, marginTop: 8 },
  form: { gap: 16, marginTop: 26 },
});
