import { Metric, TransactionRow } from '@/components/finance';
import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  LoadingScreen,
  Screen,
} from '@/components/ui';
import { money, useFinance } from '@/features/finance/use-finance';
import { useTheme } from '@/theme/theme';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function OverviewScreen() {
  const colors = useTheme();
  const { incomes, expenses, savings, loading, error, refresh } = useFinance();
  if (loading) return <LoadingScreen label="Calculating this month…" />;
  const income = incomes.reduce((sum, item) => sum + item.totalValue, 0);
  const expense = expenses.reduce((sum, item) => sum + item.totalValue, 0);
  const recent = [
    ...incomes.map((item) => ({ item, kind: 'income' as const })),
    ...expenses.map((item) => ({ item, kind: 'expense' as const })),
  ]
    .sort((a, b) => b.item.date.localeCompare(a.item.date))
    .slice(0, 5);
  return (
    <Screen
      title="Your month"
      description="A clear view of what came in, what went out, and what you kept."
    >
      {error ? (
        <>
          <ErrorMessage message={error} />
          <Button
            label="Try again"
            onPress={() => void refresh()}
            variant="secondary"
          />
        </>
      ) : (
        <>
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Metric label="Balance" value={money(income - expense)} />
            </View>
            <View style={styles.metric}>
              <Metric
                label="Saved"
                value={money(
                  savings.reduce((sum, item) => sum + item.amount, 0)
                )}
                tone="income"
              />
            </View>
          </View>
          <View style={styles.actions}>
            <View style={styles.action}>
              <Button
                label="Add income"
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
                label="Add expense"
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
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Recent activity
            </Text>
            {recent.length === 0 ? (
              <EmptyState
                title="No activity this month"
                description="Add your first income or expense to see the month take shape."
              />
            ) : (
              recent.map(({ item, kind }) => (
                <TransactionRow key={item.id} kind={kind} transaction={item} />
              ))
            )}
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  metrics: { flexDirection: 'row', gap: 12 },
  metric: { flex: 1 },
  actions: { flexDirection: 'row', gap: 12 },
  action: { flex: 1 },
  sectionTitle: { fontSize: 19, fontWeight: '800', marginBottom: 8 },
});
