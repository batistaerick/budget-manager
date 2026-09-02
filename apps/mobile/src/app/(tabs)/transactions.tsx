import { TransactionRow } from '@/components/finance';
import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  LoadingScreen,
  Screen,
} from '@/components/ui';
import { useFinance } from '@/features/finance/use-finance';
import { useTheme } from '@/theme/theme';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function TransactionsScreen() {
  const colors = useTheme();
  const { incomes, expenses, loading, error, refresh } = useFinance();
  if (loading) return <LoadingScreen label="Loading activity…" />;
  const rows = [
    ...incomes.map((item) => ({ item, kind: 'income' as const })),
    ...expenses.map((item) => ({ item, kind: 'expense' as const })),
  ].sort((a, b) => b.item.date.localeCompare(a.item.date));
  return (
    <Screen
      title="Transactions"
      description="Income and expenses recorded this month."
    >
      <View style={styles.actions}>
        <View style={styles.action}>
          <Button
            label="Income"
            onPress={() =>
              router.push({
                pathname: '/transaction',
                params: { type: 'INCOME' },
              })
            }
          />
        </View>
        <View style={styles.action}>
          <Button
            label="Expense"
            onPress={() =>
              router.push({
                pathname: '/transaction',
                params: { type: 'EXPENSE' },
              })
            }
            variant="secondary"
          />
        </View>
      </View>
      {error ? (
        <>
          <ErrorMessage message={error} />
          <Button
            label="Try again"
            onPress={() => void refresh()}
            variant="secondary"
          />
        </>
      ) : rows.length === 0 ? (
        <EmptyState
          title="Nothing recorded yet"
          description="New transactions will appear here."
        />
      ) : (
        <Card>
          <Text style={[styles.count, { color: colors.muted }]}>
            {rows.length} transactions
          </Text>
          {rows.map(({ item, kind }) => (
            <TransactionRow key={item.id} kind={kind} transaction={item} />
          ))}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 12 },
  action: { flex: 1 },
  count: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
});
