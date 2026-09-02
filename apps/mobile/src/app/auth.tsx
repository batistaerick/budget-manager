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
      style={[styles.safeArea, { backgroundColor: '#032258' }]}
    >
      <View style={[styles.gradientBand, { backgroundColor: '#2a1c33' }]} />
      <View style={[styles.gradientGlow, { backgroundColor: '#18313f' }]} />
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
              {
                backgroundColor: `${colors.mantle}ee`,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.welcome, { color: colors.foreground }]}>
              Welcome
            </Text>
            <Text
              accessibilityRole="header"
              style={[styles.title, { color: colors.foreground }]}
            >
              {creating ? 'Sign Up' : 'Sign In'}
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
  gradientBand: {
    bottom: -120,
    height: 280,
    left: -80,
    position: 'absolute',
    transform: [{ rotate: '-18deg' }],
    width: '150%',
  },
  gradientGlow: {
    borderRadius: 220,
    height: 360,
    position: 'absolute',
    right: -160,
    top: -90,
    width: 360,
  },
  content: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: { borderRadius: 24, borderWidth: 1, padding: 30 },
  welcome: {
    fontSize: 38,
    fontWeight: '800',
    marginBottom: 26,
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  form: { gap: 16, marginTop: 26 },
});
