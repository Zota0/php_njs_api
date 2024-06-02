const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);

        if(req.method === "OPTIONS") {
            // Handle CORS preflight request
            return new Response(null, {
                status: 204, // No Content
                headers: CORS_HEADERS,
            });
        }

        let response;

        if(url.pathname === "/") {
            response = new Response(await Bun.file("index.html"), {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        } else if(url.pathname === "/api.js") {
            response = new Response(await Bun.file("api.js"), {
                headers: {
                    "Content-Type": "text/javascript",
                },
            });
        } else if(url.pathname === "/favicon.ico") {
            response = new Response(await Bun.file("favicon.ico"), {
                headers: {
                    "Content-Type": "image/x-icon",
                },
            });
        } else {
            response = new Response("Not Found", {
                status: 404,
            });
        }

        // Add CORS headers to all responses
        for(const [key, value] of Object.entries(CORS_HEADERS)) {
            response.headers.set(key, value);
        }

        return response;
    },
});

console.log(`Listening on http://localhost:${server.port}`);