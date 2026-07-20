'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '@/context/AppContext';
import Loading from '@/components/Loading';
import BlogForm from '@/components/seller/BlogForm';

const EditBlogPage = () => {
    const { id } = useParams();
    const { getToken, user } = useAppContext();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                const token = await getToken();
                const { data } = await axios.get(`/api/blog/single?id=${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (data.success) setBlog(data.blog);
                else toast.error(data.message);
            } catch (err) {
                toast.error(err.message);
            }
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, id]);

    if (loading) return <Loading />;
    if (!blog) return <div className="p-8 text-gray-500">Blog not found.</div>;

    return <BlogForm mode="edit" initial={blog} />;
};

export default EditBlogPage;
