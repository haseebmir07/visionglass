'use client';

import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';

// Creatable, multi-select tag input with suggestions.
const TagInput = ({ value = [], onChange, suggestions = [], placeholder = 'Add a tag and press Enter' }) => {
    const [input, setInput] = useState('');
    const [focused, setFocused] = useState(false);

    const addTag = (raw) => {
        const tag = String(raw).trim();
        if (!tag) return;
        if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) {
            setInput('');
            return;
        }
        onChange([...value, tag]);
        setInput('');
    };

    const removeTag = (tag) => onChange(value.filter((t) => t !== tag));

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && !input && value.length) {
            removeTag(value[value.length - 1]);
        }
    };

    const filtered = useMemo(() => {
        const lower = input.toLowerCase();
        return suggestions
            .filter((s) => !value.some((t) => t.toLowerCase() === s.toLowerCase()))
            .filter((s) => (lower ? s.toLowerCase().includes(lower) : true))
            .slice(0, 8);
    }, [suggestions, value, input]);

    return (
        <div className="relative">
            <div className="flex flex-wrap items-center gap-2 border rounded p-2">
                {value.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 bg-orange-100 text-orange-700 text-sm px-2 py-0.5 rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-orange-900">
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 150)}
                    placeholder={value.length ? '' : placeholder}
                    className="flex-1 min-w-[120px] outline-none text-sm py-1"
                />
            </div>

            {focused && filtered.length > 0 && (
                <div className="absolute z-20 mt-1 w-full max-h-48 overflow-auto bg-white border rounded shadow-lg">
                    {filtered.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => addTag(s)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TagInput;
