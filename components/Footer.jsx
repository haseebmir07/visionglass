import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div id="bottom">

        <div className="flex flex-col lg:flex-row items-start justify-between px-6 md:px-16 lg:px-32 gap-12 py-16 border-b border-gray-300 text-gray-600">

          {/* Company Info */}
          <div className="lg:w-1/3">
            <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
            <p className="mt-6 text-sm leading-relaxed">
              Vision Glass & Interiors stands at the forefront of the glass manufacturing and interior design industry, delivering exceptional craftsmanship and innovative solutions.
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              We transform spaces through premium glass solutions and modern interior excellence.
            </p>
          </div>

          {/* Company Links */}
          <div className="lg:w-1/6">
            <h2 className="font-semibold text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-3">
              <li><a className="hover:text-orange-600 transition" href="/">Home</a></li>
              <li><a className="hover:text-orange-600 transition" href="#">About us</a></li>
              <li><a className="hover:text-orange-600 transition" href="#">Contact us</a></li>
              <li><a className="hover:text-orange-600 transition" href="#">Privacy policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:w-1/4">
            <h2 className="font-semibold text-gray-900 mb-5">Get in Touch</h2>

            <div className="flex items-center gap-3 mb-4">
              <a href="#">
                <Image src={assets.facebook_icon} alt="facebook_icon" />
              </a>
              <a href="https://www.instagram.com/visionglassinteriors">
                <Image src={assets.instagram_icon} alt="instagram_icon" />
              </a>
              <a href="#">
                <Image src={assets.twitter_icon} alt="twitter_icon" />
              </a>
            </div>

            <div className="text-sm space-y-2">
              <p>+91-8880605191</p>
              <p>bookings.visionglassinteriors@gmail.com</p>
              <p>JP Nagar 9th Phase, Bengaluru, Karnataka 560078</p>
            </div>
          </div>

          {/* Google Map Section */}
          <div className="lg:w-1/3 w-full">
            <h2 className="font-semibold text-gray-900 mb-5">
              Our Location
            </h2>

            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.511230397605!2d77.56026877592141!3d12.874814587431647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15709fb0ec17%3A0x2c477abb645e088e!2sVision%20Glass%20%26%20Interiors!5e0!3m2!1sen!2sin!4v1772480532748!5m2!1sen!2sin" 
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <p className="py-5 text-center text-xs md:text-sm text-gray-500">
          <strong>© Vision Glass & Interiors. All Rights Reserved.</strong>
          {" "}Developed and Designed by Mohammad Haseeb Mir.
        </p>

      </div>
    </footer>
  );
};

export default Footer;