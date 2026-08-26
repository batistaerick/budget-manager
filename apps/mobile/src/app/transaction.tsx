import { Button, ErrorMessage, Field, Screen } from '@/components/ui';
import { api } from '@/lib/api';
import {
  RepeatInterval,
  TransactionType,
  type Category,
} from '@budget-manager/api-client';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function today(): string {
  const date = new Date();
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
}

export default function TransactionScreen() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const transactionType =
    type === TransactionType.INCOME
      ? TransactionType.INCOME
      : TransactionType.EXPENSE;
  const [categories, setCategories] = useState<readonly Category[]>([]);
  const [category, setCategory] = useState<Category>();
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  useEffect(() => {
    void api
      .categories(transactionType)
      .then((items) => {
        setCategories(items);
        setCategory(items[0]);
      })
      .catch((error: unknown) =>
        setError(
          error instanceof Error ? error.message : 'Unable to load categories.'
        )
      );
  }, [transactionType]);
  async function submit() {
    if (!category) return;
    setBusy(true);
    setError(undefined);
    try {
      await api.createTransaction({
        category,
        notes: notes.trim() || null,
        totalValue: Number(value.replace(',', '.')),
        installmentNumbers: null,
        repeats: RepeatInterval.NONE,
        date: today(),
      });
      router.back();
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : 'Unable to save transaction.'
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen
      title={
        transactionType === TransactionType.INCOME
          ? 'Add income'
          : 'Add expense'
      }
      description="Record today’s movement."
    >
      <Field
        keyboardType="decimal-pad"
        label="Amount"
        onChangeText={setValue}
        placeholder="0,00"
        value={value}
      />
      <Field label="Notes" onChangeText={setNotes} value={notes} />
      <View style={styles.categories}>
        {categories.map((item) => (
          <Pressable
            accessibilityRole="button"
            key={item.id}
            onPress={() => setCategory(item)}
            style={[
              styles.category,
              { opacity: category?.id === item.id ? 1 : 0.5 },
            ]}
          >
            <Text>{item.name}</Text>
          </Pressable>
        ))}
      </View>
      {error ? <ErrorMessage message={error} /> : null}
      <Button
        busy={busy}
        disabled={!category || Number(value.replace(',', '.')) <= 0}
        label="Save transaction"
        onPress={() => void submit()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  category: {
    backgroundColor: '#d1fae5',
    borderRadius: 999,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
});
