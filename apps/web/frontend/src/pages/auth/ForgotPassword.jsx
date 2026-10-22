import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout, { Alert, AuthLink, DemoNote, Field, SubmitButton, postJson } from "./AuthLayout";

const ROUTES = {
  dashboard: "/dashboard",
  login: "/login",
  Signup:"/signup",
  forgotPassword: "/forgetPassword",
  home:"/",
  privacyPolicy:"/privacyPolicy",
  termsOfUse: "/termsOfUse",
  verifyOtp: "/verifyOtp"
};


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setStatus("sending");
    try {
      await postJson("/api/auth/forgot-password", { email: email.trim() });
      // The same result whether or not the account exists, so emails cannot be probed.
      navigate(ROUTES.verifyOtp, { state: { email: email.trim() } });
    } catch {
      setError("We could not send the code. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email. If an account exists, we will send a 6-digit code to reset your password."
      footer={
        <>
          Remembered it? <AuthLink to={ROUTES.login}>Back to log in</AuthLink>
        </>
      }
    >
      {status === "idle" && error && !EMAIL_RE.test(email.trim()) ? null : error && <Alert>{error}</Alert>}
      <form onSubmit={handleSubmit} noValidate>
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          error={error}
        />
        <SubmitButton loading={status === "sending"}>Send code</SubmitButton>
      </form>
      <DemoNote />
    </AuthLayout>
  );
}