import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import AuthLayout, { Alert, AuthLink, DemoNote, PasswordField, PasswordMeter, SubmitButton, postJson } from "./AuthLayout";

const ROUTES = {
  login: "/login",
  forgetPassword: "/forgetPassword",
};

const LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [step, setStep] = useState("code"); // code | password
  const [digits, setDigits] = useState(Array(LENGTH).fill(""));
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [status, setStatus] = useState("idle");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const refs = useRef([]);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  useEffect(() => {
    if (step === "code") refs.current[0]?.focus();
  }, [step]);

  // Arrived without an email (for example by typing the URL): start from the beginning.
  if (!email) return <Navigate to={ROUTES.forgetPassword} replace />;

  const code = digits.join("");

  const setDigit = (index, value) => {
    setError("");
    setDigits((prev) => prev.map((d, i) => (i === index ? value : d)));
  };

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/\D/g, "").slice(-1);
    setDigit(index, value);
    if (value && index < LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setError("");
    setDigits(Array.from({ length: LENGTH }, (_, i) => pasted[i] ?? ""));
    refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  };

  const verify = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    if (code.length < LENGTH) {
      setError("Enter the 6-digit code.");
      return;
    }
    setStatus("sending");
    try {
      const data = await postJson("/api/auth/verify-otp", { email, code });
      setToken(data.resetToken || "");
      setStep("password");
      setError("");
    } catch (err) {
      setError(err.status === 429 ? "Too many attempts. Please wait and try again." : "That code is not correct or has expired.");
    }
    setStatus("idle");
  };

  const resend = async () => {
    if (seconds > 0) return;
    setError("");
    setInfo("");
    try {
      await postJson("/api/auth/forgot-password", { email });
      setInfo("A new code has been sent if the account exists.");
      setSeconds(RESEND_SECONDS);
      setDigits(Array(LENGTH).fill(""));
      refs.current[0]?.focus();
    } catch {
      setError("We could not resend the code. Please try again.");
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    setStatus("sending");
    try {
      await postJson("/api/auth/reset-password", { email, code, resetToken: token, password });
      navigate(ROUTES.login, { replace: true, state: { passwordReset: true } });
    } catch {
      setError("We could not update your password. The code may have expired. Please start again.");
      setStatus("idle");
    }
  };

  if (step === "password") {
    return (
      <AuthLayout
        title="Set a new password"
        subtitle="Choose a strong password you do not use anywhere else."
        footer={<AuthLink to={ROUTES.login}>Back to log in</AuthLink>}
      >
        {error && <Alert>{error}</Alert>}
        <form onSubmit={reset} noValidate>
          <PasswordField
            label="New password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a new password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />
          <PasswordMeter value={password} />
          <div className="mt-3">
            <SubmitButton loading={status === "sending"}>Update password</SubmitButton>
          </div>
        </form>
        <DemoNote />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Enter the code"
      subtitle={`If an account exists for ${email}, we sent a 6-digit code. It expires soon.`}
      footer={
        <>
          Wrong email? <AuthLink to={ROUTES.forgotPassword}>Use a different one</AuthLink>
        </>
      }
    >
      {error && <Alert>{error}</Alert>}
      {info && <Alert tone="success">{info}</Alert>}

      <form onSubmit={verify} noValidate>
        <fieldset>
          <legend className="sr-only">6-digit verification code</legend>
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                value={d}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={1}
                aria-label={`Digit ${i + 1}`}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/3 text-center font-mono text-xl text-white transition focus:border-orange-500/70 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            ))}
          </div>
        </fieldset>

        <div className="mb-4 mt-4 flex items-center justify-between text-sm">
          <span className="text-zinc-500">{seconds > 0 ? `Resend code in ${seconds}s` : "Did not get it?"}</span>
          <button
            type="button"
            onClick={resend}
            disabled={seconds > 0}
            className="rounded text-orange-400 underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:cursor-not-allowed disabled:text-zinc-600 disabled:no-underline"
          >
            Resend code
          </button>
        </div>
        <SubmitButton loading={status === "sending"}>Verify code</SubmitButton>
      </form>
      <DemoNote />
    </AuthLayout>
  );
}