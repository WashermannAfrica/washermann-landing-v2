import { PolicyDocument, formatEffectiveDate } from "@/lib/legal";

/**
 * Renders a policy document. contentHtml is sanitized server-side by the API
 * before it reaches here. Reuses the shared `.article-body` styles, adding h1
 * styling (policies lead with an h1 title, which the blog body does not use).
 */
export default function PolicyBody({ doc }: { doc: PolicyDocument }) {
  return (
    <article className="mx-auto max-w-3xl px-6">
      <p className="mb-4 text-sm text-gray-400">
        Version {doc.versionNumber} · Effective {formatEffectiveDate(doc.effectiveDate)}
      </p>
      <div
        className="article-body pb-16 [&>h1]:mb-3 [&>h1]:font-display [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:leading-tight [&>h1]:text-wm-green sm:[&>h1]:text-4xl"
        dangerouslySetInnerHTML={{ __html: doc.contentHtml }}
      />
    </article>
  );
}
