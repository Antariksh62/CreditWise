"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import users from "../data/users.json";

/**
 * LoginForm
 * ------------------------------------------------------------
 * Simple demo authentication. It checks the entered username
 * against data/users.json and, on a match, writes the user to
 * localStorage so /profile has something to display.
 *
 * There is no password verification and no server session — this
 * is a coursework demo and the UI states that plainly. Real auth
 * would need a backend and hashed credentials.
 *
 * Assignment 2: the same client-side validation approach as the
 * signup form, applied to a smaller field set.
 */
export default function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      delete next.form;
      return next;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = {};

    if (!values.username.trim()) found.username = "Enter your username.";
    if (!values.password) found.password = "Enter your password.";

    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    const match = users.find(
      (u) => u.username.toLowerCase() === values.username.trim().toLowerCase(),
    );

    if (!match) {
      setErrors({ form: "No demo account with that username. Try “aarav” or “rohanm”." });
      return;
    }

    window.localStorage.setItem(
      "cardwise:user",
      JSON.stringify({
        fullName: match.fullName,
        username: match.username,
        email: match.email,
        age: match.age,
      }),
    );

    router.push("/profile");
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="cw-card p-7 md:p-8">
      <h1 className="cw-h2 mb-1 text-[1.5rem]">Sign in</h1>
      <p className="mb-7 text-[0.9375rem] text-muted">
        Demo sign-in. Any password works — accounts come from the sample data file.
      </p>

      {errors.form && (
        <p role="alert" className="cw-error-text mb-5 mt-0">
          {errors.form}
        </p>
      )}

      <div className="space-y-5">
        <div>
          <label htmlFor="username" className="mb-1.5 block text-[0.875rem] font-medium">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="aarav"
            value={values.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className={`cw-input ${errors.username ? "cw-input-invalid" : ""}`}
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && (
            <p id="username-error" role="alert" className="cw-error-text">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-[0.875rem] font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Anything at all"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className={`cw-input ${errors.password ? "cw-input-invalid" : ""}`}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" role="alert" className="cw-error-text">
              {errors.password}
            </p>
          )}
        </div>
      </div>

      <button type="submit" className="cw-btn-primary mt-7 w-full">
        Sign in
      </button>

      <p className="mt-4 text-center text-[0.875rem] text-muted">
        No account?{" "}
        <Link href="/signup" className="font-medium text-accent hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
