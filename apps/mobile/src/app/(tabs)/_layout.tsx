import { useTheme } from '@/theme/theme';
import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';

export default function TabsLayout() {
  const colors = useTheme();
  const icon = (symbol: string, color: ColorValue) => (
    <Text style={{ color, fontSize: 20 }}>{symbol}</Text>
  );
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          display: 'none',
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => icon('⌂', color),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => icon('⇅', color),
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: 'Savings',
          tabBarIcon: ({ color }) => icon('◇', color),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color }) => icon('▥', color),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => icon('○', color),
        }}
      />
    </Tabs>
  );
}
