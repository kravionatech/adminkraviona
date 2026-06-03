// Auth page — login via password OR OTP, fully integrated with /api/auth/*
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSmartphone, FiLock, FiArrowLeft } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { authApi } from "../../services/api";
import { tokenStore } from "../../services/apiClient";

export default function Auth() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState("password");
  const [step, setStep] = useState("credentials"); // 'credentials' | 'otp'
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSuccess = (data) => {
    const token = data?.token || data;
    if (token?.accessToken) {
      tokenStore.set({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: data.user || token.user || null,
      });
      navigate("/dashboard", { replace: true });
    } else {
      setError("Login succeeded, but token was not received.");
    }
  };

  const submitPassword = async (e) => {
    e?.preventDefault?.();
    setError(""); setBusy(true);
    try {
      const data = await authApi.loginPassword({ identifier, password });
      onSuccess(data);
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally { setBusy(false); }
  };

  const requestOtp = async (e) => {
    e?.preventDefault?.();
    setError(""); setBusy(true);
    try {
      await authApi.resendOtp({ identifier });
      setStep("otp");
    } catch (err) {
      setError(err?.message || "Failed to send OTP");
    } finally { setBusy(false); }
  };

  const verifyOtp = async (e) => {
    e?.preventDefault?.();
    setError(""); setBusy(true);
    try {
      const data = await authApi.loginOtp({ identifier, otp });
      onSuccess(data);
    } catch (err) {
      setError(err?.message || "Invalid OTP");
    } finally { setBusy(false); }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50 font-sans overflow-hidden p-4 sm:p-8">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#235056] rounded-full mix-blend-multiply filter blur-[150px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#d26c51] rounded-full mix-blend-multiply filter blur-[150px] opacity-20"></div>
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-[#f2c695] rounded-full mix-blend-multiply filter blur-[120px] opacity-30"></div>

      <div className="relative z-10 w-full max-w-xl transform transition-all duration-500 hover:scale-[1.01]">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.avif" alt="Kraviona Logo" className="w-16 h-16 mb-4 object-contain" />
            <h1 className="text-3xl font-extrabold text-[#235056] uppercase tracking-wider">Kraviona</h1>
            <p className="text-center text-gray-500 mt-2 text-sm">
              {step === "otp" ? `Please enter the OTP sent to ${identifier}` : "Welcome back! Please enter your details."}
            </p>
          </div>

          {error && (
            <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>
          )}

          {step === "otp" ? (
            <form onSubmit={verifyOtp} className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-[#235056] mb-1.5 text-center">Enter 6-Digit OTP</label>
                <input type="text" maxLength="6" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="••••••"
                  className="w-full p-3 border border-gray-300 rounded-lg text-center tracking-[0.5em] text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#d26c51]" />
              </div>
              <button disabled={busy} className="w-full bg-[#235056] text-white p-3 rounded-lg font-bold text-lg hover:bg-[#1a3d42] transition-colors shadow-md disabled:opacity-50">
                {busy ? "Verifying…" : "Verify & Login"}
              </button>
              <div className="flex justify-center mt-4">
                <button type="button" onClick={() => setStep("credentials")} className="text-sm font-semibold text-[#d26c51] hover:text-[#b65840] flex items-center gap-1">
                  <FiArrowLeft /> Back to login
                </button>
              </div>
            </form>
          ) : loginMethod === "password" ? (
            <form onSubmit={submitPassword} className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-[#235056] mb-1.5">Email / Username / Phone</label>
                <input type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email, username or phone"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d26c51]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#235056] mb-1.5">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d26c51]" />
              </div>
              <button disabled={busy} className="w-full bg-[#235056] text-white p-3 rounded-lg font-bold text-lg hover:bg-[#1a3d42] transition-colors shadow-md disabled:opacity-50">
                {busy ? "Signing in…" : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={requestOtp} className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-[#235056] mb-1.5">Email ID or Mobile Number</label>
                <input type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your Email ID or mobile number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d26c51]" />
              </div>
              <button disabled={busy} className="w-full bg-[#235056] text-white p-3 rounded-lg font-bold text-lg hover:bg-[#1a3d42] transition-colors shadow-md disabled:opacity-50">
                {busy ? "Sending…" : "Send OTP"}
              </button>
            </form>
          )}

          {step !== "otp" && (
            <>
              <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="px-4 text-gray-400 text-sm font-medium">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              <div className="space-y-3">
                <button type="button" onClick={() => setLoginMethod((m) => (m === "password" ? "otp" : "password"))}
                  className="w-full flex items-center justify-center gap-3 border-2 border-[#f2c695] text-[#235056] p-3 rounded-lg font-semibold hover:bg-[#fff9f2] transition-colors">
                  {loginMethod === "password" ? (<><FiSmartphone className="text-xl" /> Login With OTP</>) : (<><FiLock className="text-xl" /> Login With Password</>)}
                </button>
                <button type="button" onClick={() => alert("Google OAuth coming soon — please use email + password / OTP for now.")} className="w-full flex items-center justify-center gap-3 border border-gray-300 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                  <FcGoogle className="text-xl" /> Login with Google
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
