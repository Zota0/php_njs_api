const ApiPath = "http://localhost:5500";

interface ErrorResponse {
    error: string;
}

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
}

interface RequestData {
    authorization_key: string;
    category: string;
    price_min: number;
    price_max: number;
}

const requestData: RequestData = {
    authorization_key: "a2b",
    category: "example_category",
    price_min: 10.0,
    price_max: 100.0
};

const fetchProducts = async () => {
    try {
        const response = await fetch(ApiPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Product[] | ErrorResponse = await response.json() as Product[] | ErrorResponse;

        if('error' in data) {
            console.error('Error from server:', (data as ErrorResponse).error);
        } else {
            console.log('Received products:', data as Product[]);
        }
    } catch(error) {
        console.error('Fetch error:', error);
    }
};

fetchProducts();
