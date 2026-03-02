'use client';

import React, { useEffect, useState } from "react";

export default function WhatsAppSticky() {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const phone = "+918880605191";

  return (

    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "390px",
        right: "0px",
        zIndex: 999999999,
        pointerEvents: "auto",
      }}
    >

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>

        {/* label */}
        <span style={{
          background: "#119727",
          color: "#fff",
          fontSize: "12px",
          padding: "4px 8px",
          borderRadius: "6px",
          marginBottom: "6px"
        }}>
          Contact Us Directly
        </span>

        {/* icon */}
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
        }}>
          <img
            src="/whatsapp.webp"
            alt="WhatsApp"
            style={{ width: "28px" }}
          />
        </div>

      </div>

    </a>

  );
}
