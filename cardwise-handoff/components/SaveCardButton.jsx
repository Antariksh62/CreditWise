"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

/**
 * SaveCardButton
 * ------------------------------------------------------------
 * A deliberately quiet bookmark toggle in the corner of a card
 * tile — never a third full-width button competing with
 * "View details" and "Compare".
 *
 * Persists to localStorage so the demo profile page has something
 * to read. No backend involved; this is a client-only convenience.
 */

const STORAGE_KEY = "cardwise:saved";

/** Read the saved-slug list, tolerating a corrupted value. */
export function readSaved() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function SaveCardButton({ slug, name }) {
  const [saved, setSaved] = useState(false);
  // Rendered only after mount so the server and client markup match.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(readSaved().includes(slug));
    setReady(true);
  }, [slug]);

  function toggle(event) {
    // The tile itself is a link; do not follow it when saving.
    event.preventDefault();
    event.stopPropagation();

    const current = readSaved();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(next.includes(slug));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={ready ? saved : false}
      aria-label={saved ? `Remove ${name} from saved cards` : `Save ${name}`}
      title={saved ? "Saved" : "Save this card"}
      className="rounded p-1.5 text-muted transition-colors duration-200 hover:bg-subtle hover:text-foreground"
    >
      <Bookmark
        className="h-4 w-4"
        strokeWidth={1.75}
        fill={ready && saved ? "currentColor" : "none"}
      />
    </button>
  );
}
