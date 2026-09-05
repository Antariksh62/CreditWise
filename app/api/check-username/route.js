import { NextResponse } from "next/server";
import users from "../../../data/users.json";

/**
 * GET /api/check-username?username=aarav
 * ------------------------------------------------------------
 * API ROUTE (Assignment 4: server-side route handler)
 *
 * Called by the signup form through jQuery's $.ajax() to check
 * whether a username is already taken. Reads data/users.json and
 * returns a small JSON payload:
 *
 *   { username: "aarav", available: false, reason: "taken" }
 *
 * A tiny artificial delay makes the "checking…" state visible in
 * the UI during a demo; remove it in production.
 */

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = (searchParams.get("username") || "").trim();

  // Validate on the server too — never trust the client alone.
  if (!username) {
    return NextResponse.json(
      { username, available: false, reason: "missing" },
      { status: 400 },
    );
  }

  if (!USERNAME_PATTERN.test(username)) {
    return NextResponse.json(
      { username, available: false, reason: "invalid" },
      { status: 400 },
    );
  }

  // Make the "checking…" spinner perceptible in the demo.
  await new Promise((resolve) => setTimeout(resolve, 250));

  const taken = users.some(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );

  return NextResponse.json({
    username,
    available: !taken,
    reason: taken ? "taken" : "available",
  });
}
