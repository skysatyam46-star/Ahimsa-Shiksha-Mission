import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { useAuth } from '../context/AuthContext';

interface AdminLoginScreenProps {
  onLoginSuccess: () => void;
  onBack: () => void;
  onNavigate?: (path: string) => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  onLoginSuccess,
  onBack,
}) => {
  const { login, isConfigured, missingConfigKeys } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation error states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);
    setAuthError(null);

    // 1. Email validation
    if (!email.trim()) {
      setEmailError('Email required');
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setEmailError('Valid email enter karein');
        isValid = false;
      }
    }

    // 2. Password validation
    if (!password) {
      setPasswordError('Password required');
      isValid = false;
    }

    return isValid;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!isConfigured) {
      setAuthError(
        `Firebase environment variables missing: ${missingConfigKeys.join(', ')}. Kripya Secrets panel me configuration set karein.`
      );
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      await login(email, password);
      setIsLoading(false);
      onLoginSuccess();
    } catch (err: unknown) {
      setIsLoading(false);
      const error = err as { code?: string; message?: string };
      const code = error?.code || '';
      const message = error?.message || '';

      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        message.includes('invalid-credential')
      ) {
        setAuthError('Email ya password galat hai.');
      } else if (code === 'auth/invalid-email') {
        setAuthError('Kripya valid email address darj karein.');
      } else if (code === 'auth/user-disabled') {
        setAuthError('Yeh admin account nishkriya (disabled) kar diya gaya hai.');
      } else if (code === 'auth/too-many-requests') {
        setAuthError('Bahut saare asafal prayas. Kripya thodi der baad koshish karein.');
      } else if (code === 'auth/network-request-failed') {
        setAuthError('Network connection ki samasya hai. Kripya internet check karein.');
      } else if (message === 'unauthorized-role') {
        setAuthError('Aapke paas Admin Panel access karne ki anumati (Admin role) nahi hai.');
      } else {
        setAuthError(message || 'Login asafal raha. Kripya punah prayas karein.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDE6] sm:py-6 flex justify-center items-start">
      {/* Mobile Shell Frame */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[844px] bg-[#FAF8F5] text-[#1F2421] relative flex flex-col justify-between sm:rounded-[32px] sm:shadow-[0_12px_40px_rgba(22,50,92,0.08)] sm:border sm:border-[#E8E5DF] overflow-hidden p-4 sm:p-6">
        {/* Top Bar with Back Button */}
        <div className="pt-1 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Wapas jayein"
            className="inline-flex items-center gap-1.5 py-1.5 pr-3 text-[14px] font-semibold text-[#16325C] hover:text-[#0F2342] transition-colors tap-active min-h-[44px]"
          >
            <ArrowLeft size={18} strokeWidth={2.2} />
            <span>Wapas</span>
          </button>

          <span className="text-[11px] font-semibold text-[#5C6773] bg-[#EEF3FA] px-2.5 py-1 rounded-full border border-[#16325C]/10 flex items-center gap-1">
            <ShieldCheck size={13} className="text-[#16325C]" />
            Authorized Only
          </span>
        </div>

        {/* Centered Login Box */}
        <div className="my-auto py-6">
          {/* Logo & Title Header */}
          <div className="text-center flex flex-col items-center mb-6">
            <div className="p-3 bg-white border border-[#E8E5DF] rounded-2xl shadow-xs mb-3">
              <Logo size={56} />
            </div>

            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#16325C] tracking-tight">
              Admin Login
            </h1>
            <p className="text-[13px] text-[#5C6773] mt-1 max-w-[280px] leading-relaxed">
              Mission website ko manage karne ke liye login karein.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white border border-[#E8E5DF] rounded-2xl p-5 shadow-xs">
            {/* Global Auth Error State */}
            {authError && (
              <div
                role="alert"
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-[13px] font-medium animate-fadeIn"
              >
                <AlertCircle size={17} className="shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
              {/* 1. Email Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="admin-email"
                  className="text-[13px] font-semibold text-[#1F2421]"
                >
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Admin email"
                  autoComplete="email"
                  className={`w-full min-h-[46px] px-3.5 rounded-xl border text-[14px] bg-[#FAF8F5] focus:bg-white transition-all outline-hidden ${
                    emailError
                      ? 'border-red-500 focus:ring-2 focus:ring-red-400/20'
                      : 'border-[#E8E5DF] focus:border-[#16325C] focus:ring-2 focus:ring-[#16325C]/15'
                  }`}
                />
                {emailError && (
                  <span className="text-[12px] font-medium text-red-600 pl-1">
                    {emailError}
                  </span>
                )}
              </div>

              {/* 2. Password Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="admin-password"
                  className="text-[13px] font-semibold text-[#1F2421]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Password"
                    autoComplete="current-password"
                    className={`w-full min-h-[46px] pl-3.5 pr-11 rounded-xl border text-[14px] bg-[#FAF8F5] focus:bg-white transition-all outline-hidden ${
                      passwordError
                        ? 'border-red-500 focus:ring-2 focus:ring-red-400/20'
                        : 'border-[#E8E5DF] focus:border-[#16325C] focus:ring-2 focus:ring-[#16325C]/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Password chupayein' : 'Password dikhayein'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#5C6773] hover:text-[#16325C] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && (
                  <span className="text-[12px] font-medium text-red-600 pl-1">
                    {passwordError}
                  </span>
                )}
              </div>

              {/* 3. Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[48px] mt-2 rounded-xl bg-[#16325C] hover:bg-[#0F2342] text-white font-semibold text-[15px] transition-all flex items-center justify-center gap-2 tap-active disabled:opacity-80 shadow-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Login ho raha hai…</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {/* Secondary small text */}
            <div className="mt-4 pt-3.5 border-t border-[#E8E5DF] text-center">
              <span className="text-[12px] text-[#5C6773] flex items-center justify-center gap-1.5">
                <ShieldCheck size={14} className="text-[#2E7D32]" />
                Sirf authorized administrator ke liye
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="text-center pb-2 text-[11px] text-[#8C96A3]">
          अहिंसा शिक्षा मिशन • प्रशासनिक सुरक्षा प्रणाली
        </div>
      </div>
    </div>
  );
};
