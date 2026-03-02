'use client';

import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddAddress = () => {

  const { getToken } = useAppContext();

  const [address, setAddress] = useState({
    fullName: '',
    phoneNumber: '',
    pincode: '',
    area: '',
    city: '',
    state: '',
  });

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {

      const token = await getToken();

      // 🔥 CHECK LOGIN
      if (!token) {
        setShowLoginPopup(true);
        return;
      }

      const { data } = await axios.post(
        '/api/user/add-address',
        { address },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />

      <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">

        <form onSubmit={onSubmitHandler} className="w-full">

          <p className="text-2xl md:text-3xl text-gray-500">
            Add Shipping <span className="font-semibold text-orange-600">Address</span>
          </p>

          <div className="space-y-3 max-w-sm mt-10">

            <input
              name="fullName"
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Full name"
              onChange={handleChange}
              value={address.fullName}
              required
            />

            <input
              name="phoneNumber"
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Phone number"
              onChange={handleChange}
              value={address.phoneNumber}
              required
            />

            <input
              name="pincode"
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Pin code"
              onChange={handleChange}
              value={address.pincode}
              required
            />

            <textarea
              name="area"
              className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
              rows={4}
              placeholder="Address (Area and Street)"
              onChange={handleChange}
              value={address.area}
              required
            ></textarea>

            <div className="flex space-x-3">

              <input
                name="city"
                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                type="text"
                placeholder="City/District/Town"
                onChange={handleChange}
                value={address.city}
                required
              />

              <input
                name="state"
                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                type="text"
                placeholder="State"
                onChange={handleChange}
                value={address.state}
                required
              />

            </div>

          </div>

          <button
            type="submit"
            className="max-w-sm w-full mt-6 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase"
          >
            Save address
          </button>

        </form>

        <Image
          className="md:mr-16 mt-16 md:mt-0"
          src={assets.my_location_image}
          alt="Location"
          width={400}
          height={400}
        />

      </div>

      {/* 🔥 LOGIN POPUP MODAL */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center animate-fadeIn">
            <h3 className="text-lg font-semibold mb-2">
              Login Required
            </h3>

            <p className="text-gray-600 text-sm mb-4">
              Please login to continue.
            </p>

            <button
              onClick={() => setShowLoginPopup(false)}
              className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AddAddress;
