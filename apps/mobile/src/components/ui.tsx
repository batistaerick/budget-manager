import { useTheme } from '@/theme/theme';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ButtonProps extends PressableProps {
  readonly label: string;
  readonly variant?: 'primary' | 'secondary' | 'danger' | 'quiet';
  readonly busy?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  busy = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const colors = useTheme();
  const backgroundColor =
    variant === 'primary'
      ? colors.accent
      : variant === 'danger'
        ? colors.expense
        : variant === 'secondary'
          ? colors.surface
          : 'transparent';
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || busy}
      style={(state) => [
        styles.button,
        {
          backgroundColor,
          borderColor:
            variant === 'secondary' ? colors.border : backgroundColor,
          opacity: disabled || busy ? 0.5 : state.pressed ? 0.75 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      {busy ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text
          style={[
            styles.buttonLabel,
            {
              color:
                variant === 'primary' || variant === 'danger'
                  ? colors.white
                  : colors.foreground,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

interface FieldProps extends TextInputProps {
  readonly label: string;
  readonly hint?: string;
}

export function Field({ label, hint, style, ...props }: FieldProps) {
  const colors = useTheme();
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        selectionColor={colors.accent}
        style={[
          styles.field,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.foreground,
          },
          style,
        ]}
        {...props}
      />
      {hint ? (
        <Text style={[styles.hint, { color: colors.muted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

export function Screen({
  title,
  description,
  children,
  scroll = true,
}: {
  readonly title: string;
  readonly description?: string;
  readonly children: React.ReactNode;
  readonly scroll?: boolean;
}) {
  const colors = useTheme();
  const content = (
    <View style={styles.screenContent}>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.foreground }]}
      >
        {title}
      </Text>
      {description ? (
        <Text style={[styles.description, { color: colors.muted }]}>
          {description}
        </Text>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export function Card({ children }: { readonly children: React.ReactNode }) {
  const colors = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {children}
    </View>
  );
}

export function EmptyState({
  title,
  description,
}: {
  readonly title: string;
  readonly description: string;
}) {
  const colors = useTheme();
  return (
    <Card>
      <Text style={[styles.cardTitle, { color: colors.foreground }]}>
        {title}
      </Text>
      <Text style={[styles.description, { color: colors.muted }]}>
        {description}
      </Text>
    </Card>
  );
}

export function ErrorMessage({ message }: { readonly message: string }) {
  const colors = useTheme();
  return (
    <Text accessibilityRole="alert" style={{ color: colors.expense }}>
      {message}
    </Text>
  );
}

export function LoadingScreen({
  label = 'Loading…',
}: {
  readonly label?: string;
}) {
  const colors = useTheme();
  return (
    <SafeAreaView
      style={[styles.loading, { backgroundColor: colors.background }]}
    >
      <ActivityIndicator color={colors.accent} size="large" />
      <Text style={{ color: colors.muted }}>{label}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  screenContent: { flex: 1, paddingHorizontal: 20, paddingVertical: 24 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -1.2 },
  description: { fontSize: 15, lineHeight: 22, marginTop: 8 },
  body: { gap: 16, marginTop: 24 },
  button: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonLabel: { fontSize: 15, fontWeight: '700' },
  fieldGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '700' },
  field: {
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 15,
  },
  hint: { fontSize: 12, lineHeight: 18 },
  card: { borderRadius: 20, borderWidth: 1, padding: 18 },
  cardTitle: { fontSize: 20, fontWeight: '700' },
  loading: { alignItems: 'center', flex: 1, gap: 14, justifyContent: 'center' },
});
