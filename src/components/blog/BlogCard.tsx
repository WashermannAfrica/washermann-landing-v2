import Link from "next/link";
import { BlogCardData, formatPostDate } from "@/lib/blog";

export default function BlogCard({ post }: { post: BlogCardData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg"
    >
      {post.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImageUrl}
          alt=""
          className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-wm-mint-soft font-display text-3xl font-bold text-wm-green/30">
          W
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {post.tags[0] && (
          <span className="mb-2 w-fit rounded-full bg-wm-mint-soft px-3 py-1 text-xs font-semibold text-wm-green">
            {post.tags[0].replace(/-/g, " ")}
          </span>
        )}
        <h3 className="font-display text-lg font-bold leading-snug text-wm-green group-hover:underline">
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.excerpt}</p>}
        <p className="mt-auto pt-4 text-xs text-gray-400">
          {formatPostDate(post.publishedAt)} · {post.readingTimeMins} min read · {post.author.name}
        </p>
      </div>
    </Link>
  );
}
