export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed"
        });
    }

    try {

        const { lat, lon, radius, category } = req.body;

        const categoryMap = {
            restaurant: "catering.restaurant",
            hotel: "accommodation.hotel",
            cafe: "catering.cafe"
        };

        const geoCategory = categoryMap[category];

        if (!geoCategory) {
            return res.status(400).json({
                error: "Invalid category"
            });
        }

        const apiKey = process.env.GEOAPIFY_API_KEY;

        const url =
            `https://api.geoapify.com/v2/places?` +
            `categories=${geoCategory}` +
            `&filter=circle:${lon},${lat},${radius}` +
            `&limit=20` +
            `&apiKey=${apiKey}`;

        const response = await fetch(url);

        const data = await response.json();

        return res.status(response.status).json(data);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: err.message
        });
    }
}