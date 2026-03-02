'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";

const AddressSelector = ({ onSelect }) => {

  const { getToken, router } = useAppContext();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(
        "/api/user/get-address",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) setAddresses(data.addresses);

    } catch (err) {
      toast.error(err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading) return <p>Loading addresses...</p>;

  return (

    <div className="border rounded p-4 space-y-4">

      <h3 className="font-semibold text-lg">
        Select Shipping Address
      </h3>

      {addresses.length === 0 && (

        <p className="text-gray-500">
          No saved address found.
        </p>

      )}

      {addresses.map(addr => (

        <div
          key={addr._id}
          onClick={() => onSelect(addr)}
          className="border rounded p-3 cursor-pointer hover:border-orange-500"
        >
          <p>{addr.fullName}</p>
          <p>{addr.area}</p>
          <p>{addr.city}, {addr.state}</p>
          <p>{addr.pincode}</p>
          <p>{addr.phoneNumber}</p>
        </div>

      ))}

      <button
        onClick={() => router.push("/add-address")}
        className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
      >
        + Add New Address
      </button>

    </div>
  );
};

export default AddressSelector;
