import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import WhatsAppSticky from "@/components/WhatsAppSticky";
import Script from "next/script"; // ✅ ADD THIS

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: "Vision Glass & Interiors",
  description: "The Art of Interiors",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${outfit.className} antialiased text-gray-700`}
        >
          <Toaster />

          <AppContextProvider>
            {children}

            {/* ⭐ GLOBAL floating WhatsApp */}
            <WhatsAppSticky />
          </AppContextProvider>

          {/* ✅ Tawk.to Chatbot Script */}
          <Script id="tawk-chat" strategy="afterInteractive">
            {`
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),
                    s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/698f2be785e35c1c3911e6f4/1jhbk70d0';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `}
          </Script>

        </body>
      </html>
    </ClerkProvider>
  );
}
