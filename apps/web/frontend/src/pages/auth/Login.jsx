import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthLayout, { Alert, AuthLink, DemoNote, Divider, Field, GoogleButton, PasswordField, SubmitButton, postJson } from "./AuthLayout";
const ROUTES = {
  dashboard: "/dashboard",
  signup: "/signup",
  forgotPassword: "/forgetPassword",
  home:"/"
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
  const location = useLocation();
  const [values, setValues] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    setError("");
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      await postJson("/api/auth/login", {
        email: values.email.trim(),
        password: values.password,
        remember: values.remember,
      });
      navigate(ROUTES.dashboard ?? ROUTES.home, { replace: true });
    } catch (err) {
      // One message for every failure, so we never reveal whether an email exists.
      setError(err.status === 429 ? "Too many attempts. Please wait a moment and try again." : "Incorrect email or password.");
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
      {location.state?.registered && <Alert tone="success">Account created. Log in to continue.</Alert>}
      {location.state?.passwordReset && <Alert tone="success">Password updated. Log in with your new password.</Alert>}
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
        <label className="mb-6 flex items-center gap-3 text-sm text-zinc-400">
          <input type="checkbox" name="remember" checked={values.remember} onChange={handleChange} className="h-4 w-4 accent-orange-500" />
          Keep me signed in on this device
        </label>
        <SubmitButton loading={status === "sending"}>Log in</SubmitButton>
      </form>
      <DemoNote />
    </AuthLayout>
  );
}