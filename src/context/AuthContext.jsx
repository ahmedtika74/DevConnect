import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../features/user/userSlice";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        dispatch(fetchCurrentUser());
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        dispatch(fetchCurrentUser());
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const signUp = async (email, password) =>
    await supabase.auth.signUp({ email, password });
  const signIn = async (email, password) =>
    await supabase.auth.signInWithPassword({ email, password });
  const signOut = async () => await supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
