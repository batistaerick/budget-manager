import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  LoadingScreen,
  Screen,
} from '@/components/ui';
import { money, useFinance } from '@/features/finance/use-finance';
import { api } from '@/lib/api';
import { useTheme } from '@/theme/theme';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SavingsScreen() {
  const colors = useTheme();
  const { savings, loading, error, refresh } = useFinance();
  if (loading) return <LoadingScreen label="Loading savings…" />;
  return (
    <Screen
      title="Savings"
      description="Money you have intentionally set aside."
    >
      <Button label="Add saving" onPress={() => router.push('/saving')} />
      {error ? (
        <ErrorMessage message={error} />
      ) : savings.length === 0 ? (
        <EmptyState
          title="No savings yet"
          description="Track cash, investments, and account balances here."
        />
      ) : (
        savings.map((saving) => (
          <Card key={saving.id}>
            <View style={styles.row}>
              <View style={styles.copy}>
                <Text style={[styles.name, { color: colors.foreground }]}>
                  {saving.name}
                </Text>
                <Text style={[styles.location, { color: colors.muted }]}>
                  {saving.location.replaceAll('_', ' ')}
                </Text>
              </View>
              <Text style={[styles.amount, { color: colors.income }]}>
                {money(saving.amount)}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => void api.deleteSaving(saving.id).then(refresh)}
            >
              <Text style={[styles.delete, { color: colors.expense }]}>
                Remove saving
              </Text>
            </Pressable>
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', flexDirection: 'row' },
  copy: { flex: 1 },
  name: { fontSize: 18, fontWeight: '800' },
  location: { fontSize: 12, marginTop: 4 },
  amount: { fontSize: 18, fontWeight: '800' },
  delete: { fontSize: 13, fontWeight: '700', marginTop: 18 },
});
