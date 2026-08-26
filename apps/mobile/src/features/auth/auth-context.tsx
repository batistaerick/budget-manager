import { api } from '@/lib/api';
import { ApiClientError, type User } from '@budget-manager/api-client';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface AuthContextValue {
  readonly loading: boolean;
  readonly user: User | undefined;
  readonly login: (email: string, password: string) => Promise<void>;
  readonly register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  readonly signOut: () => Promise<void>;
  readonly refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();
  async function refresh() {
    setUser(await api.currentUser());
  }
  useEffect(() => {
    void refresh()
      .catch((error: unknown) => {
        if (!(error instanceof ApiClientError && error.status === 401)) {
          console.warn('Unable to restore the mobile session.');
        }
        setUser(undefined);
      })
      .finally(() => setLoading(false));
  }, []);
  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      user,
      refresh,
      login: async (email, password) => {
        await api.login(email, password);
        await refresh();
      },
      register: async (name, email, password) => {
        await api.register(email, password, name);
        await api.login(email, password);
        await refresh();
      },
      signOut: async () => {
        await api.logout();
        setUser(undefined);
      },
    }),
    [loading, user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return value;
}
