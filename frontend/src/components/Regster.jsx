import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  const getPasswordStrength = () => {
    const password = form.password;

    if (!password) {
      return {
        label: "",
        width: "0%",
        className: "",
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      return {
        label: "Weak",
        width: "25%",
        className: "bg-red-500",
      };
    }

    if (score === 2) {
      return {
        label: "Fair",
        width: "50%",
        className: "bg-amber-500",
      };
    }

    if (score === 3) {
      return {
        label: "Good",
        width: "75%",
        className: "bg-blue-500",
      };
    }

    return {
      label: "Strong",
      width: "100%",
      className: "bg-emerald-500",
    };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.companyName.trim()) {
      setError("Please enter your company name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.password) {
      setError("Please create a password.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.terms) {
      setError(
        "Please accept the Terms & Conditions to continue."
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * Connect this endpoint to your Django registration API.
       */

      const response = await fetch(`${API_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: form.fullName,
          company_name: form.companyName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          confirm_password: form.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Registration failed. Please try again."
        );
      }

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-slate-900 overflow-hidden">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="fixed inset-0 pointer-events-none">

        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-400/15 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-400/15 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">

        <div className="w-full max-w-6xl">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="flex justify-center mb-7">

            <Link
              to="/login"
              className="flex items-center gap-3 group"
            >

              <div className="relative">

                <div className="absolute inset-0 rounded-2xl bg-blue-500/30 blur-lg group-hover:bg-blue-500/50 transition" />

                <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">

                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 19V9" />
                    <path d="M9 19V5" />
                    <path d="M14 19v-8" />
                    <path d="M19 19V3" />
                  </svg>

                </div>

              </div>

              <div>

                <div className="text-xl font-black tracking-tight">
                  Ultrakey
                </div>

                <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold">
                  Business Suite
                </div>

              </div>

            </Link>

          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* =================================================
                LEFT
            ================================================= */}

            <div className="hidden lg:block px-8">

              <div className="max-w-lg">

                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 backdrop-blur px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm mb-6">

                  <span className="relative flex h-2 w-2">

                    <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />

                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />

                  </span>

                  Start your workspace

                </div>

                <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-900">

                  Build your

                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">

                    business workspace.

                  </span>

                </h1>

                <p className="mt-6 text-lg leading-8 text-slate-500 max-w-md">

                  Create your Ultrakey account and bring
                  invoices, quotations, clients and payments
                  together in one professional workspace.

                </p>

                {/* Benefits */}

                <div className="mt-8 space-y-4">

                  <RegisterFeature
                    number="01"
                    title="Create your account"
                    text="Set up your business workspace in minutes."
                  />

                  <RegisterFeature
                    number="02"
                    title="Manage your clients"
                    text="Keep client and business information organized."
                  />

                  <RegisterFeature
                    number="03"
                    title="Start invoicing"
                    text="Create professional invoices and quotations."
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                REGISTER CARD
            ================================================= */}

            <div className="w-full max-w-md mx-auto">

              <div className="relative">

                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-cyan-500/20 rounded-[30px] blur-xl" />

                <div className="relative rounded-[28px] border border-white/80 bg-white/90 backdrop-blur-2xl shadow-2xl shadow-slate-300/40 p-7 sm:p-9">

                  {/* Header */}

                  <div className="mb-7">

                    <div className="flex items-center justify-between">

                      <div>

                        <h2 className="text-2xl font-black text-slate-900">
                          Create account
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Get started with Ultrakey
                        </p>

                      </div>

                      <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">

                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3M9 12a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 0112 0"
                          />
                        </svg>

                      </div>

                    </div>

                  </div>

                  {/* Error */}

                  {error && (

                    <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">

                      <div className="flex items-start gap-3">

                        <span className="text-red-500">
                          ⚠
                        </span>

                        <p className="text-sm font-medium text-red-700">
                          {error}
                        </p>

                      </div>

                    </div>

                  )}

                  {/* Success */}

                  {success && (

                    <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">

                      <div className="flex items-center gap-3">

                        <span className="text-emerald-500">
                          ✓
                        </span>

                        <p className="text-sm font-medium text-emerald-700">
                          {success}
                        </p>

                      </div>

                    </div>

                  )}

                  {/* FORM */}

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >

                    {/* Name + Company */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <Input
                        label="Full name"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Your name"
                        icon="user"
                      />

                      <Input
                        label="Company"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="Company name"
                        icon="building"
                      />

                    </div>

                    {/* Email */}

                    <Input
                      label="Email address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      icon="email"
                    />

                    {/* Phone */}

                    <Input
                      label="Phone number"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      icon="phone"
                    />

                    {/* Password */}

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Password
                      </label>

                      <div className="relative">

                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                          <span className="text-slate-400">
                            🔒
                          </span>

                        </div>

                        <input
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Create a password"
                          className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          className="absolute inset-y-0 right-0 px-4 text-slate-400 hover:text-slate-700"
                        >
                          {showPassword ? "🙈" : "👁"}
                        </button>

                      </div>

                      {/* Strength */}

                      {form.password && (

                        <div className="mt-2">

                          <div className="flex justify-between mb-1">

                            <span className="text-[10px] text-slate-400">
                              Password strength
                            </span>

                            <span className="text-[10px] font-semibold text-slate-500">
                              {passwordStrength.label}
                            </span>

                          </div>

                          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">

                            <div
                              className={`h-full rounded-full transition-all duration-300 ${passwordStrength.className}`}
                              style={{
                                width:
                                  passwordStrength.width,
                              }}
                            />

                          </div>

                        </div>

                      )}

                    </div>

                    {/* Confirm Password */}

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Confirm password
                      </label>

                      <div className="relative">

                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                          <span className="text-slate-400">
                            🔐
                          </span>

                        </div>

                        <input
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          className="absolute inset-y-0 right-0 px-4 text-slate-400 hover:text-slate-700"
                        >
                          {showConfirmPassword
                            ? "🙈"
                            : "👁"}
                        </button>

                      </div>

                    </div>

                    {/* Terms */}

                    <label className="flex items-start gap-3 cursor-pointer pt-1">

                      <input
                        type="checkbox"
                        name="terms"
                        checked={form.terms}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />

                      <span className="text-xs leading-5 text-slate-500">

                        I agree to the{" "}

                        <button
                          type="button"
                          className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Terms & Conditions
                        </button>{" "}

                        and{" "}

                        <button
                          type="button"
                          className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Privacy Policy
                        </button>

                      </span>

                    </label>

                    {/* Register */}

                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full h-12 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_100%] text-white font-bold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:bg-[position:100%_0] hover:shadow-blue-500/35 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >

                      <span className="relative flex items-center justify-center gap-2">

                        {loading ? (

                          <>
                            <svg
                              className="h-5 w-5 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />

                              <path
                                className="opacity-90"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />

                            </svg>

                            Creating account...

                          </>

                        ) : (

                          <>
                            Create account

                            <svg
                              className="w-5 h-5 transition-transform group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>

                          </>

                        )}

                      </span>

                    </button>

                  </form>

                  {/* Login */}

                  <div className="mt-6 text-center">

                    <span className="text-sm text-slate-500">
                      Already have an account?
                    </span>{" "}

                    <Link
                      to="/login"
                      className="text-sm font-bold text-blue-600 hover:text-blue-700"
                    >
                      Sign in
                    </Link>

                  </div>

                  {/* Security */}

                  <div className="mt-6 pt-5 border-t border-slate-100">

                    <div className="grid grid-cols-3 gap-2">

                      <SecurityItem
                        icon="🔒"
                        text="Encrypted"
                      />

                      <SecurityItem
                        icon="⚡"
                        text="Fast"
                      />

                      <SecurityItem
                        icon="🛡"
                        text="Protected"
                      />

                    </div>

                  </div>

                </div>

              </div>

              <p className="text-center mt-5 text-xs text-slate-400">

                © {new Date().getFullYear()} Ultrakey IT Solutions
                Private Limited

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   INPUT
============================================================ */

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
}) {
  const icons = {
    user: "👤",
    building: "🏢",
    email: "✉",
    phone: "☎",
  };

  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <div className="relative">

        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-sm">
          {icons[icon]}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
        />

      </div>

    </div>
  );
}


/* ============================================================
   REGISTER FEATURE
============================================================ */

function RegisterFeature({ number, title, text }) {
  return (
    <div className="flex gap-4">

      <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">

        <span className="text-xs font-black text-blue-600">
          {number}
        </span>

      </div>

      <div>

        <h3 className="text-sm font-bold text-slate-800">
          {title}
        </h3>

        <p className="text-xs text-slate-500 mt-0.5">
          {text}
        </p>

      </div>

    </div>
  );
}


/* ============================================================
   SECURITY
============================================================ */

function SecurityItem({ icon, text }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 py-2.5 text-center">

      <div className="text-sm mb-0.5">
        {icon}
      </div>

      <div className="text-[10px] font-semibold text-slate-500">
        {text}
      </div>

    </div>
  );
}