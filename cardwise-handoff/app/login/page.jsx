import LoginForm from "../../components/LoginForm";

/**
 * /login — demo sign-in
 * ------------------------------------------------------------
 * Server shell around the client form. Authentication is a
 * localStorage demo, not a real session; the page says so.
 */

export const metadata = {
  title: "Sign in",
  description:
    "Sign in to your CardWise demo account to see the cards you have saved. Demo authentication only.",
};

export default function LoginPage() {
  return (
    <div className="cw-rail">
      <div className="cw-container py-16 md:py-24">
        <div className="mx-auto max-w-[440px]">
          <LoginForm />

          <div className="mt-6 rounded-card border border-border bg-subtle p-5">
            <p className="cw-eyebrow mb-2">Demo accounts</p>
            <p className="text-[0.875rem] leading-relaxed text-muted">
              Try <code className="font-medium text-foreground">aarav</code>,{" "}
              <code className="font-medium text-foreground">rohanm</code> or{" "}
              <code className="font-medium text-foreground">kabir99</code> with any
              password. Accounts come from data/users.json — there is no server, no
              session and no password checking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
