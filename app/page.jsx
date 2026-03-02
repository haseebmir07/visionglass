'use client'
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import GoogleReviews from "@/components/GoogleReviews";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientsStrip from "@/components/ClientsStrip";

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <ClientsStrip />
        <HomeProducts />
        <FeaturedProduct />
        <GoogleReviews />
      </div>

      <Footer />
    </>
  );
};

export default Home;
