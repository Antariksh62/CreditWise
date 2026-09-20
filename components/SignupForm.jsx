"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
    ageConfirmed: true,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    const next = {};

    if (!values.fullName.trim()) {
      next.fullName = "Please enter your full name.";
    }

    if (!values.email.trim()) {
      next.email = "Please enter your email address.";
    } else if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(values.email.trim())) {
      next.email = "Please enter a valid email address.";
    }

    const ageNum = Number(values.age);
    if (!values.age) {
      next.age = "Please enter your age.";
    } else if (Number.isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      next.age = "You must be 18 years or older to apply for a credit card in India.";
    }

    if (!values.password) {
      next.password = "Choose a secure password.";
    } else if (values.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    } else if (!/[0-9]/.test(values.password)) {
      next.password = "Include at least one number in your password.";
    }

    if (values.confirmPassword !== values.password) {
      next.confirmPassword = "Passwords do not match.";
    }

    return next;
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

    setSubmitted(true);

    const newUser = {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      username: values.email.trim().split("@")[0],
      age: Number(values.age),
      createdAt: new Date().toISOString(),
      savedCards: [],
    };

    // Store in localStorage
    try {
      window.localStorage.setItem("cardwise:user", JSON.stringify(newUser));

      // Append to registered users list
      let usersList = [];
      const rawUsers = window.localStorage.getItem("cardwise:users");
      if (rawUsers) usersList = JSON.parse(rawUsers);
      usersList.push(newUser);
      window.localStorage.setItem("cardwise:users", JSON.stringify(usersList));

      // Clear any old onboarding profile so user gets a fresh start
      window.localStorage.removeItem("cardwise:profile");
    } catch {
      // ignore storage quota issues
    }

    // Direct user straight into the clean multi-step onboarding journey
    window.setTimeout(() => {
      router.push("/onboarding");
    }, 600);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200/80 bg-white p-7 sm:p-9 shadow-sm">
      <div className="mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider bg-[#DDF247] text-black px-2.5 py-1 rounded-full">
          Fast Sign Up
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black mt-3">
          Create your CreditWise account
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed">
          Initial setup takes less than a minute. No financial details or card numbers required to get started.
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Aarav Sharma"
            value={values.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black ${
              errors.fullName ? "border-red-400 bg-red-50/20" : "border-neutral-200 bg-neutral-50/40"
            }`}
            aria-invalid={errors.fullName ? "true" : "false"}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
              {errors.fullName}
            </p>
          )}
        </div>

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

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
            Age (Must be 18+)
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min="18"
            max="100"
            placeholder="25"
            value={values.age}
            onChange={(e) => handleChange("age", e.target.value)}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black ${
              errors.age ? "border-red-400 bg-red-50/20" : "border-neutral-200 bg-neutral-50/40"
            }`}
            aria-invalid={errors.age ? "true" : "false"}
            aria-describedby={errors.age ? "age-error" : undefined}
          />
          {errors.age && (
            <p id="age-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
              {errors.age}
            </p>
          )}
        </div>

        {/* Passwords in 2 columns on tablet/desktop */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 chars"
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat password"
                value={values.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className={`w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.confirmPassword ? "border-red-400 bg-red-50/20" : "border-neutral-200 bg-neutral-50/40"
                }`}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black focus:outline-none"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirmPassword-error" role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitted}
        className="mt-7 w-full rounded-lg bg-black py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-neutral-800 disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {submitted ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-[#DDF247]" />
            Account created — starting onboarding…
          </>
        ) : (
          "Continue to Onboarding →"
        )}
      </button>

      <p className="mt-5 text-center text-xs text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-black underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </form>
  );
}
