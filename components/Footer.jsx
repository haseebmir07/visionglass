import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div id="bottom">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
          Vision Glass & Interiors stands at the forefront of the glass manufacturing and interior design industry, delivering exceptional craftsmanship and innovative solutions for residential, commercial, and industrial environments.
          </p>
          <p className="mt-6 text-sm"> Driven by cutting-edge technology and a passion for precision, we offer an extensive portfolio of premium glass products — including toughened, laminated, decorative, and bespoke glass solutions designed to elevate modern spaces.</p>
          <p className="mt-6 text-sm">
         Our interior solutions merge durability with contemporary elegance, enhancing natural light, openness, and architectural sophistication. Every project reflects our unwavering commitment to quality, innovation, and detail.

At Vision Glass & Interiors, we do more than install glass — we transform environments. Experience refined craftsmanship, dependable quality, and tailored solutions that bring your vision to life.
        </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="/">Home</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">About us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Contact us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-4">Get in touch</h2>
               <div className="flex items-center gap-2 mb-3">
                    <a href="#">
                      <Image src={assets.facebook_icon} alt="facebook_icon" />
                    </a>
                    {/* <a href="#">
                      <Image src={assets.twitter_icon} alt="twitter_icon" />
                    </a> */}
                    <a href="https://www.instagram.com/visionglassinteriors?igsh=MTYyOHQ5Nnp4MDRuZw==">
                      <Image src={assets.instagram_icon} alt="instagram_icon" />
                    </a>
                  </div>
            <div className="text-sm space-y-2">
              <p>+91-8880605191</p>
              {/* <p>+91-9419063702</p> */}
              <p> bookings.visionglassinteriors@gmail.com</p>
              <p>Jp Nagar 9th Phase, Bengaluru, Karnataka 560078
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © Developed And Designed By Mohammad Haseeb Mir All Right Reserved.
      </p> */}
      <p className="py-4 text-center text-xs md:text-sm">
        <strong>© Vision Glass & Interiors , All Right Reserved .</strong> Developed And Designed By Mohammad Haseeb Mir.
      </p>
      
      </div>
    </footer>
  );
};

export default Footer;