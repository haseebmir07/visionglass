import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/blog/BlogCard';
import JsonLd from '@/components/blog/JsonLd';
import {
    getPostBySlug,
    getRelatedPosts,
    getAllPublishedPosts,
} from '@/lib/blogQueries';
import { sanitizeBlogHtml } from '@/lib/sanitize';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/siteConfig';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
    const posts = await getAllPublishedPosts();
    return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) {
        return { title: `Not found | ${SITE_NAME}` };
    }

    const metaTitle = post.seo.metaTitle || post.title;
    const metaDescription = post.seo.metaDescription || post.excerpt || '';
    const canonical = post.seo.canonicalUrl || absoluteUrl(`/blog/${post.slug}`);
    const ogImage = post.seo.ogImage || post.featuredImage;

    return {
        title: metaTitle,
        description: metaDescription,
        alternates: { canonical },
        openGraph: {
            title: post.seo.ogTitle || metaTitle,
            description: post.seo.ogDescription || metaDescription,
            url: canonical,
            siteName: SITE_NAME,
            type: 'article',
            publishedTime: post.publishedAt || undefined,
            modifiedTime: post.updatedAt || undefined,
            authors: post.author ? [post.author] : undefined,
            tags: post.tags,
            images: ogImage ? [{ url: ogImage, alt: post.featuredImageAlt || post.title }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.seo.ogTitle || metaTitle,
            description: post.seo.ogDescription || metaDescription,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

const BlogPostPage = async ({ params }) => {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) notFound();

    const related = await getRelatedPosts(post, 3);
    const cleanHtml = sanitizeBlogHtml(post.content);
    const canonical = post.seo.canonicalUrl || absoluteUrl(`/blog/${post.slug}`);
    const ogImage = post.seo.ogImage || post.featuredImage;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.seo.metaDescription || post.excerpt || '',
        image: ogImage ? [ogImage] : undefined,
        datePublished: post.publishedAt || undefined,
        dateModified: post.updatedAt || post.publishedAt || undefined,
        author: { '@type': 'Person', name: post.author || SITE_NAME },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        keywords: post.tags?.join(', ') || undefined,
    };

    return (
        <>
            <Navbar />
            <JsonLd data={jsonLd} />

            <main className="px-6 md:px-16 lg:px-32 py-10">
                <article className="max-w-3xl mx-auto">
                    <nav className="text-sm text-gray-400 mb-4" aria-label="Breadcrumb">
                        <Link href="/blog" className="hover:text-orange-600">Blog</Link>
                        {post.category && (
                            <>
                                <span className="mx-1">/</span>
                                <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="hover:text-orange-600">
                                    {post.category}
                                </Link>
                            </>
                        )}
                    </nav>

                    <header className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-4">
                            {post.author && <span>By {post.author}</span>}
                            <span>•</span>
                            <time dateTime={post.publishedAt || undefined}>{formatDate(post.publishedAt)}</time>
                            {post.readingTime > 0 && (
                                <>
                                    <span>•</span>
                                    <span>{post.readingTime} min read</span>
                                </>
                            )}
                        </div>
                    </header>

                    {post.featuredImage && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
                            <Image
                                src={post.featuredImage}
                                alt={post.featuredImageAlt || post.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 768px"
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-lg max-w-none prose-headings:font-semibold prose-a:text-orange-600 prose-img:rounded-lg"
                        dangerouslySetInnerHTML={{ __html: cleanHtml }}
                    />

                    {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
                            {post.tags.map((t) => (
                                <Link
                                    key={t}
                                    href={`/blog?tag=${encodeURIComponent(t)}`}
                                    className="text-xs bg-gray-100 hover:bg-orange-100 text-gray-600 px-3 py-1 rounded-full"
                                >
                                    #{t}
                                </Link>
                            ))}
                        </div>
                    )}
                </article>

                {related.length > 0 && (
                    <section className="max-w-5xl mx-auto mt-16">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Related posts</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map((p) => (
                                <BlogCard key={p._id} post={p} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
};

export default BlogPostPage;
