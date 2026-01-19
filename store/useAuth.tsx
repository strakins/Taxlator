import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';

type User = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
};

type LoginPayload = {
  emailOrPhone: string;
  password: string;
};

type SignupPayload = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const TOKEN_KEY = 'taxlator_token';
const USER_KEY = 'taxlator_user';

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD STORED SESSION ================= */
  useEffect(() => {
    (async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(
          TOKEN_KEY
        );
        const storedUser = await SecureStore.getItemAsync(
          USER_KEY
        );

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.log('Auth restore failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= LOGIN ================= */
  const login = async (payload: LoginPayload) => {
    /**
     * 🔗 Replace this with your API call
     */
    const res = await fakeLoginApi(payload);

    setUser(res.user);
    setToken(res.token);

    await SecureStore.setItemAsync(
      TOKEN_KEY,
      res.token
    );
    await SecureStore.setItemAsync(
      USER_KEY,
      JSON.stringify(res.user)
    );
  };

  /* ================= SIGNUP ================= */
  const signup = async (payload: SignupPayload) => {
    /**
     * 🔗 Replace this with your API call
     */
    const res = await fakeSignupApi(payload);

    setUser(res.user);
    setToken(res.token);

    await SecureStore.setItemAsync(
      TOKEN_KEY,
      res.token
    );
    await SecureStore.setItemAsync(
      USER_KEY,
      JSON.stringify(res.user)
    );
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    setUser(null);
    setToken(null);

    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }
  return context;
}

/* ================= MOCK APIS (REMOVE IN PROD) ================= */

async function fakeLoginApi(payload: LoginPayload) {
  await delay(1000);

  return {
    token: 'mock_token_123',
    user: {
      id: '1',
      fullName: 'Blessing Akinola',
      email: 'blessing@email.com',
    },
  };
}

async function fakeSignupApi(payload: SignupPayload) {
  await delay(1200);

  return {
    token: 'mock_token_456',
    user: {
      id: '2',
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
    },
  };
}

function delay(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}
