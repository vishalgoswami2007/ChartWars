import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout, { Alert, AuthLink, DemoNote, Field, SubmitButton, postJson } from "./AuthLayout";

const ROUTES = {
  login: "/login",
  verifyOtp: "/verify-otp",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!EMAIL_RE.test(email.trim())) {
      setFieldError("Enter a valid email address.");
      return;
    }
    setFieldError("");
    setError("");
    setStatus("sending");
    try {
      await postJson("/api/v1/auth/forgot-password", { email: email.trim() });
      // Same result whether or not the account exists, so emails cannot be probed.
      navigate(ROUTES.verifyOtp, { state: { email: email.trim(), purpose: "reset_password" } });
    } catch (err) {
      if (err.status === 429) setError("Too many requests. Please wait a moment and try again.");
      else if (!err.status) setError("Cannot reach the server. Check your connection and try again.");
      else setError("We could not send the code. Please try again.");
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
      {error && <Alert>{error}</Alert>}
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
            setFieldError("");
            setError("");
          }}
          error={fieldError}
        />
        <SubmitButton loading={status === "sending"}>Send code</SubmitButton>
      </form>
      <DemoNote />
    </AuthLayout>
  );
}