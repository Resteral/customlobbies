export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Key, x-api-key'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'Missing target url parameter' });
    }

    try {
        const headers = {};
        // Forward essential headers
        for (const [key, value] of Object.entries(req.headers)) {
            const lowerKey = key.toLowerCase();
            if (
                lowerKey !== 'host' &&
                lowerKey !== 'origin' &&
                lowerKey !== 'referer' &&
                lowerKey !== 'content-length' &&
                lowerKey !== 'connection'
            ) {
                headers[key] = value;
            }
        }

        // Force JSON contentType for API calls
        if (url.includes('realestateapi.com')) {
            headers['content-type'] = 'application/json';
            headers['accept'] = 'application/json';
        }

        const fetchOptions = {
            method: req.method,
            headers: headers
        };

        if (req.method !== 'GET' && req.method !== 'HEAD') {
            fetchOptions.body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
        }

        const response = await fetch(url, fetchOptions);
        const text = await response.text();
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            data = { rawResponse: text };
        }
        
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy serverless error:', error);
        res.status(500).json({ error: 'Proxy serverless failed', details: error.message });
    }
}
