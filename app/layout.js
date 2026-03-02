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

       



        
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/69a5d666b0555e1c3f0bacc3/1jinsr0l7';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>


        </body>
      </html>
    </ClerkProvider>
  );
}
