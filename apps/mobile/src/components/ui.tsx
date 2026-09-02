import { useAuth } from '@/features/auth/auth-context';
import { useTheme } from '@/theme/theme';
import { router, usePathname, type Href } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Modal,
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
  header = true,
}: {
  readonly title: string;
  readonly description?: string;
  readonly children: React.ReactNode;
  readonly scroll?: boolean;
  readonly header?: boolean;
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
      {header ? <AppHeader /> : null}
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

function AppHeader() {
  const colors = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  return (
    <>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.mantle, borderBottomColor: colors.border },
        ]}
      >
        <Pressable
          accessibilityLabel="Menu"
          accessibilityRole="button"
          onPress={() => setMenuOpen(true)}
          style={({ pressed }) => [
            styles.headerButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.headerIcon, { color: colors.foreground }]}>
            ◉
          </Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Budget Manager
        </Text>
        <Pressable
          accessibilityLabel="New transaction"
          accessibilityRole="button"
          onPress={() => setAddOpen(true)}
          style={({ pressed }) => [
            styles.headerButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.headerIcon, { color: colors.foreground }]}>
            +
          </Text>
        </Pressable>
      </View>
      <SideMenuModal open={menuOpen} onClose={() => setMenuOpen(false)} />
      <QuickAddModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}

function SideMenuModal({
  open,
  onClose,
}: {
  readonly open: boolean;
  readonly onClose: () => void;
}) {
  const colors = useTheme();
  const pathname = usePathname();
  const { signOut } = useAuth();

  const navigate = (href: Href) => {
    onClose();
    router.push(href);
  };

  const logout = async () => {
    onClose();
    await signOut();
    router.replace('/auth');
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={open}
    >
      <View style={styles.modalLayer}>
        <Pressable
          accessibilityLabel="Close menu"
          style={[styles.backdrop, { backgroundColor: `${colors.crust}88` }]}
          onPress={onClose}
        />
        <View style={[styles.sideMenu, { backgroundColor: colors.mantle }]}>
          <Text style={[styles.menuTitle, { color: colors.foreground }]}>
            Menu
          </Text>
          <View style={styles.menuItems}>
            <MenuItem
              active={pathname === '/'}
              icon="⌂"
              label="Home"
              onPress={() => navigate('/')}
            />
            <MenuItem
              active={pathname === '/analytics'}
              icon="▥"
              label="Analytics"
              onPress={() => navigate('/analytics')}
            />
            <MenuItem
              active={pathname === '/savings'}
              icon="◇"
              label="Savings"
              onPress={() => navigate('/savings')}
            />
            <MenuItem
              active={pathname === '/profile'}
              icon="○"
              label="Profile"
              onPress={() => navigate('/profile')}
            />
            <MenuItem icon="⇥" label="Sign Out" onPress={() => void logout()} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function QuickAddModal({
  open,
  onClose,
}: {
  readonly open: boolean;
  readonly onClose: () => void;
}) {
  const colors = useTheme();
  const addTransaction = (type: 'INCOME' | 'EXPENSE') => {
    onClose();
    router.push({ pathname: '/transaction', params: { type } });
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={open}
    >
      <View style={styles.modalLayer}>
        <Pressable
          accessibilityLabel="Close quick add"
          style={[styles.backdrop, { backgroundColor: `${colors.crust}88` }]}
          onPress={onClose}
        />
        <View style={[styles.quickAdd, { backgroundColor: colors.mantle }]}>
          <Text style={[styles.menuTitle, { color: colors.foreground }]}>
            New transaction
          </Text>
          <Text style={[styles.quickCopy, { color: colors.muted }]}>
            Record money coming in, going out, or saved.
          </Text>
          <View style={styles.quickActions}>
            <Button
              label="Add income"
              onPress={() => addTransaction('INCOME')}
            />
            <Button
              label="Add expense"
              onPress={() => addTransaction('EXPENSE')}
              variant="secondary"
            />
            <Button
              label="Add saving"
              onPress={() => {
                onClose();
                router.push('/saving');
              }}
              variant="quiet"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function MenuItem({
  active = false,
  icon,
  label,
  onPress,
}: {
  readonly active?: boolean;
  readonly icon: string;
  readonly label: string;
  readonly onPress: () => void;
}) {
  const colors = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        {
          backgroundColor: active ? colors.accent : 'transparent',
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.menuIcon,
          { color: active ? colors.white : colors.foreground },
        ]}
      >
        {icon}
      </Text>
      <Text
        style={[
          styles.menuLabel,
          { color: active ? colors.white : colors.foreground },
        ]}
      >
        {label}
      </Text>
    </Pressable>
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
  screenContent: { flex: 1, paddingHorizontal: 8, paddingVertical: 8 },
  title: { fontSize: 26, fontWeight: '800' },
  description: { fontSize: 15, lineHeight: 22, marginTop: 8 },
  body: { gap: 8, marginTop: 12 },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 61,
    paddingHorizontal: 12,
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  headerButton: {
    alignItems: 'center',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  headerIcon: { fontSize: 31, fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  modalLayer: { flex: 1, flexDirection: 'row' },
  backdrop: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  sideMenu: {
    elevation: 12,
    padding: 24,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    width: 288,
  },
  quickAdd: {
    elevation: 12,
    marginLeft: 'auto',
    padding: 24,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    width: '86%',
  },
  menuTitle: { fontSize: 30, fontWeight: '800', marginBottom: 28 },
  menuItems: { gap: 12 },
  menuItem: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  menuIcon: { fontSize: 22, width: 26 },
  menuLabel: { fontSize: 18, fontWeight: '700' },
  quickCopy: { fontSize: 15, lineHeight: 22, marginTop: -18 },
  quickActions: { gap: 12, marginTop: 28 },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonLabel: { fontSize: 15, fontWeight: '700' },
  fieldGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '700' },
  field: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 15,
  },
  hint: { fontSize: 12, lineHeight: 18 },
  card: { borderRadius: 8, borderWidth: 1, padding: 14 },
  cardTitle: { fontSize: 20, fontWeight: '700' },
  loading: { alignItems: 'center', flex: 1, gap: 14, justifyContent: 'center' },
});
