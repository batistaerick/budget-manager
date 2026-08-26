import { Button, ErrorMessage, Field, Screen } from '@/components/ui';
import { api } from '@/lib/api';
import { SavingLocation } from '@budget-manager/api-client';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SavingScreen() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState(SavingLocation.SAVINGS_ACCOUNT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  async function submit() {
    setBusy(true);
    setError(undefined);
    try {
      await api.createSaving({
        name: name.trim(),
        amount: Number(amount.replace(',', '.')),
        location,
      });
      router.back();
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : 'Unable to save this amount.'
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen
      title="Add saving"
      description="Track money held outside your monthly balance."
    >
      <Field
        label="Name"
        onChangeText={setName}
        placeholder="Emergency fund"
        value={name}
      />
      <Field
        keyboardType="decimal-pad"
        label="Amount"
        onChangeText={setAmount}
        placeholder="0,00"
        value={amount}
      />
      <View style={styles.locations}>
        {Object.values(SavingLocation).map((item) => (
          <Pressable
            accessibilityRole="button"
            key={item}
            onPress={() => setLocation(item)}
            style={[styles.location, { opacity: location === item ? 1 : 0.5 }]}
          >
            <Text>{item.replaceAll('_', ' ')}</Text>
          </Pressable>
        ))}
      </View>
      {error ? <ErrorMessage message={error} /> : null}
      <Button
        busy={busy}
        disabled={!name.trim() || Number(amount.replace(',', '.')) < 0}
        label="Save"
        onPress={() => void submit()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  locations: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  location: {
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
});
