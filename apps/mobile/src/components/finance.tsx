import { Card } from '@/components/ui';
import { money } from '@/features/finance/use-finance';
import { useTheme } from '@/theme/theme';
import type { Transaction } from '@budget-manager/api-client';
import { StyleSheet, Text, View } from 'react-native';

export function Metric({
  label,
  value,
  tone = 'neutral',
}: {
  readonly label: string;
  readonly value: string;
  readonly tone?: 'income' | 'expense' | 'neutral';
}) {
  const colors = useTheme();
  const color =
    tone === 'income'
      ? colors.income
      : tone === 'expense'
        ? colors.expense
        : colors.foreground;
  return (
    <Card>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </Card>
  );
}

export function TransactionRow({
  transaction,
  kind,
}: {
  readonly transaction: Transaction;
  readonly kind: 'income' | 'expense';
}) {
  const colors = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.rowCopy}>
        <Text style={[styles.name, { color: colors.foreground }]}>
          {transaction.category.name}
        </Text>
        <Text style={[styles.meta, { color: colors.muted }]}>
          {transaction.notes || transaction.date}
        </Text>
      </View>
      <Text
        style={[
          styles.amount,
          { color: kind === 'income' ? colors.income : colors.expense },
        ]}
      >
        {kind === 'income' ? '+' : '−'} {money(transaction.totalValue)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  value: { fontSize: 25, fontWeight: '800', marginTop: 8 },
  row: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 68,
    paddingVertical: 10,
  },
  rowCopy: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700' },
  meta: { fontSize: 13, marginTop: 4 },
  amount: { fontSize: 15, fontWeight: '800', marginLeft: 12 },
});
