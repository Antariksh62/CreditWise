import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * SectionHeading
 * ------------------------------------------------------------
 * The one heading treatment every homepage section uses:
 * eyebrow → H2 → optional supporting line, with an optional
 * arrow link pinned to the right on desktop.
 *
 * Keeping this in one component is what makes the page read as a
 * single system rather than a stack of unrelated blocks.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  align = "left",
  as: Tag = "h2",
}) {
  const centred = align === "center";

  return (
    <div
      className={`mb-10 flex flex-col gap-4 md:mb-12 ${
        centred ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={centred ? "max-w-[52ch]" : "max-w-[46ch]"}>
        {eyebrow && <div className="cw-eyebrow mb-3">{eyebrow}</div>}
        <Tag className="cw-h2">{title}</Tag>
        {description && <p className="cw-body mt-3 text-lead">{description}</p>}
      </div>

      {actionHref && actionLabel && (
        <Link href={actionHref} className="cw-link-arrow shrink-0">
          {actionLabel}
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      )}
    </div>
  );
}
