"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Loader2, AlertCircle } from "lucide-react";

/**
 * SignupForm
 * ------------------------------------------------------------
 * Demo registration form. Two assignment requirements live here:
 *
 * 1. FORM VALIDATION (Assignment 2)
 *    Every field is validated in plain JavaScript before submit:
 *    required checks, a username pattern, an email pattern, an age
 *    range, a password length rule and a confirm-password match.
 *    Invalid fields get .cw-input-invalid (red border) plus an
 *    error message wired up with aria-describedby.
 *
 * 2. jQUERY + AJAX (Assignment 3)
 *    The username field checks availability against the API route
 *    /api/check-username using jQuery's $.ajax(), debounced so it
 *    does not fire on every keystroke. jQuery is imported
 *    dynamically inside useEffect because it needs `window`.
 *
 * The "account" itself is stored in localStorage — this is a demo,
 * not real authentication, and the UI says so.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

const EMPTY = {
  fullName: "",
  username: "",
  email: "",
  age: "",
  password: "",
  confirmPassword: "",
};

export default function SignupForm() {
  const router = useRouter();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Username availability: "idle" | "checking" | "available" | "taken" | "error"
  const [availability, setAvailability] = useState("idle");
  const jqueryRef = useRef(null);
  const debounceRef = useRef(null);

  // ----------------------------------------------------------
  // Load jQuery once on the client.
  // ----------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    import("jquery").then((mod) => {
      if (!cancelled) jqueryRef.current = mod.default || mod;
    });
    return () => {
      cancelled = true;
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  // ----------------------------------------------------------
  // Assignment 3 — jQuery AJAX username availability check.
  // ----------------------------------------------------------
  function checkUsername(username) {
    const $ = jqueryRef.current;
    if (!$ || !USERNAME_PATTERN.test(username)) {
      setAvailability("idle");
      return;
    }

    setAvailability("checking");

    $.ajax({
      url: "/api/check-username",
      method: "GET",
      dataType: "json",
      data: { username },
      success: function (response) {
        setAvailability(response.available ? "available" : "taken");
      },
      error: function () {
        setAvailability("error");
      },
    });
  }

  function handleUsernameChange(value) {
    setValues((prev) => ({ ...prev, username: value }));
    setAvailability("idle");

    // Debounce: wait 400ms after typing stops before hitting the API.
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => checkUsername(value), 400);
  }

  // ----------------------------------------------------------
  // Assignment 2 — validation rules.
  // ----------------------------------------------------------
  function validate(data) {
    const next = {};

    if (!data.fullName.trim()) {
      next.fullName = "Enter your full name.";
    } else if (data.fullName.trim().length < 2) {
      next.fullName = "That name looks too short.";
    }

    if (!data.username.trim()) {
      next.username = "Choose a username.";
    } else if (!USERNAME_PATTERN.test(data.username)) {
      next.username = "3–20 characters, letters, numbers and underscores only.";
    } else if (availability === "taken") {
      next.username = "That username is already taken.";
    }

    if (!data.email.trim()) {
      next.email = "Enter your email address.";
    } else if (!EMAIL_PATTERN.test(data.email)) {
      next.email = "Enter a valid email address, e.g. you@example.com.";
    }

    const age = Number(data.age);
    if (!data.age) {
      next.age = "Enter your age.";
    } else if (!Number.isInteger(age) || age < 18 || age > 100) {
      next.age = "You must be between 18 and 100 to hold a credit card.";
    }

    if (!data.password) {
      next.password = "Choose a password.";
    } else if (data.password.length < 8) {
      next.password = "Use at least 8 characters.";
    } else if (!/[0-9]/.test(data.password)) {
      next.password = "Include at least one number.";
    }

    if (data.confirmPassword !== data.password) {
      next.confirmPassword = "The two passwords do not match.";
    }

    return next;
  }

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear a field's error as soon as the user edits it.
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Move focus to the first invalid field for keyboard users.
      const firstKey = Object.keys(found)[0];
      const el = document.getElementById(firstKey);
      if (el) el.focus();
      return;
    }

    // Demo "account" — stored client-side only. No password is kept.
    window.localStorage.setItem(
      "cardwise:user",
      JSON.stringify({
        fullName: values.fullName,
        username: values.username,
        email: values.email,
        age: Number(values.age),
      }),
    );

    setSubmitted(true);
    window.setTimeout(() => router.push("/profile"), 900);
  }

  /** Shared props for a text input, including error wiring. */
  function fieldProps(id, type = "text") {
    return {
      id,
      name: id,
      type,
      value: values[id],
      onChange: (e) => handleChange(id, e.target.value),
      className: `cw-input ${errors[id] ? "cw-input-invalid" : ""}`,
      "aria-invalid": errors[id] ? "true" : "false",
      "aria-describedby": errors[id] ? `${id}-error` : undefined,
    };
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="cw-card p-7 md:p-8">
      <h1 className="cw-h2 mb-1 text-[1.5rem]">Create your account</h1>
      <p className="mb-7 text-[0.9375rem] text-muted">
        Demo sign-up. Nothing leaves your browser and no password is stored.
      </p>

      <div className="space-y-5">
        {/* ---------- Full name ---------- */}
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-[0.875rem] font-medium">
            Full name
          </label>
          <input {...fieldProps("fullName")} placeholder="Aarav Sharma" autoComplete="name" />
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="cw-error-text">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* ---------- Username + jQuery AJAX availability ---------- */}
        <div>
          <label htmlFor="username" className="mb-1.5 block text-[0.875rem] font-medium">
            Username
          </label>
          <div className="relative">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="aarav_s"
              value={values.username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className={`cw-input pr-10 ${
                errors.username || availability === "taken" ? "cw-input-invalid" : ""
              }`}
              aria-invalid={errors.username ? "true" : "false"}
              aria-describedby="username-status username-error"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {availability === "checking" && (
                <Loader2 className="h-4 w-4 animate-spin text-muted" strokeWidth={1.75} />
              )}
              {availability === "available" && (
                <Check className="h-4 w-4 text-accent" strokeWidth={2} />
              )}
              {availability === "taken" && (
                <AlertCircle className="h-4 w-4" strokeWidth={1.75} style={{ color: "#c0392b" }} />
              )}
            </span>
          </div>

          {/* Live region so screen readers announce the AJAX result. */}
          <p id="username-status" aria-live="polite" className="mt-1.5 text-[0.8125rem]">
            {availability === "checking" && (
              <span className="text-muted">Checking availability…</span>
            )}
            {availability === "available" && (
              <span className="text-accent">That username is available.</span>
            )}
            {availability === "taken" && (
              <span style={{ color: "#c0392b" }}>That username is already taken.</span>
            )}
            {availability === "error" && (
              <span className="text-muted">Could not check right now.</span>
            )}
          </p>

          {errors.username && (
            <p id="username-error" role="alert" className="cw-error-text">
              {errors.username}
            </p>
          )}
        </div>

        {/* ---------- Email ---------- */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[0.875rem] font-medium">
            Email address
          </label>
          <input
            {...fieldProps("email", "email")}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && (
            <p id="email-error" role="alert" className="cw-error-text">
              {errors.email}
            </p>
          )}
        </div>

        {/* ---------- Age ---------- */}
        <div>
          <label htmlFor="age" className="mb-1.5 block text-[0.875rem] font-medium">
            Age
          </label>
          <input
            {...fieldProps("age")}
            inputMode="numeric"
            placeholder="24"
            className={`cw-input cw-numeric ${errors.age ? "cw-input-invalid" : ""}`}
          />
          {errors.age && (
            <p id="age-error" role="alert" className="cw-error-text">
              {errors.age}
            </p>
          )}
        </div>

        {/* ---------- Passwords ---------- */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[0.875rem] font-medium">
              Password
            </label>
            <input
              {...fieldProps("password", "password")}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
            {errors.password && (
              <p id="password-error" role="alert" className="cw-error-text">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-[0.875rem] font-medium"
            >
              Confirm password
            </label>
            <input
              {...fieldProps("confirmPassword", "password")}
              autoComplete="new-password"
              placeholder="Repeat it"
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" role="alert" className="cw-error-text">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
      </div>

      <button type="submit" className="cw-btn-primary mt-7 w-full" disabled={submitted}>
        {submitted ? "Account created — redirecting…" : "Create account"}
      </button>

      <p className="mt-4 text-center text-[0.875rem] text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
