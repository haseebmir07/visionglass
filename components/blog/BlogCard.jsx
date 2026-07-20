import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

// `priority` should be true only for above-the-fold cards (first row) so the
// rest lazy-load, per the SEO/image requirements.
const BlogCard = ({ post, priority = false }) => {
    return (
        <article className="group flex flex-col rounded-lg border border-gray-200 overflow-hidden bg-white hover:shadow-md transition">
            <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden bg-gray-100">
                {post.featuredImage ? (
                    <Image
                        src={post.featuredImage}
                        alt={post.featuredImageAlt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition duration-300"
                        priority={priority}
                        loading={priority ? undefined : 'lazy'}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
                )}
            </Link>

            <div className="flex flex-col flex-1 p-4">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    {post.category && (
                        <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="text-orange-600 font-medium hover:underline">
                            {post.category}
                        </Link>
                    )}
                    {post.category && <span>•</span>}
                    <time dateTime={post.publishedAt || undefined}>{formatDate(post.publishedAt)}</time>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 leading-snug mb-2 line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-orange-600 transition">
                        {post.title}
                    </Link>
                </h2>

                {post.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                )}

                <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                    <span>{post.readingTime ? `${post.readingTime} min read` : ''}</span>
                    <Link href={`/blog/${post.slug}`} className="text-orange-600 font-medium hover:underline">
                        Read more →
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default BlogCard;
