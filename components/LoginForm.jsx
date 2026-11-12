"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  X,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import demoUsers from "../data/users.json";
import {
  getAccountProfile,
  getActiveGuestProfile,
  hasMeaningfulConflict,
  migrateGuestToAccount,
  activateAccountProfile,
  PENDING_MIGRATION_KEY,
  SELECTED_COUNT_KEY,
  clearTemporaryGuestData,
} from "../lib/profileStorage";

export default function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasGuestData, setHasGuestData] = useState(false);

  // Conflict Resolution State
  const [pendingMigration, setPendingMigration] = useState(null);

  useEffect(() => {
    router.prefetch("/onboarding");
    router.prefetch("/profile");
    router.prefetch("/results");

    // Check if there is an in-flight conflict resolution state (e.g. from page refresh)
    try {
      const rawPending = window.localStorage.getItem(PENDING_MIGRATION_KEY);
      if (rawPending) {
        const parsed = JSON.parse(rawPending);
        if (parsed && parsed.accountProfile && parsed.guestProfile && parsed.user) {
          setPendingMigration(parsed);
        }
      }

      const guest = getActiveGuestProfile();
      setHasGuestData(Boolean(guest));
    } catch {}
  }, [router]);

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
    const emailTrimmed = values.email.trim();

    if (!emailTrimmed) {
      nextErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed) &&
      !emailTrimmed.includes("aarav") &&
      !emailTrimmed.includes("rohanm")
    ) {
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

    // Check stored users in localStorage, falling back to demo users
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
        form: "No account found with this email. You can create a new account or select a quick demo user below.",
      });
      return;
    }

    // Save active user session
    const sessionUser = {
      fullName: matchedUser.fullName,
      email: matchedUser.email,
      username: matchedUser.username || matchedUser.email.split("@")[0],
      age: matchedUser.age || 25,
      savedCards: matchedUser.savedCards || [],
    };

    // Check for existing account profile and active guest profile
    const existingAccountProfile = getAccountProfile(sessionUser.email);
    const currentGuestProfile = getActiveGuestProfile();

    const rawCount = window.localStorage.getItem(SELECTED_COUNT_KEY);
    const chosenCount = Number(rawCount) || currentGuestProfile?.cardCount || 1;

    // Detect profile conflict: both exist and differ meaningfully
    if (
      existingAccountProfile &&
      currentGuestProfile &&
      hasMeaningfulConflict(existingAccountProfile, currentGuestProfile)
    ) {
      const pendingData = {
        user: sessionUser,
        accountProfile: existingAccountProfile,
        guestProfile: currentGuestProfile,
        selectedCardCount: chosenCount,
        timestamp: Date.now(),
      };

      try {
        window.localStorage.setItem(PENDING_MIGRATION_KEY, JSON.stringify(pendingData));
      } catch {}

      setPendingMigration(pendingData);
      setLoading(false);
      return;
    }

    // No conflict: execute immediate clean transition
    try {
      window.localStorage.setItem("cardwise:user", JSON.stringify(sessionUser));
      window.dispatchEvent(new Event("storage"));

      if (currentGuestProfile) {
        migrateGuestToAccount(sessionUser, currentGuestProfile, chosenCount);
        router.push("/results");
      } else if (existingAccountProfile) {
        activateAccountProfile(sessionUser, existingAccountProfile);
        router.push("/results");
      } else {
        clearTemporaryGuestData();
        router.push("/onboarding");
      }
    } catch {
      router.push("/results");
    }
  }

  // Conflict Resolution Handlers
  function handleKeepAccountProfile() {
    if (!pendingMigration) return;
    const { user, accountProfile } = pendingMigration;
    try {
      window.localStorage.setItem("cardwise:user", JSON.stringify(user));
      activateAccountProfile(user, accountProfile);
      clearTemporaryGuestData();
      window.dispatchEvent(new Event("storage"));
      setPendingMigration(null);
      router.push("/results");
    } catch {
      router.push("/results");
    }
  }

  function handleUseCurrentSessionProfile() {
    if (!pendingMigration) return;
    const { user, guestProfile, selectedCardCount } = pendingMigration;
    try {
      window.localStorage.setItem("cardwise:user", JSON.stringify(user));
      migrateGuestToAccount(user, guestProfile, selectedCardCount);
      clearTemporaryGuestData();
      window.dispatchEvent(new Event("storage"));
      setPendingMigration(null);
      router.push("/results");
    } catch {
      router.push("/results");
    }
  }

  function handleCancelConflict() {
    try {
      window.localStorage.removeItem(PENDING_MIGRATION_KEY);
    } catch {}
    setPendingMigration(null);
    router.push("/results");
  }

  function fillDemoUser(email) {
    setValues({ email, password: "password123" });
    setErrors({});
  }

  // ================= CONFLICT RESOLUTION VIEW =================
  if (pendingMigration) {
    const { user, accountProfile, guestProfile } = pendingMigration;

    const accountSpend = accountProfile.spending?.categories || {};
    const accountTotal =
      Number(accountProfile.spending?.totalMonthly) ||
      Object.values(accountSpend).reduce((s, v) => s + (Number(v) || 0), 0);
    const accountCardCount = Number(accountProfile.cardCount || accountProfile.preferences?.cardCount) || 1;

    const guestSpend = guestProfile.spending?.categories || {};
    const guestTotal =
      Number(guestProfile.spending?.totalMonthly) ||
      Object.values(guestSpend).reduce((s, v) => s + (Number(v) || 0), 0);
    const guestCardCount = Number(guestProfile.cardCount || guestProfile.preferences?.cardCount) || 1;

    return (
      <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-8 md:p-9 shadow-sm">
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Profile Synchronization
          </span>
          <h2 className="text-2xl font-extrabold text-black">
            Choose which profile to use
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
            Your account (<strong>{user.email}</strong>) has a previously saved profile, and you also entered spending details during this browsing session. Choose which one to keep:
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 mb-6">
          {/* Option A: Existing Account Profile */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 flex flex-col justify-between hover:border-neutral-400 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 rounded bg-neutral-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                  <Clock className="h-3 w-3" />
                  Saved on Account
                </span>
                <span className="text-[11px] text-neutral-400 font-medium">
                  {accountCardCount} {accountCardCount === 1 ? "Card" : "Cards"}
                </span>
              </div>

              <h3 className="text-base font-bold text-black mb-1">
                Existing Account Profile
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                Saved from your previous session
              </p>

              <div className="space-y-2 text-xs mb-5">
                <div className="flex justify-between py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500">Monthly spend:</span>
                  <span className="font-bold text-black cw-numeric">
                    ₹{accountTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500">Annual estimate:</span>
                  <span className="font-semibold text-neutral-700 cw-numeric">
                    ₹{(accountTotal * 12).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500">Reward style:</span>
                  <span className="font-medium text-neutral-800">
                    {accountProfile.preferences?.preferredRewardType || "Cashback"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleKeepAccountProfile}
              className="w-full rounded-[6px] border border-neutral-300 bg-white py-2.5 px-4 text-xs font-bold text-black hover:border-black hover:bg-neutral-50 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              Keep Account Profile
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Option B: Current Guest Profile */}
          <div className="rounded-xl border-2 border-black bg-white p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 rounded bg-[#e4f222] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                  <Sparkles className="h-3 w-3" />
                  Current Guest Session
                </span>
                <span className="text-[11px] text-neutral-500 font-bold">
                  {guestCardCount} {guestCardCount === 1 ? "Card" : "Cards"}
                </span>
              </div>

              <h3 className="text-base font-bold text-black mb-1">
                Current Session Profile
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                Configured during this visit
              </p>

              <div className="space-y-2 text-xs mb-5">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Monthly spend:</span>
                  <span className="font-bold text-black cw-numeric">
                    ₹{guestTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Annual estimate:</span>
                  <span className="font-semibold text-neutral-700 cw-numeric">
                    ₹{(guestTotal * 12).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Reward style:</span>
                  <span className="font-medium text-neutral-800">
                    {guestProfile.preferences?.preferredRewardType || "Cashback"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUseCurrentSessionProfile}
              className="w-full rounded-[6px] bg-black py-2.5 px-4 text-xs font-bold text-white hover:bg-neutral-800 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              Use Current Session Profile
              <ArrowRight className="h-3.5 w-3.5 text-[#DDF247]" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs">
          <button
            type="button"
            onClick={handleCancelConflict}
            className="text-neutral-500 hover:text-black font-semibold transition-colors"
          >
            Cancel and continue as guest
          </button>
          <span className="text-[11px] text-neutral-400">
            Neither profile is permanently lost until you choose
          </span>
        </div>
      </div>
    );
  }

  // ================= STANDARD LOGIN VIEW =================
  return (
    <div className="relative">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-8 md:p-9 shadow-sm"
      >
        <div className="mb-6">
          <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium mb-1">
            Account Sign In
          </p>
          <h2 className="text-2xl font-extrabold text-black">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed">
            Enter your email and password to access your personalized card recommendations.
          </p>
        </div>

        {/* Guest Session Continuity Notice */}
        {hasGuestData && (
          <div className="mb-5 rounded-xl border border-neutral-200/90 bg-neutral-50/80 p-3.5 text-xs text-neutral-700 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-black shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-black block">Preserve Current Results</span>
              <span className="text-[11px] text-neutral-500 block mt-0.5">
                Signing in will link your guest recommendations to your account, or let you pick between profiles if one already exists.
              </span>
            </div>
          </div>
        )}

        {errors.form && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errors.form}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5"
            >
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
              className={`w-full rounded-[6px] border px-3.5 py-2.5 text-sm text-black placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-black ${
                errors.email ? "border-red-400 bg-red-50/20" : "border-neutral-200 bg-white hover:border-neutral-300"
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
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-700"
              >
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
                className={`w-full rounded-[6px] border px-3.5 py-2.5 pr-10 text-sm text-black placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.password ? "border-red-400 bg-red-50/20" : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black focus:outline-none p-1"
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
          className="mt-6 w-full rounded-[6px] bg-black py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            "Signing in…"
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Cancel Action for Guest */}
        {hasGuestData && (
          <div className="mt-3 text-center">
            <Link
              href="/results"
              className="text-xs font-medium text-neutral-500 hover:text-black transition-colors"
            >
              Cancel and continue as guest
            </Link>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-black underline underline-offset-2">
            Create account
          </Link>
        </p>
      </form>

      {/* Quick Demo Pre-fill for Testing */}
      <div className="mt-6 rounded-xl border border-neutral-200/80 bg-white p-5 text-xs text-neutral-600 shadow-2xs">
        <p className="font-bold text-black uppercase tracking-wider text-[10px] mb-1">
          Demo Testing Accounts
        </p>
        <p className="text-neutral-500 leading-relaxed mb-3">
          Click any pre-seeded profile to autofill credentials for local evaluation:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fillDemoUser("aarav@example.com")}
            className="rounded-[6px] border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-800 hover:border-black hover:bg-white transition-colors"
          >
            Aarav Sharma (₹35k/mo Cashback)
          </button>
          <button
            type="button"
            onClick={() => fillDemoUser("rohan@example.com")}
            className="rounded-[6px] border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-800 hover:border-black hover:bg-white transition-colors"
          >
            Rohan Mehta (₹68k/mo Travel)
          </button>
          <button
            type="button"
            onClick={() => fillDemoUser("diya@example.com")}
            className="rounded-[6px] border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-800 hover:border-black hover:bg-white transition-colors"
          >
            Diya Nair (New Account • No Profile)
          </button>
        </div>
      </div>

      {/* Forgot Password Demo Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-black p-1"
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
              className="w-full rounded-[6px] bg-black py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
