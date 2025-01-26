import axios from "axios";

const API_URL = "http://localhost:8000/api/product/create"; // Replace with your actual API endpoint
const SITE_ID = "678c8f02e48d91e3a85e8880"; // Replace with a valid site ID
const REQUEST_COUNT = 10; // Number of products to create

const createFakeProduct = async () => {
  const fakeProduct = [
    {
      name: "Brics",
      unit: "pcs",
    },
    {
      name: "Koramental cement",
      unit: "bags",
    },
    {
      name: "iron bars",
      unit: "kg",
    },
    {
      name: "jalli",
      unit: "unit",
    },
    {
      name: "column box",
      unit: "pcs",
    },
    {
      name: "palagai",
      unit: "pcs",
    },
  ];

  try {
    fakeProduct.forEach(async (data) => {
      const response = await axios.post(
        `${API_URL}?siteId=${SITE_ID}`,
        {
          name: data.name,
          description: "summa desc",
          category: "summa catagory",
          unit: data.unit,
        },
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmdpbmVlcklkIjoiNjc4YzdkOGI2ZjM1MWU2YmY1MjkwN2ZlIiwic3VwZXJ2aXNvcklkIjpudWxsLCJyb2xlIjoiRW5naW5lZXIiLCJpYXQiOjE3Mzc2MDU4NDAsImV4cCI6MTczNzY0OTA0MH0.n-t-XuqGpH54OAzE6QMqiaHTeAEjNEg6xy4Q24EX2t8",
          },
        }
      );
      console.log(`Product created:`, response.data);
    });
  } catch (error) {
    console.error(
      `Failed to create product: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Run the function
createFakeProduct();
