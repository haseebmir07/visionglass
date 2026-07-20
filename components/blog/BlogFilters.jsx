'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

// Client-side filter/search bar. It only manipulates the URL query string;
// the actual filtering happens server-side so pages stay crawlable.
const BlogFilters = ({ categories = [], tags = [], active = {} }) => {
    const router = useRouter();
    const [search, setSearch] = useState(active.search || '');

    const buildUrl = (params) => {
        const sp = new URLSearchParams();
        const merged = { category: active.category, tag: active.tag, search: active.search, ...params };
        Object.entries(merged).forEach(([k, v]) => {
            if (v) sp.set(k, v);
        });
        const qs = sp.toString();
        return `/blog${qs ? `?${qs}` : ''}`;
    };

    const submitSearch = (e) => {
        e.preventDefault();
        router.push(buildUrl({ search, page: null }));
    };

    return (
        <div className="mb-8 space-y-4">
            <form onSubmit={submitSearch} className="flex items-center gap-2 max-w-md">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search articles..."
                        className="w-full border rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                    />
                </div>
                <button type="submit" className="px-4 py-2 rounded-full bg-orange-600 text-white text-sm hover:bg-orange-700">
                    Search
                </button>
            </form>

            {(categories.length > 0 || tags.length > 0) && (
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => router.push('/blog')}
                        className={`px-3 py-1 rounded-full text-sm border ${!active.category && !active.tag && !active.search
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        All
                    </button>
                    {categories.map((c) => (
                        <button
                            key={c}
                            onClick={() => router.push(buildUrl({ category: c, tag: null, search: null, page: null }))}
                            className={`px-3 py-1 rounded-full text-sm border ${active.category === c
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogFilters;
