import SignupForm from "../../components/SignupForm";

/**
 * /signup — demo registration
 * ------------------------------------------------------------
 * Hosts the form that carries two assignment requirements:
 * client-side validation (Assignment 2) and the jQuery AJAX
 * username availability check (Assignment 3).
 */

export const metadata = {
  title: "Create an account",
  description:
    "Create a CardWise demo account to save cards. Includes live username availability checking.",
};

export default function SignupPage() {
  return (
    <div className="cw-rail">
      <div className="cw-container py-16 md:py-24">
        <div className="mx-auto max-w-[520px]">
          <SignupForm />

          <div className="mt-6 rounded-card border border-border bg-subtle p-5">
            <p className="cw-eyebrow mb-2">How this works</p>
            <p className="text-[0.875rem] leading-relaxed text-muted">
              Every field is validated in the browser before submit. The username field
              additionally calls <code className="text-foreground">/api/check-username</code>{" "}
              through jQuery&apos;s <code className="text-foreground">$.ajax()</code>,
              debounced by 400ms, and the API compares it against the sample user list.
              Existing usernames include <em>aarav</em>, <em>diya_n</em> and{" "}
              <em>ananya</em> — try one to see the taken state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
