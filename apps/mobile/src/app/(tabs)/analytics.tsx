import { Metric } from '@/components/finance';
import { Card, ErrorMessage, LoadingScreen, Screen } from '@/components/ui';
import { money, useFinance } from '@/features/finance/use-finance';
import { useTheme } from '@/theme/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function AnalyticsScreen() {
  const colors = useTheme();
  const { incomes, expenses, loading, error } = useFinance();
  if (loading) return <LoadingScreen label="Building insights…" />;
  const income = incomes.reduce((sum, item) => sum + item.totalValue, 0);
  const expense = expenses.reduce((sum, item) => sum + item.totalValue, 0);
  const total = income + expense;
  const expenseShare = total === 0 ? 0 : Math.round((expense / total) * 100);
  const categories = new Map<string, number>();
  for (const transaction of expenses)
    categories.set(
      transaction.category.name,
      (categories.get(transaction.category.name) ?? 0) + transaction.totalValue
    );
  const ranked = [...categories.entries()].sort((a, b) => b[1] - a[1]);
  return (
    <Screen title="Insights" description="Patterns from your current month.">
      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Metric label="Income" value={money(income)} tone="income" />
            </View>
            <View style={styles.metric}>
              <Metric label="Expenses" value={money(expense)} tone="expense" />
            </View>
          </View>
          <Card>
            <Text style={[styles.heading, { color: colors.foreground }]}>
              Expense share
            </Text>
            <View
              style={[styles.track, { backgroundColor: colors.surfaceStrong }]}
            >
              <View
                style={[
                  styles.fill,
                  {
                    backgroundColor: colors.expense,
                    width: `${expenseShare}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.caption, { color: colors.muted }]}>
              {expenseShare}% of this month’s recorded movement is expense.
            </Text>
          </Card>
          <Card>
            <Text style={[styles.heading, { color: colors.foreground }]}>
              Top expense categories
            </Text>
            {ranked.length === 0 ? (
              <Text style={[styles.caption, { color: colors.muted }]}>
                No expense data yet.
              </Text>
            ) : (
              ranked.map(([name, value]) => (
                <View key={name} style={styles.row}>
                  <Text style={[styles.category, { color: colors.foreground }]}>
                    {name}
                  </Text>
                  <Text
                    style={[styles.categoryValue, { color: colors.expense }]}
                  >
                    {money(value)}
                  </Text>
                </View>
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
  heading: { fontSize: 18, fontWeight: '800' },
  track: { borderRadius: 8, height: 12, marginTop: 18, overflow: 'hidden' },
  fill: { borderRadius: 8, height: 12 },
  caption: { fontSize: 13, lineHeight: 19, marginTop: 12 },
  row: { flexDirection: 'row', paddingTop: 16 },
  category: { flex: 1, fontWeight: '700' },
  categoryValue: { fontWeight: '800' },
});
