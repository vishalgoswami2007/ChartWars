import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes";
import AuthLayout, { Alert, AuthLink, DemoNote, Divider, Field, GoogleButton, PasswordField, PasswordMeter, SubmitButton, postJson } from "./AuthLayout";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Enter your full name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (v.password.length < 8) e.password = "Use at least 8 characters.";
  if (!v.terms) e.terms = "Please accept the Terms of Use and Privacy Policy.";
  return e;
}

export default function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "", terms: false });
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
      await postJson("/api/auth/signup", {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      navigate(ROUTES.login, { replace: true, state: { registered: true } });
    } catch (err) {
      setError(
        err.status === 409
          ? "An account with this email may already exist. Try logging in instead."
          : "We could not create your account. Please try again."
      );
      setStatus("idle");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Practise with virtual funds. No real money involved."
      footer={
        <>
          Already have an account? <AuthLink to={ROUTES.login}>Log in</AuthLink>
        </>
      }
    >
      {error && <Alert>{error}</Alert>}
      {notice && <Alert tone="info">{notice}</Alert>}

      <GoogleButton label="Sign up with Google" onUnavailable={setNotice} />
      <Divider />

      <form onSubmit={handleSubmit} noValidate>
        <Field label="Full name" name="name" autoComplete="name" placeholder="Your name" value={values.name} onChange={handleChange} error={errors.name} />
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={handleChange} error={errors.email} />
        <PasswordField label="Password" name="password" autoComplete="new-password" placeholder="Create a password" value={values.password} onChange={handleChange} error={errors.password} />
        <PasswordMeter value={values.password} />

        <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-zinc-400">
          <input type="checkbox" name="terms" checked={values.terms} onChange={handleChange} className="mt-0.5 h-4 w-4 accent-orange-500" />
          <span>
            I agree to the <AuthLink to={ROUTES.terms}>Terms of Use</AuthLink> and <AuthLink to={ROUTES.privacy}>Privacy Policy</AuthLink>.
          </span>
        </label>
        <p className="mb-5 mt-1 min-h-4 text-xs text-red-400">{errors.terms}</p>

        <SubmitButton loading={status === "sending"}>Create account</SubmitButton>
      </form>
      <DemoNote />
    </AuthLayout>
  );
}