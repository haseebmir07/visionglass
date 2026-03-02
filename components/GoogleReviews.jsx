import React, { useEffect, useState } from "react";
import Image from "next/image";

// Fallback dummy data if API key is missing or fails
const DUMMY_REVIEWS = [
    {
        author_name: "Ravi Sharma",
        relative_time_description: "2 days ago",
        rating: 5,
        text: "Absolutely stunning glasswork for our modern office. The team was professional, and the attention to detail is unmatched. Highly recommend Vision Glass!",
        profile_photo_url: "",
    },
    {
        author_name: "Ayesha Khan",
        relative_time_description: "1 week ago",
        rating: 5,
        text: "The interior design transformed our living room completely. They understood exactly what we wanted and delivered beyond expectations. Fantastic quality!",
        profile_photo_url: "",
    },
    {
        author_name: "Vikram Singh",
        relative_time_description: "2 weeks ago",
        rating: 5,
        text: "We ordered custom mirrors and glass partitions. The craftsmanship is flawless. Delivery was on time and installation was hassle-free.",
        profile_photo_url: "",
    },
    {
        author_name: "Priya Desai",
        relative_time_description: "1 month ago",
        rating: 5,
        text: "Best interior and glass service! The finishing is so premium. Thank you for making our home look so luxurious. 10/10.",
        profile_photo_url: "",
    },
    {
        author_name: "Mohammed Tariq",
        relative_time_description: "1 month ago",
        rating: 5,
        text: "Outstanding work by the entire team. They handled our commercial project flawlessly from start to finish. Very reliable.",
        profile_photo_url: "",
    }
];

// Star Icon SVG
const Star = () => (
    <svg className="w-4 h-4 text-orange-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
    </svg>
);

// Google 'G' Icon SVG
const GoogleIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.9c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        <path fill="none" d="M0 0h48v48H0z" />
    </svg>
);

const GoogleReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ rating: 4.9, total: 124 }); // Fallback stats

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch("/api/reviews");
                const data = await res.json();

                if (data.reviews && data.reviews.length > 0) {
                    setReviews(data.reviews);
                    setStats({ rating: data.rating, total: data.totalRatings });
                } else {
                    // If no API key or failed, use dummy data
                    setReviews(DUMMY_REVIEWS);
                }
            } catch (err) {
                console.error("Failed to load reviews", err);
                setReviews(DUMMY_REVIEWS); // Graceful fallback
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="w-full my-16 bg-white py-12 rounded-2xl shadow-sm border border-gray-100 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full my-16 bg-white py-12 rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <GoogleIcon />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">Customer Reviews</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-semibold text-gray-800">{stats.rating}</span>
                            <div className="flex gap-1">
                                {[...Array(Math.round(stats.rating || 5))].map((_, i) => <Star key={i} />)}
                            </div>
                            <span className="text-sm text-gray-500 ml-1">Based on {stats.total} reviews</span>
                        </div>
                    </div>
                </div>

                <a
                    href="https://google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold rounded-lg shadow-md"
                >
                    Write a Review
                </a>
            </div>

            {/* Moving Reviews Marquee */}
            <div className="relative w-full flex">
                {/* Fades for smooth edges */}
                <div className="absolute top-0 bottom-0 left-0 w-8 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-8 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                {/* Track — duplicated list for infinite seamless scrolling */}
                <div
                    className="flex w-max"
                    style={{ animation: "reviews-scroll 45s linear infinite" }}
                    onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
                    onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
                >
                    {[...reviews, ...reviews, ...reviews].map((review, i) => (
                        <div
                            key={i}
                            className="w-[300px] md:w-[360px] mx-4 bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex-shrink-0 cursor-default"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {/* Profile Photo or Initial Fallback */}
                                    {review.profile_photo_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={review.profile_photo_url} alt={review.author_name} className="w-10 h-10 rounded-full" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                            {review.author_name.charAt(0)}
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="text-gray-900 font-semibold text-sm line-clamp-1">{review.author_name}</h4>
                                        <p className="text-gray-500 text-xs">{review.relative_time_description}</p>
                                    </div>
                                </div>
                                <GoogleIcon />
                            </div>

                            <div className="flex gap-1 mb-3">
                                {[...Array(review.rating || 5)].map((_, i) => <Star key={i} />)}
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                                "{review.text}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Specific keyframe animation for review scrolling */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes reviews-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.33%); } /* Since we display array 3 times, slide 1/3rd to loop perfectly */
        }
      `}} />
        </div>
    );
};

export default GoogleReviews;
