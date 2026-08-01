import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth as firebaseAuth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    signUp: async ({ email, password, firstName, lastName }) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        if (firstName || lastName) {
          await updateProfile(userCredential.user, {
            displayName: `${firstName || ''} ${lastName || ''}`.trim()
          });
        }
        return { data: { session: userCredential.user }, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    signIn: async ({ email, password }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        return { data: { session: userCredential.user }, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    signInWithOAuth: async (providerName) => {
      try {
        if (providerName === 'google') {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(firebaseAuth, provider);
          return { data: { session: result.user }, error: null };
        }
        throw new Error("Provider not supported");
      } catch (error) {
        return { data: null, error };
      }
    },
    setupRecaptcha: (containerId) => {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, containerId, {
          'size': 'invisible'
        });
      }
    },
    signInWithOtp: async (phone) => {
      try {
        if (!window.recaptchaVerifier) {
          throw new Error("reCAPTCHA not initialized");
        }
        const confirmationResult = await signInWithPhoneNumber(firebaseAuth, phone, window.recaptchaVerifier);
        window.confirmationResult = confirmationResult;
        return { data: true, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    verifyOtp: async (phone, token) => {
      try {
        if (!window.confirmationResult) {
          throw new Error("OTP request not found");
        }
        const result = await window.confirmationResult.confirm(token);
        return { data: { session: result.user }, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    resetPassword: async (email) => {
      try {
        await sendPasswordResetEmail(firebaseAuth, email);
        return { error: null };
      } catch (error) {
        return { error };
      }
    },
    signOut: async () => {
      await firebaseSignOut(firebaseAuth);
    },
    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
