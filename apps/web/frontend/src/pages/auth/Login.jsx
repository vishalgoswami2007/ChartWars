import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout, { Alert, AuthLink, DemoNote, Divider, Field, GoogleButton, PasswordField, SubmitButton, postJson } from "./AuthLayout";
import { useAuth } from "../auth/AuthProvider";

const ROUTES = {
  dashboard: "/dashboard",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  verifyOtp: "/verify-otp",
  home: "/",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v) {
  const e = {};
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (!v.password) e.password = "Enter your password.";
  return e;
}

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    setError("");
    if (Object.keys(found).length > 0) return;

    const email = values.email.trim();
    setStatus("sending");
    try {
      const data = await postJson("/api/v1/auth/login", { email, password: values.password });
      if (data.user) setUser(data.user);
      navigate(ROUTES.dashboard, { replace: true });
    } catch (err) {
      if (err.code === "EMAIL_NOT_VERIFIED") {
        // account exists but email was never verified: send a fresh code and continue there
        try {
          await postJson("/api/v1/auth/resend-otp", { email });
        } catch {
          // the code from signup may still be valid, so carry on
        }
        navigate(ROUTES.verifyOtp, { state: { email, purpose: "verify_email" } });
        return;
      }

      if (err.status === 401) setError("Incorrect email or password.");
      else if (err.status === 429) setError("Too many attempts. Please wait a moment and try again.");
      else if (!err.status) setError("Cannot reach the server. Check your connection and try again.");
      else setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue practising."
      footer={
        <>
          New to ChartWars? <AuthLink to={ROUTES.signup}>Create an account</AuthLink>
        </>
      }
    >
      {error && <Alert>{error}</Alert>}
      {notice && <Alert tone="info">{notice}</Alert>}

      <GoogleButton label="Sign in with Google" onUnavailable={setNotice} />
      <Divider />

      <form onSubmit={handleSubmit} noValidate>
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={handleChange} error={errors.email} />
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          right={<AuthLink to={ROUTES.forgotPassword} className="text-xs">Forgot password?</AuthLink>}
        />
        <div className="mt-2">
          <SubmitButton loading={status === "sending"}>Log in</SubmitButton>
        </div>
      </form>
      <DemoNote />
    </AuthLayout>
  );
}