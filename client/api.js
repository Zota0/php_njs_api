
var ApiPath = "http://kcjrhkdwbsfundbfelccqebxm.free.nf/";
var requestData = {
  authorization_key: "a2b",
  category: "example_category",
  price_min: 10,
  price_max: 100
};
var fetchProducts = async () => {
  try {
    const response = await fetch(ApiPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if ("error" in data) {
      console.error("Error from server:", data.error);
    } else {
      console.log("Received products:", data);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
fetchProducts();
