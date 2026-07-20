export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {

        const { lat, lon, radius, category } = req.body;

        const query = `
[out:json];
node["amenity"="${category}"](around:${radius},${lat},${lon});
out;
`;

        const response = await fetch(
            "https://overpass-api.de/api/interpreter",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "data=" + encodeURIComponent(query)
            }
        );

        const text = await response.text();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(response.status).send(text);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
}