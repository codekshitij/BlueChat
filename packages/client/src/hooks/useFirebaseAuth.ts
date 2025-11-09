import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    console.log('useFirebaseAuth: setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('useFirebaseAuth: auth state changed, user:', user?.uid || 'null');
      setUser(user);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  // Register
  const register = async (email: string, password: string, username?: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", userId), {
        email: userCredential.user.email,
        username: username || email.split('@')[0],
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
      });
    } catch (err: any) {
      let errorMessage = 'Registration failed';
      
      switch (err.code) {
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/Password authentication is not enabled. Please enable it in Firebase Console.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please login instead.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters long.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        default:
          errorMessage = err.message || 'Registration failed';
      }
      
      setError(errorMessage);
      console.error('Firebase Auth Error:', err.code, err.message);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    console.log('useFirebaseAuth: login called with email:', email);
    setLoading(true);
    setError(null);
    try {
      console.log('useFirebaseAuth: calling signInWithEmailAndPassword...');
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('useFirebaseAuth: login successful, user:', result.user.uid);
    } catch (err: any) {
      console.error('useFirebaseAuth: login failed with error:', err);
      let errorMessage = 'Login failed';
      
      switch (err.code) {
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/Password authentication is not enabled. Please enable it in Firebase Console.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed login attempts. Please try again later.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials.';
          break;
        default:
          errorMessage = err.message || 'Login failed';
      }
      
      setError(errorMessage);
      console.error('Firebase Auth Error:', err.code, err.message);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, initializing, error, register, login, logout };
}
