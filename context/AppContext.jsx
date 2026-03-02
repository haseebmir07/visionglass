'use client';

import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();
    const { user } = useUser();
    const { getToken } = useAuth();

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(false);
    const [isSeller, setIsSeller] = useState(false);

    // NEW STRUCTURE:
    // {
    //   productId: {
    //      size: quantity
    //   }
    // }
    const [cartItems, setCartItems] = useState({});

    // ================= FETCH PRODUCTS =================
    const fetchProductData = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // ================= FETCH USER =================
    const fetchUserData = async () => {
        try {

            if (user?.publicMetadata?.role === "seller") {
                setIsSeller(true);
            }

            const token = await getToken();

            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {

                let cart = data.user.cartItems || {};

                // 🔥 AUTO-CONVERT OLD CART FORMAT
                for (const item in cart) {

                    // Old format: { productId: quantity }
                    if (typeof cart[item] === "number") {

                        cart[item] = {
                            "Default Size": cart[item]
                        };

                    }
                }

                setUserData(data.user);
                setCartItems(cart);

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    // ================= ADD TO CART =================
    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error("Please select a size");
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {

            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }

        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);

        if (user) {
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    // ================= UPDATE QUANTITY =================
    const updateCartQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        if (!cartData[itemId]) return;

        if (quantity === 0) {

            delete cartData[itemId][size];

            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }

        } else {
            cartData[itemId][size] = quantity;
        }

        setCartItems(cartData);

        if (user) {
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    // ================= CART COUNT =================
    const getCartCount = () => {

        let totalCount = 0;

        for (const item in cartItems) {
            for (const size in cartItems[item]) {
                totalCount += cartItems[item][size];
            }
        }

        return totalCount;
    };

    // ================= CART TOTAL =================
    const getCartAmount = () => {

        let totalAmount = 0;

        for (const item in cartItems) {

            const itemInfo = products.find(product => product._id === item);
            if (!itemInfo) continue;

            for (const size in cartItems[item]) {
                totalAmount += itemInfo.offerPrice * cartItems[item][size];
            }
        }

        return Math.floor(totalAmount * 100) / 100;
    };

    // ================= USE EFFECTS =================
    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    // ================= CONTEXT VALUE =================
    const value = {
        user,
        getToken,
        currency,
        router,
        isSeller,
        setIsSeller,
        userData,
        fetchUserData,
        products,
        fetchProductData,
        cartItems,
        setCartItems,
        addToCart,
        updateCartQuantity,
        getCartCount,
        getCartAmount
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};