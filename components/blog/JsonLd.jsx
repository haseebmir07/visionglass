import React from 'react';

// Renders a JSON-LD <script>. Safe: content is JSON.stringify of trusted data.
const JsonLd = ({ data }) => (
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
);

export default JsonLd;
