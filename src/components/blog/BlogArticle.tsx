import { BlogPostData, formatPostDate } from "@/lib/blog";

/**
 * The article renderer shared by the live post page and the reviewer preview.
 * bodyHtml is sanitized server-side by the API before it ever reaches here.
 */
export default function BlogArticle({ post }: { post: BlogPostData }) {
  return (
    <article className="mx-auto max-w-3xl px-6">
      <header>
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full bg-wm-mint-soft px-3 py-1 text-xs font-semibold text-wm-green">
                {t.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        )}
        <h1 className="font-display text-3xl font-bold leading-tight text-wm-green sm:text-4xl" style={{ textWrap: "balance" }}>
          {post.title}
        </h1>
        {post.excerpt && <p className="mt-4 text-lg text-gray-600">{post.excerpt}</p>}
        <div className="mt-6 flex items-center gap-3 border-b border-gray-100 pb-6">
          {post.author.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.author.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-wm-mint-soft font-display font-bold text-wm-green">
              {post.author.name.charAt(0)}
            </span>
          )}
          <div className="text-sm">
            <p className="font-semibold text-wm-green">{post.author.name}</p>
            <p className="text-gray-400">
              {formatPostDate(post.publishedAt)} · {post.readingTimeMins} min read
            </p>
          </div>
        </div>
      </header>

      {post.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImageUrl} alt="" className="mt-8 w-full rounded-3xl object-cover" />
      )}

      <div className="article-body mt-8 pb-16" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
    </article>
  );
}
