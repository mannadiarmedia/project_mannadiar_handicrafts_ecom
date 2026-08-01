import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithOAuth, signInWithOtp, verifyOtp, setupRecaptcha, resetPassword } = useAuth();
  
  // Tabs: 'email', 'phone'
  const [authMethod, setAuthMethod] = useState('email');
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Setup recaptcha on mount so it's ready for phone auth
    setupRecaptcha('recaptcha-container');
  }, [setupRecaptcha]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const { error } = await signInWithOAuth('google');
      if (error) throw error;
      // Google redirect handles navigation
    } catch (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let result;
      if (isLogin) {
        result = await signIn({ email, password });
      } else {
        if (!agreedToTerms) {
          throw new Error('You must agree to the Terms of Service to create an account.');
        }
        result = await signUp({ email, password, firstName, lastName });
      }

      if (result.error) throw result.error;
      
      if (!isLogin && !result.data?.session) {
        setSuccessMsg('Please check your email to verify your account.');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (!otpSent) {
        // Send OTP
        const { error } = await signInWithOtp(phone);
        if (error) throw error;
        setOtpSent(true);
        setSuccessMsg('OTP sent! Please check your messages.');
      } else {
        // Verify OTP
        const { error } = await verifyOtp(phone, otp);
        if (error) throw error;
        navigate('/profile');
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setSuccessMsg('Password reset email sent! Check your inbox.');
      setIsResetPassword(false);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '80px 0', minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '440px', backgroundColor: '#fff', padding: '40px', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
          <img src="/images/logo.png" alt="Mannadiar Logo" style={{ width: '48px', height: '48px', objectFit: 'contain', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 400, fontFamily: 'Playfair Display', textAlign: 'center', margin: 0, lineHeight: 1.1 }}>
            Mannadiar<br/>Handicrafts
          </h1>
        </div>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px', fontFamily: 'Inter', fontSize: '0.9rem' }}>
          Sign in to access your orders and profile.
        </p>

        {errorMsg && (
          <div style={{ padding: '12px', backgroundColor: '#fff3f3', color: '#d32f2f', borderRadius: '4px', marginBottom: '24px', fontSize: '0.9rem', fontFamily: 'Inter' }}>
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div style={{ padding: '12px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', marginBottom: '24px', fontSize: '0.9rem', fontFamily: 'Inter' }}>
            {successMsg}
          </div>
        )}

        {/* Google Login Button */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', cursor: 'pointer', fontFamily: 'Inter', fontSize: '1rem', fontWeight: 500, marginBottom: '24px' }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: '#999', fontSize: '0.85rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
          <span style={{ padding: '0 16px', fontFamily: 'Inter' }}>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
        </div>

        {/* Method Toggle (Hide if resetting password) */}
        {!isResetPassword && (
          <div style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid #eee' }}>
            <button 
              onClick={() => { setAuthMethod('email'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: authMethod === 'email' ? '2px solid #111' : '2px solid transparent', color: authMethod === 'email' ? '#111' : '#888', fontWeight: authMethod === 'email' ? 600 : 400, cursor: 'pointer', fontFamily: 'Inter', fontSize: '0.95rem' }}
            >
              Email
            </button>
            <button 
              onClick={() => { setAuthMethod('phone'); setErrorMsg(''); setSuccessMsg(''); setOtpSent(false); }}
              style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: authMethod === 'phone' ? '2px solid #111' : '2px solid transparent', color: authMethod === 'phone' ? '#111' : '#888', fontWeight: authMethod === 'phone' ? 600 : 400, cursor: 'pointer', fontFamily: 'Inter', fontSize: '0.95rem' }}
            >
              Mobile (OTP)
            </button>
          </div>
        )}

        {/* FORGOT PASSWORD FORM */}
        {isResetPassword && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '0.9rem', color: '#666', fontFamily: 'Inter', marginBottom: '8px' }}>
              Enter your email address and we will send you a link to reset your password.
            </p>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontFamily: 'Inter', fontSize: '0.9rem' }}>Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Inter', fontSize: '1rem' }} 
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '12px' }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button 
                type="button"
                onClick={() => { setIsResetPassword(false); setErrorMsg(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#111', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Inter', fontSize: '0.9rem' }}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* EMAIL FORM */}
        {authMethod === 'email' && !isResetPassword && (
          <>
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {!isLogin && (
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontFamily: 'Inter', fontSize: '0.9rem' }}>First Name</label>
                    <input 
                      type="text" 
                      required 
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Inter', fontSize: '1rem' }} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontFamily: 'Inter', fontSize: '0.9rem' }}>Last Name</label>
                    <input 
                      type="text" 
                      required 
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Inter', fontSize: '1rem' }} 
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontFamily: 'Inter', fontSize: '0.9rem' }}>Email</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Inter', fontSize: '1rem' }} 
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontFamily: 'Inter', fontSize: '0.9rem' }}>Password</label>
                  {isLogin && (
                    <button 
                      type="button"
                      onClick={() => { setIsResetPassword(true); setErrorMsg(''); setSuccessMsg(''); }}
                      style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Inter' }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Inter', fontSize: '1rem', paddingRight: '40px' }} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>
              
              {!isLogin && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '4px' }}>
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={agreedToTerms} 
                    onChange={e => setAgreedToTerms(e.target.checked)}
                    style={{ marginTop: '4px' }}
                  />
                  <label htmlFor="terms" style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'Inter', lineHeight: 1.5 }}>
                    I agree to the <a href="/terms" target="_blank" style={{ color: '#111', textDecoration: 'underline' }}>Terms of Service</a> and <a href="/privacy" target="_blank" style={{ color: '#111', textDecoration: 'underline' }}>Privacy Policy</a>.
                  </label>
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '12px' }}
                disabled={loading}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>
            <div style={{ marginTop: '24px', textAlign: 'center', fontFamily: 'Inter', fontSize: '0.9rem', color: '#666' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                style={{ background: 'none', border: 'none', color: '#111', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </>
        )}

        {/* PHONE FORM */}
        {authMethod === 'phone' && !isResetPassword && (
          <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontFamily: 'Inter', fontSize: '0.9rem' }}>Mobile Number</label>
              <input 
                type="tel" 
                required 
                placeholder="+919876543210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={otpSent}
                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Inter', fontSize: '1rem', backgroundColor: otpSent ? '#f9f9f9' : '#fff' }} 
              />
            </div>
            
            {otpSent && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontFamily: 'Inter', fontSize: '0.9rem' }}>Enter OTP</label>
                <input 
                  type="text" 
                  required 
                  placeholder="6-digit code"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Inter', fontSize: '1rem', letterSpacing: '0.2em', textAlign: 'center' }} 
                />
              </motion.div>
            )}
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '12px' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : (otpSent ? 'Verify OTP & Log In' : 'Send OTP')}
            </button>
          </form>
        )}

        {/* Hidden reCAPTCHA container required for Firebase Phone Auth */}
        <div id="recaptcha-container"></div>

      </motion.div>
    </div>
  );
}
