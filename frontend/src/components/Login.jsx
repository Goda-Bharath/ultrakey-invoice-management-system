import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      /*
       * Change this endpoint when your Django authentication API
       * is ready.
       */

      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Invalid email or password."
        );
      }

      /*
       * Save authentication information.
       * Adjust these keys according to your backend.
       */

      const storage = form.remember
        ? localStorage
        : sessionStorage;

      if (data.token) {
        storage.setItem("token", data.token);
      }

      if (data.user) {
        storage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/");
    } catch (err) {
      /*
       * If backend is not connected yet, this will show
       * the actual API error.
       */
      setError(
        err.message ||
          "Unable to login. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-slate-900 overflow-hidden">

      {/* =====================================================
          BACKGROUND EFFECTS
      ===================================================== */}

      <div className="fixed inset-0 pointer-events-none">

        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-400/15 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-400/15 blur-3xl" />

        {/* Grid */}

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

          <div className="flex justify-center mb-8">

            <Link
              to="/"
              className="flex items-center gap-3 group"
            >

              {/* Logo */}

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

                <div className="text-xl font-black tracking-tight text-slate-900">
                  Ultrakey
                </div>

                <div className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold">
                  Business Suite
                </div>

              </div>

            </Link>

          </div>

          {/* =================================================
              CONTENT GRID
          ================================================= */}

          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="hidden lg:block px-8">

              <div className="max-w-lg">

                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/70 backdrop-blur px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm mb-6">

                  <span className="relative flex h-2 w-2">

                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />

                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />

                  </span>

                  System Online

                </div>

                <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-900">

                  Manage your

                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">

                    business smarter.

                  </span>

                </h1>

                <p className="mt-6 text-lg leading-8 text-slate-500 max-w-md">

                  Create professional invoices, manage quotations,
                  track payments and keep your business operations
                  organized in one powerful workspace.

                </p>

                {/* Features */}

                <div className="mt-8 space-y-4">

                  <Feature
                    icon="₹"
                    title="Smart Invoicing"
                    text="Create and manage professional invoices."
                  />

                  <Feature
                    icon="↗"
                    title="Quotation Management"
                    text="Prepare quotations and track their status."
                  />

                  <Feature
                    icon="✓"
                    title="Payment Tracking"
                    text="Monitor paid, pending and overdue invoices."
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                LOGIN CARD
            ================================================= */}

            <div className="w-full max-w-md mx-auto">

              <div className="relative">

                {/* Glow */}

                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-cyan-500/20 rounded-[30px] blur-xl" />

                {/* Card */}

                <div className="relative rounded-[28px] border border-white/80 bg-white/85 backdrop-blur-2xl shadow-2xl shadow-slate-300/40 p-7 sm:p-9">

                  {/* Header */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between">

                      <div>

                        <h2 className="text-2xl font-black text-slate-900">
                          Welcome back
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Sign in to your workspace
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
                            d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
                          />
                        </svg>

                      </div>

                    </div>

                  </div>

                  {/* Error */}

                  {error && (

                    <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">

                      <div className="flex items-start gap-3">

                        <div className="flex-shrink-0 mt-0.5">

                          <svg
                            className="w-5 h-5 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>

                        </div>

                        <p className="text-sm font-medium text-red-700">
                          {error}
                        </p>

                      </div>

                    </div>

                  )}

                  {/* Form */}

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >

                    {/* Email */}

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email address
                      </label>

                      <div className="relative">

                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                          <svg
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>

                        </div>

                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@company.com"
                          autoComplete="email"
                          className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/70 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                      </div>

                    </div>

                    {/* Password */}

                    <div>

                      <div className="flex items-center justify-between mb-2">

                        <label className="text-sm font-semibold text-slate-700">
                          Password
                        </label>

                        <Link
                          to="/forgot-password"
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Forgot password?
                        </Link>

                      </div>

                      <div className="relative">

                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                          <svg
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>

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
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/70 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          className="absolute inset-y-0 right-0 px-4 text-slate-400 hover:text-slate-700"
                        >

                          {showPassword ? (

                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.273-3.986M6.228 6.228A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.028M6.228 6.228L3 3m3.228 3.228l11.544 11.544"
                              />
                            </svg>

                          ) : (

                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />

                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />

                            </svg>

                          )}

                        </button>

                      </div>

                    </div>

                    {/* Remember */}

                    <div className="flex items-center justify-between">

                      <label className="flex items-center gap-2 cursor-pointer">

                        <input
                          type="checkbox"
                          name="remember"
                          checked={form.remember}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />

                        <span className="text-sm text-slate-600">
                          Remember me
                        </span>

                      </label>

                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        Secure login

                      </span>

                    </div>

                    {/* Login Button */}

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

                            Signing in...

                          </>

                        ) : (

                          <>
                            Sign in

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

                  {/* Divider */}

                  <div className="relative my-7">

                    <div className="absolute inset-0 flex items-center">

                      <div className="w-full border-t border-slate-200" />

                    </div>

                    <div className="relative flex justify-center">

                      <span className="bg-white px-3 text-xs text-slate-400">
                        Secure business workspace
                      </span>

                    </div>

                  </div>

                  {/* Security */}

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

              {/* Footer */}

              <p className="text-center mt-6 text-xs text-slate-400">

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
   FEATURE COMPONENT
============================================================ */

function Feature({ icon, title, text }) {
  return (
    <div className="flex items-center gap-4">

      <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 font-bold">

        {icon}

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
   SECURITY ITEM
============================================================ */

function SecurityItem({ icon, text }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 py-3 text-center">

      <div className="text-sm mb-1">
        {icon}
      </div>

      <div className="text-[10px] font-semibold text-slate-500">
        {text}
      </div>

    </div>
  );
}