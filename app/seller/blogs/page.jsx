'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '@/context/AppContext';
import Loading from '@/components/Loading';
import Footer from '@/components/seller/Footer';
import { Pencil, Trash2, Eye, Plus, Loader2, Globe, FileEdit } from 'lucide-react';

const BlogsList = () => {
    const { getToken, user } = useAppContext();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);

    const fetchBlogs = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/blog/list', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) setBlogs(data.blogs);
            else toast.error(data.message);
        } catch (err) {
            toast.error(err.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user) fetchBlogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const togglePublish = async (blog) => {
        setBusyId(blog._id);
        try {
            const token = await getToken();
            const { data } = await axios.post(
                '/api/blog/publish',
                { id: blog._id, status: blog.status === 'published' ? 'draft' : 'published' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success(data.message);
                fetchBlogs();
            } else toast.error(data.message);
        } catch (err) {
            toast.error(err.message);
        }
        setBusyId(null);
    };

    const deleteBlog = async (id) => {
        if (!window.confirm('Delete this blog permanently?')) return;
        setBusyId(id);
        try {
            const token = await getToken();
            const { data } = await axios.delete('/api/blog/delete', {
                data: { id },
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                toast.success('Deleted');
                setBlogs((prev) => prev.filter((b) => b._id !== id));
            } else toast.error(data.message);
        } catch (err) {
            toast.error(err.message);
        }
        setBusyId(null);
    };

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between">
            {loading ? (
                <Loading />
            ) : (
                <div className="md:p-8 p-4">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-semibold">Blogs</h1>
                        <Link
                            href="/seller/blogs/new"
                            className="flex items-center gap-2 px-4 py-2 rounded bg-orange-600 text-white text-sm hover:bg-orange-700"
                        >
                            <Plus size={16} /> New Blog
                        </Link>
                    </div>

                    {blogs.length === 0 ? (
                        <div className="text-center text-gray-500 border rounded py-16">
                            No blogs yet. Create your first post.
                        </div>
                    ) : (
                        <div className="overflow-x-auto border rounded">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-left text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Title</th>
                                        <th className="px-4 py-3 font-medium">Slug</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Category</th>
                                        <th className="px-4 py-3 font-medium">Published</th>
                                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {blogs.map((blog) => {
                                        const scheduled =
                                            blog.status === 'published' &&
                                            blog.publishedAt &&
                                            new Date(blog.publishedAt) > new Date();
                                        return (
                                            <tr key={blog._id} className="hover:bg-gray-50/60">
                                                <td className="px-4 py-3 max-w-[220px]">
                                                    <span className="font-medium text-gray-800 line-clamp-1">{blog.title}</span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">/{blog.slug}</td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${blog.status === 'published'
                                                            ? scheduled
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                            }`}
                                                    >
                                                        {blog.status === 'published' ? (scheduled ? 'Scheduled' : 'Published') : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{blog.category || '—'}</td>
                                                <td className="px-4 py-3 text-gray-600">{formatDate(blog.publishedAt)}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                                                            onClick={() => togglePublish(blog)}
                                                            disabled={busyId === blog._id}
                                                            className="p-2 rounded hover:bg-gray-100 text-gray-600"
                                                        >
                                                            {busyId === blog._id ? (
                                                                <Loader2 size={16} className="animate-spin" />
                                                            ) : blog.status === 'published' ? (
                                                                <FileEdit size={16} />
                                                            ) : (
                                                                <Globe size={16} />
                                                            )}
                                                        </button>
                                                        <a
                                                            title="Preview"
                                                            href={`/blog/${blog.slug}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-2 rounded hover:bg-gray-100 text-gray-600"
                                                        >
                                                            <Eye size={16} />
                                                        </a>
                                                        <Link
                                                            title="Edit"
                                                            href={`/seller/blogs/${blog._id}/edit`}
                                                            className="p-2 rounded hover:bg-gray-100 text-blue-600"
                                                        >
                                                            <Pencil size={16} />
                                                        </Link>
                                                        <button
                                                            title="Delete"
                                                            onClick={() => deleteBlog(blog._id)}
                                                            disabled={busyId === blog._id}
                                                            className="p-2 rounded hover:bg-gray-100 text-red-600"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
            <Footer />
        </div>
    );
};

export default BlogsList;
