'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Bold, Italic, Strikethrough, List, ListOrdered, Quote,
    Heading2, Heading3, Link2, Link2Off, ImagePlus, Undo2, Redo2, FileText,
} from 'lucide-react';

const ToolbarBtn = ({ onClick, active, disabled, title, children }) => (
    <button
        type="button"
        title={title}
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded hover:bg-gray-100 disabled:opacity-40 ${active ? 'bg-orange-100 text-orange-600' : 'text-gray-600'}`}
    >
        {children}
    </button>
);

const TiptapEditor = ({ value, onChange, getToken }) => {
    const [posts, setPosts] = useState([]);
    const [showInternal, setShowInternal] = useState(false);
    const fileInputRef = useRef(null);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                HTMLAttributes: { rel: 'noopener noreferrer' },
            }),
            Image.configure({ HTMLAttributes: { loading: 'lazy' } }),
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose max-w-none min-h-[300px] focus:outline-none px-4 py-3',
            },
        },
        onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    });

    // Keep the editor in sync when the parent loads content asynchronously (edit page).
    useEffect(() => {
        if (editor && value !== undefined && value !== editor.getHTML()) {
            editor.commands.setContent(value || '', false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor, value]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const prev = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL', prev || 'https://');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const openInternalPicker = useCallback(async () => {
        try {
            const token = await getToken?.();
            const { data } = await axios.get('/api/blog/links', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (data.success) {
                setPosts(data.posts || []);
                setShowInternal(true);
            } else {
                toast.error(data.message || 'Could not load posts');
            }
        } catch (err) {
            toast.error(err.message);
        }
    }, [getToken]);

    const insertInternalLink = (post) => {
        if (!editor) return;
        const href = `/blog/${post.slug}`;
        const { from, to } = editor.state.selection;
        if (from === to) {
            editor
                .chain()
                .focus()
                .insertContent(`<a href="${href}">${post.title}</a>`)
                .run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
        }
        setShowInternal(false);
    };

    const uploadImage = async (file) => {
        if (!file) return;
        try {
            const token = await getToken?.();
            const formData = new FormData();
            formData.append('image', file);
            const { data } = await axios.post('/api/blog/upload', formData, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (data.success) {
                const alt = window.prompt('Image alt text (for SEO/accessibility)', '') || '';
                editor.chain().focus().setImage({ src: data.url, alt }).run();
            } else {
                toast.error(data.message || 'Upload failed');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (!editor) {
        return <div className="border rounded min-h-[340px] bg-gray-50" />;
    }

    return (
        <div className="border rounded">
            <div className="flex flex-wrap items-center gap-1 border-b p-1 bg-gray-50 relative">
                <ToolbarBtn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></ToolbarBtn>
                <ToolbarBtn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></ToolbarBtn>
                <ToolbarBtn title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={16} /></ToolbarBtn>
                <span className="w-px h-5 bg-gray-300 mx-1" />
                <ToolbarBtn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></ToolbarBtn>
                <ToolbarBtn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></ToolbarBtn>
                <ToolbarBtn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></ToolbarBtn>
                <ToolbarBtn title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></ToolbarBtn>
                <ToolbarBtn title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={16} /></ToolbarBtn>
                <span className="w-px h-5 bg-gray-300 mx-1" />
                <ToolbarBtn title="Add link" active={editor.isActive('link')} onClick={setLink}><Link2 size={16} /></ToolbarBtn>
                <ToolbarBtn title="Remove link" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()}><Link2Off size={16} /></ToolbarBtn>
                <ToolbarBtn title="Link to another blog post" onClick={openInternalPicker}><FileText size={16} /></ToolbarBtn>
                <ToolbarBtn title="Insert image" onClick={() => fileInputRef.current?.click()}><ImagePlus size={16} /></ToolbarBtn>
                <span className="w-px h-5 bg-gray-300 mx-1" />
                <ToolbarBtn title="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 size={16} /></ToolbarBtn>
                <ToolbarBtn title="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 size={16} /></ToolbarBtn>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                        uploadImage(e.target.files?.[0]);
                        e.target.value = '';
                    }}
                />

                {showInternal && (
                    <div className="absolute top-full left-0 z-20 mt-1 w-72 max-h-72 overflow-auto bg-white border rounded shadow-lg">
                        <div className="flex items-center justify-between px-3 py-2 border-b text-sm font-medium">
                            <span>Link to a post</span>
                            <button type="button" onClick={() => setShowInternal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
                        </div>
                        {posts.length === 0 ? (
                            <p className="px-3 py-3 text-sm text-gray-500">No posts yet.</p>
                        ) : (
                            posts.map((p) => (
                                <button
                                    key={p.slug}
                                    type="button"
                                    onClick={() => insertInternalLink(p)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 flex items-center justify-between gap-2"
                                >
                                    <span className="truncate">{p.title}</span>
                                    {p.status !== 'published' && (
                                        <span className="text-[10px] text-gray-400 shrink-0">draft</span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapEditor;
