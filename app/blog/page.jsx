import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/blog/BlogCard';
import BlogFilters from '@/components/blog/BlogFilters';
import { getPublishedPosts, getCategoriesAndTags } from '@/lib/blogQueries';
import { SITE_NAME, BLOG_DESCRIPTION, absoluteUrl } from '@/lib/siteConfig';

export const revalidate = 60;

const PAGE_SIZE = 9;

export async function generateMetadata({ searchParams }) {
    const sp = await searchParams;
    const category = sp?.category || '';
    const title = category ? `${category} · Blog | ${SITE_NAME}` : `Blog | ${SITE_NAME}`;
    const canonical = category
        ? absoluteUrl(`/blog?category=${encodeURIComponent(category)}`)
        : absoluteUrl('/blog');

    return {
        title,
        description: BLOG_DESCRIPTION,
        alternates: { canonical },
        openGraph: {
            title,
            description: BLOG_DESCRIPTION,
            url: canonical,
            siteName: SITE_NAME,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: BLOG_DESCRIPTION,
        },
    };
}

const BlogListPage = async ({ searchParams }) => {
    const sp = (await searchParams) || {};
    const page = Math.max(1, parseInt(sp.page || '1', 10) || 1);
    const category = sp.category || '';
    const tag = sp.tag || '';
    const search = sp.search || '';

    const [{ posts, total, totalPages }, { categories, tags }] = await Promise.all([
        getPublishedPosts({ page, limit: PAGE_SIZE, category, tag, search }),
        getCategoriesAndTags(),
    ]);

    const buildPageUrl = (p) => {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (tag) params.set('tag', tag);
        if (search) params.set('search', search);
        if (p > 1) params.set('page', String(p));
        const qs = params.toString();
        return `/blog${qs ? `?${qs}` : ''}`;
    };

    return (
        <>
            <Navbar />
            <main className="px-6 md:px-16 lg:px-32 py-10 min-h-screen">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">Blog</h1>
                    <p className="text-gray-500 mt-2 max-w-2xl">{BLOG_DESCRIPTION}</p>
                </header>

                <BlogFilters
                    categories={categories}
                    tags={tags}
                    active={{ category, tag, search }}
                />

                {(category || tag || search) && (
                    <p className="text-sm text-gray-500 mb-6">
                        {total} result{total === 1 ? '' : 's'}
                        {category && <> in <span className="font-medium">{category}</span></>}
                        {tag && <> tagged <span className="font-medium">{tag}</span></>}
                        {search && <> for <span className="font-medium">“{search}”</span></>}
                    </p>
                )}

                {posts.length === 0 ? (
                    <div className="text-center text-gray-500 border rounded py-20">
                        No posts found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, i) => (
                            <BlogCard key={post._id} post={post} priority={i < 3} />
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
                        {page > 1 && (
                            <Link href={buildPageUrl(page - 1)} className="px-3 py-1.5 rounded border text-sm hover:bg-gray-100">
                                ← Prev
                            </Link>
                        )}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Link
                                key={p}
                                href={buildPageUrl(p)}
                                className={`px-3 py-1.5 rounded border text-sm ${p === page ? 'bg-orange-600 text-white border-orange-600' : 'hover:bg-gray-100'}`}
                            >
                                {p}
                            </Link>
                        ))}
                        {page < totalPages && (
                            <Link href={buildPageUrl(page + 1)} className="px-3 py-1.5 rounded border text-sm hover:bg-gray-100">
                                Next →
                            </Link>
                        )}
                    </nav>
                )}
            </main>
            <Footer />
        </>
    );
};

export default BlogListPage;
