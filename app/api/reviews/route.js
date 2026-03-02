import { NextResponse } from "next/server";

export async function GET() {
    const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    const PLACE_ID = process.env.GOOGLE_PLACE_ID; // e.g. ChIJN1t_tDeuEmsRUsoyG83frY4

    // If local/missing keys, return a safe error object that we can catch on the frontend
    if (!API_KEY || !PLACE_ID) {
        return NextResponse.json(
            { error: "Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID in environment variables." },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews,user_ratings_total&key=${API_KEY}`
        );

        const data = await response.json();

        if (data.status !== "OK") {
            return NextResponse.json(
                { error: data.error_message || "Failed to fetch from Google APIs" },
                { status: 400 }
            );
        }

        // Format the response to be clean and minimal for our frontend
        const result = {
            businessName: data.result.name,
            rating: data.result.rating,
            totalRatings: data.result.user_ratings_total,
            reviews: data.result.reviews || [],
        };

        // Cache the response heavily using Next.js extending fetch. 
        // We only need reviews to update occasionally, not every render.
        return NextResponse.json(result, {
            headers: {
                'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400', // Cache on CDN for 1hr, stale up to 24hr
            },
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error fetching reviews." },
            { status: 500 }
        );
    }
}
