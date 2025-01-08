import axios from "axios";

// Fetch data from the /api/ainzpop endpoint
export const fetchAinzpop = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/ainzpop`
    );
    console.log("Response from /api/ainzpop:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching /api/ainzpop:", error);
    throw error;
  }
};

// Fetch items from the /api/items endpoint
export const fetchItems = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/items`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching /api/items:", error);
    throw error;
  }
};
