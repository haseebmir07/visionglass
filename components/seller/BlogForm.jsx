'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '@/context/AppContext';
import { slugify } from '@/lib/slugify';
import { SITE_URL } from '@/lib/siteConfig';
import TiptapEditor from '@/components/seller/TiptapEditor';
import TagInput from '@/components/seller/TagInput';
import { Loader2, Save, Send, UploadCloud, Eye } from 'lucide-react';

const emptySeo = {
    metaTitle: '', metaDescription: '', canonicalUrl: '',
    ogTitle: '', ogDescription: '', ogImage: '', focusKeyword: '',
};

const CharCounter = ({ value, ideal }) => {
    const len = (value || '').length;
    const over = len > ideal;
    return (
        <span className={`text-xs ${over ? 'text-red-500' : 'text-gray-400'}`}>
            {len}/{ideal}
        </span>
    );
};

const BlogForm = ({ initial = null, mode = 'create' }) => {
    const { getToken, user, router } = useAppContext();

    const [title, setTitle] = useState(initial?.title || '');
    const [slug, setSlug] = useState(initial?.slug || '');
    const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));
    const [content, setContent] = useState(initial?.content || '');
    const [excerpt, setExcerpt] = useState(initial?.excerpt || '');

    const [featuredImage, setFeaturedImage] = useState(initial?.featuredImage || '');
    const [featuredImageAlt, setFeaturedImageAlt] = useState(initial?.featuredImageAlt || '');
    const [uploadingImage, setUploadingImage] = useState(false);

    const [category, setCategory] = useState(initial?.category || '');
    const [tags, setTags] = useState(initial?.tags || []);
    const [author, setAuthor] = useState(initial?.author || '');
    const [scheduledAt, setScheduledAt] = useState(
        initial?.scheduledAt ? toLocalInput(initial.scheduledAt) : ''
    );

    const [seo, setSeo] = useState({ ...emptySeo, ...(initial?.seo || {}) });

    const [catSuggestions, setCatSuggestions] = useState([]);
    const [tagSuggestions, setTagSuggestions] = useState([]);
    const [saving, setSaving] = useState(false);

    // Default author to the logged-in admin for new posts.
    useEffect(() => {
        if (!author && user) {
            setAuthor(user.fullName || user.firstName || user.username || 'Admin');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Auto-generate slug from title until the admin edits it manually.
    useEffect(() => {
        if (!slugEdited) setSlug(slugify(title));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title]);

    // Load category/tag suggestions.
    useEffect(() => {
        (async () => {
            try {
                const token = await getToken();
                const { data } = await axios.get('/api/blog/taxonomy', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (data.success) {
                    setCatSuggestions(data.categories || []);
                    setTagSuggestions(data.tags || []);
                }
            } catch {
                /* non-fatal */
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const canonicalPreview = useMemo(
        () => (slug ? `${SITE_URL}/blog/${slug}` : ''),
        [slug]
    );

    const setSeoField = (field, val) => setSeo((s) => ({ ...s, [field]: val }));

    const handleFeaturedUpload = async (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) return toast.error('Please choose an image file');
        setUploadingImage(true);
        try {
            const token = await getToken();
            const formData = new FormData();
            formData.append('image', file);
            const { data } = await axios.post('/api/blog/upload', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                setFeaturedImage(data.url);
                toast.success('Image uploaded');
            } else {
                toast.error(data.message || 'Upload failed');
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const validate = (status) => {
        if (!title.trim()) {
            toast.error('Title is required');
            return false;
        }
        if (featuredImage && !featuredImageAlt.trim()) {
            toast.error('Alt text is required for the featured image (SEO)');
            return false;
        }
        if (status === 'published' && !content.replace(/<[^>]*>/g, '').trim()) {
            toast.error('Add some content before publishing');
            return false;
        }
        return true;
    };

    const submit = async (status) => {
        if (!validate(status)) return;
        setSaving(true);
        try {
            const token = await getToken();
            const payload = {
                title: title.trim(),
                slug: slug.trim(),
                content,
                excerpt: excerpt.trim(),
                featuredImage,
                featuredImageAlt: featuredImageAlt.trim(),
                category: category.trim(),
                tags,
                author: author.trim(),
                status,
                scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
                seo,
            };

            let data;
            if (mode === 'edit' && initial?._id) {
                ({ data } = await axios.put(
                    '/api/blog/update',
                    { id: initial._id, ...payload },
                    { headers: { Authorization: `Bearer ${token}` } }
                ));
            } else {
                ({ data } = await axios.post('/api/blog/add', payload, {
                    headers: { Authorization: `Bearer ${token}` },
                }));
            }

            if (data.success) {
                toast.success(data.message || 'Saved');
                router.push('/seller/blogs');
            } else {
                toast.error(data.message || 'Something went wrong');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setSaving(false);
        }
    };

    const inputCls = 'w-full border p-2.5 rounded text-sm';
    const labelCls = 'text-sm font-medium text-gray-700 mb-1 flex items-center justify-between';

    return (
        <div className="flex-1 min-h-screen">
            <div className="md:p-8 p-4 max-w-5xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold">
                        {mode === 'edit' ? 'Edit Blog' : 'New Blog'}
                    </h1>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => submit('draft')}
                            className="flex items-center gap-2 px-4 py-2 rounded border text-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Draft
                        </button>
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => submit('published')}
                            className="flex items-center gap-2 px-4 py-2 rounded bg-orange-600 text-white text-sm hover:bg-orange-700 disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            {scheduledAt && new Date(scheduledAt) > new Date() ? 'Schedule' : 'Publish'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* MAIN COLUMN */}
                    <div className="lg:col-span-2 space-y-5">
                        <div>
                            <label className={labelCls}>Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Post title"
                                className={inputCls}
                            />
                        </div>

                        <div>
                            <label className={labelCls}>
                                <span>Slug (URL)</span>
                                <span className="text-xs text-gray-400 font-normal">/blog/{slug || '...'}</span>
                            </label>
                            <input
                                value={slug}
                                onChange={(e) => { setSlug(slugify(e.target.value)); setSlugEdited(true); }}
                                placeholder="post-url-slug"
                                className={inputCls}
                            />
                        </div>

                        <div>
                            <label className={labelCls}>Content</label>
                            <TiptapEditor value={content} onChange={setContent} getToken={getToken} />
                        </div>

                        <div>
                            <label className={labelCls}>
                                <span>Excerpt / Summary</span>
                                <CharCounter value={excerpt} ideal={160} />
                            </label>
                            <textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                rows={3}
                                placeholder="Short summary used in previews and as a meta description fallback"
                                className={inputCls}
                            />
                        </div>

                        {/* SEO SECTION */}
                        <div className="border rounded p-4 space-y-4 bg-gray-50/60">
                            <h2 className="font-semibold text-gray-800">SEO</h2>

                            <div>
                                <label className={labelCls}>
                                    <span>Meta title</span>
                                    <CharCounter value={seo.metaTitle} ideal={60} />
                                </label>
                                <input value={seo.metaTitle} onChange={(e) => setSeoField('metaTitle', e.target.value)} placeholder="Defaults to the post title" className={inputCls} />
                            </div>

                            <div>
                                <label className={labelCls}>
                                    <span>Meta description</span>
                                    <CharCounter value={seo.metaDescription} ideal={160} />
                                </label>
                                <textarea value={seo.metaDescription} onChange={(e) => setSeoField('metaDescription', e.target.value)} rows={2} placeholder="Defaults to the excerpt" className={inputCls} />
                            </div>

                            <div>
                                <label className={labelCls}>Canonical URL</label>
                                <input value={seo.canonicalUrl} onChange={(e) => setSeoField('canonicalUrl', e.target.value)} placeholder={canonicalPreview} className={inputCls} />
                                <p className="text-xs text-gray-400 mt-1">Auto-filled to {canonicalPreview || 'the post URL'} if left blank.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Open Graph title</label>
                                    <input value={seo.ogTitle} onChange={(e) => setSeoField('ogTitle', e.target.value)} placeholder="Defaults to meta title" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Focus keyword</label>
                                    <input value={seo.focusKeyword} onChange={(e) => setSeoField('focusKeyword', e.target.value)} placeholder="Optional, for your reference" className={inputCls} />
                                </div>
                            </div>

                            <div>
                                <label className={labelCls}>Open Graph description</label>
                                <textarea value={seo.ogDescription} onChange={(e) => setSeoField('ogDescription', e.target.value)} rows={2} placeholder="Defaults to meta description" className={inputCls} />
                            </div>

                            <div>
                                <label className={labelCls}>Open Graph image URL</label>
                                <input value={seo.ogImage} onChange={(e) => setSeoField('ogImage', e.target.value)} placeholder="Defaults to the featured image" className={inputCls} />
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR COLUMN */}
                    <div className="space-y-5">
                        <div className="border rounded p-4 space-y-3">
                            <h2 className="font-semibold text-gray-800">Publish</h2>
                            <div>
                                <label className={labelCls}>Scheduled publish (optional)</label>
                                <input
                                    type="datetime-local"
                                    value={scheduledAt}
                                    onChange={(e) => setScheduledAt(e.target.value)}
                                    className={inputCls}
                                />
                                <p className="text-xs text-gray-400 mt-1">If set to a future time, the post stays hidden publicly until then.</p>
                            </div>
                            {mode === 'edit' && initial?.slug && (
                                <a
                                    href={`/blog/${initial.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-sm text-orange-600 hover:underline"
                                >
                                    <Eye size={14} /> Preview post
                                </a>
                            )}
                        </div>

                        <div className="border rounded p-4 space-y-3">
                            <h2 className="font-semibold text-gray-800">Featured image</h2>
                            <label className="block cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => handleFeaturedUpload(e.target.files?.[0])}
                                />
                                {featuredImage ? (
                                    <div className="relative w-full aspect-video rounded overflow-hidden border">
                                        <Image src={featuredImage} alt={featuredImageAlt || 'featured'} fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded py-8 text-gray-400 hover:border-orange-400">
                                        {uploadingImage ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                                        <span className="text-sm">{uploadingImage ? 'Uploading...' : 'Upload image'}</span>
                                    </div>
                                )}
                            </label>
                            {featuredImage && (
                                <button type="button" onClick={() => setFeaturedImage('')} className="text-xs text-red-500 hover:underline">
                                    Remove image
                                </button>
                            )}
                            <div>
                                <label className={labelCls}>Alt text (required)</label>
                                <input
                                    value={featuredImageAlt}
                                    onChange={(e) => setFeaturedImageAlt(e.target.value)}
                                    placeholder="Describe the image"
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        <div className="border rounded p-4 space-y-3">
                            <h2 className="font-semibold text-gray-800">Organize</h2>
                            <div>
                                <label className={labelCls}>Category</label>
                                <input
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    list="blog-category-suggestions"
                                    placeholder="e.g. Design Tips"
                                    className={inputCls}
                                />
                                <datalist id="blog-category-suggestions">
                                    {catSuggestions.map((c) => <option key={c} value={c} />)}
                                </datalist>
                            </div>
                            <div>
                                <label className={labelCls}>Tags</label>
                                <TagInput value={tags} onChange={setTags} suggestions={tagSuggestions} />
                            </div>
                            <div>
                                <label className={labelCls}>Author</label>
                                <input value={author} onChange={(e) => setAuthor(e.target.value)} className={inputCls} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Convert an ISO string to a value usable by <input type="datetime-local">.
function toLocalInput(iso) {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default BlogForm;
