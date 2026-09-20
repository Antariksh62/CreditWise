"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, HelpCircle, X, ShieldCheck } from "lucide-react";
import demoUsers from "../data/users.json";

export default function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      delete next.form;
      return next;
    });
  }

  function validate() {
    const nextErrors = {};
    if (!values.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(values.email.trim()) && !values.email.includes("aarav") && !values.email.includes("rohanm")) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 4) {
      nextErrors.password = "Password must be at least 4 characters.";
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      const firstField = Object.keys(found)[0];
      const el = document.getElementById(firstField);
      if (el) el.focus();
      return;
    }

    setLoading(true);

    // Look for stored users in localStorage, falling back to demo users
    let storedUsers = [];
    try {
      const raw = window.localStorage.getItem("cardwise:users");
      if (raw) storedUsers = JSON.parse(raw);
    } catch {
      storedUsers = [];
    }

    const inputLower = values.email.trim().toLowerCase();
    
    // Check locally registered users first
    const localUser = storedUsers.find(
      (u) => u.email?.toLowerCase() === inputLower || u.username?.toLowerCase() === inputLower
    );

    // Check pre-seeded demo users
    const sampleUser = demoUsers.find(
      (u) => u.email?.toLowerCase() === inputLower || u.username?.toLowerCase() === inputLower
    );

    const matchedUser = localUser || sampleUser;

    if (!matchedUser) {
      setLoading(false);
      setErrors({
        form: "No account found with this email. You can sign up below or try demo user 'aarav@example.com'."
      });
      return;
    }

    // Save active user session
    const sessionUser = {
      fullName: matchedUser.fullName,
      email: matchedUser.email,
      username: matchedUser.username || matchedUser.email.split("@")[0],
      age: matchedUser.age || 25,
      savedCards: matchedUser.savedCards || []
    };

    window.localStorage.setItem("cardwise:user", JSON.stringify(sessionUser));

    // Check if user has an onboarding profile
    const existingProfile = window.localStorage.getItem("cardwise:profile");
    if (!existingProfile) {
      router.push("/onboarding");
    } else {
      router.push("/profile");
    }
  }

  function fillDemoUser(email) {
    setValues({ email, password: "password123" });
    setErrors({});
  }

  return (
    <div className="relative">
      <form noValidate onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200/80 bg-white p-7 sm:p-9 shadow-sm">
        <div className="mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full">
            Demo Authentication
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black mt-3">
            Sign in to CreditWise
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed">
            Access your personalized spending breakdown and saved card recommendations.
          </p>
        </div>

        {errors.form && (
          <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errors.form}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black ${
                errors.email ? "border-red-400 bg-red-50/20" : "border-neutral-200 bg-neutral-50/40"
              }`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-medium text-neutral-500 hover:text-black underline underline-offset-2"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={values.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.password ? "border-red-400 bg-red-50/20" : "border-neutral-200 bg-neutral-50/40"
                }`}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.password}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-black py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="mt-5 text-center text-xs text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-black underline underline-offset-2">
            Create account
          </Link>
        </p>
      </form>

      {/* Quick Demo Pre-fill */}
      <div className="mt-5 rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-4 text-xs text-neutral-600">
        <p className="font-bold text-neutral-800 uppercase tracking-wider text-[10px] mb-1.5">
          Quick Demo Accounts
        </p>
        <p className="text-neutral-500 leading-relaxed mb-2.5">
          Click any pre-seeded profile to autofill credentials for testing:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fillDemoUser("aarav@example.com")}
            className="rounded border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-black"
          >
            Aarav Sharma
          </button>
          <button
            type="button"
            onClick={() => fillDemoUser("rohan@example.com")}
            className="rounded border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-black"
          >
            Rohan Mehta
          </button>
          <button
            type="button"
            onClick={() => fillDemoUser("kabir@example.com")}
            className="rounded border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-black"
          >
            Kabir Singh
          </button>
        </div>
      </div>

      {/* Forgot Password Demo Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-black"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              <HelpCircle className="h-4 w-4 text-black" />
              Demo Password Recovery
            </div>
            <h3 className="text-base font-bold text-black mb-2">
              Local Browser Demo Authentication
            </h3>
            <p className="text-xs leading-relaxed text-neutral-600 mb-4">
              CreditWise uses browser-local storage for this demo environment. No passwords are sent over the network or stored on external servers.
            </p>
            <div className="rounded-lg bg-neutral-50 border border-neutral-200/80 p-3 text-xs text-neutral-600 space-y-1.5 mb-5">
              <p>• Pre-seeded accounts (e.g. <code>aarav@example.com</code>) accept any password.</p>
              <p>• If you registered a new account, you can create another one or clear your browser data from the profile page.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full rounded-lg bg-black py-2.5 text-xs font-bold text-white hover:bg-neutral-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
